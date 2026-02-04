// Version History Utility
import { prisma } from './prisma';
import { isDatabaseEnabled } from './db-config';
import * as diff from 'diff';

export interface ContentVersion {
  id: string;
  entityType: string;
  entityId: string;
  version: number;
  title?: string;
  content: any;
  changes?: any;
  createdBy?: string;
  username?: string;
  createdAt: Date;
}

// Create a new version
export async function createVersion(data: {
  entityType: string;
  entityId: string;
  title?: string;
  content: any;
  previousContent?: any;
  createdBy?: string;
  username?: string;
}): Promise<ContentVersion> {
  // Get current version number
  const currentVersion = await getLatestVersion(data.entityType, data.entityId);
  const versionNumber = (currentVersion?.version || 0) + 1;

  // Calculate changes
  const changes = data.previousContent
    ? calculateChanges(data.previousContent, data.content)
    : null;

  if (isDatabaseEnabled() && prisma) {
    const version = await prisma.contentVersion.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        version: versionNumber,
        title: data.title,
        content: JSON.parse(JSON.stringify(data.content)),
        changes: changes ? JSON.parse(JSON.stringify(changes)) : null,
        createdBy: data.createdBy,
        username: data.username,
      },
    });

    return {
      id: version.id,
      entityType: version.entityType,
      entityId: version.entityId,
      version: version.version,
      title: version.title || undefined,
      content: version.content as any,
      changes: version.changes as any,
      createdBy: version.createdBy || undefined,
      username: version.username || undefined,
      createdAt: version.createdAt,
    };
  } else {
    // Fallback to localStorage
    const versions = getVersionsFromStorage();
    const newVersion: ContentVersion = {
      id: Date.now().toString(),
      entityType: data.entityType,
      entityId: data.entityId,
      version: versionNumber,
      title: data.title,
      content: data.content,
      changes,
      createdBy: data.createdBy,
      username: data.username,
      createdAt: new Date(),
    };
    versions.push(newVersion);
    localStorage.setItem('content_versions', JSON.stringify(versions));
    return newVersion;
  }
}

// Get all versions for an entity
export async function getVersions(
  entityType: string,
  entityId: string
): Promise<ContentVersion[]> {
  if (isDatabaseEnabled() && prisma) {
    const versions = await prisma.contentVersion.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { version: 'desc' },
    });

    return versions.map((v: any) => ({
      id: v.id,
      entityType: v.entityType,
      entityId: v.entityId,
      version: v.version,
      title: v.title || undefined,
      content: v.content as any,
      changes: v.changes as any,
      createdBy: v.createdBy || undefined,
      username: v.username || undefined,
      createdAt: v.createdAt,
    }));
  } else {
    const versions = getVersionsFromStorage();
    return versions.filter(
      (v) => v.entityType === entityType && v.entityId === entityId
    );
  }
}

// Get latest version
export async function getLatestVersion(
  entityType: string,
  entityId: string
): Promise<ContentVersion | null> {
  const versions = await getVersions(entityType, entityId);
  return versions.length > 0 ? versions[0] : null;
}

// Get specific version
export async function getVersion(
  entityType: string,
  entityId: string,
  version: number
): Promise<ContentVersion | null> {
  const versions = await getVersions(entityType, entityId);
  return versions.find((v) => v.version === version) || null;
}

// Calculate changes between two versions
function calculateChanges(oldContent: any, newContent: any): any {
  const oldStr = typeof oldContent === 'string' ? oldContent : JSON.stringify(oldContent, null, 2);
  const newStr = typeof newContent === 'string' ? newContent : JSON.stringify(newContent, null, 2);

  const differences = diff.diffLines(oldStr, newStr);
  const changes = {
    added: 0,
    removed: 0,
    modified: 0,
    parts: differences.map((part) => ({
      value: part.value,
      added: part.added || false,
      removed: part.removed || false,
    })),
  };

  differences.forEach((part) => {
    if (part.added) changes.added += part.count || 0;
    if (part.removed) changes.removed += part.count || 0;
    if (!part.added && !part.removed) changes.modified += part.count || 0;
  });

  return changes;
}

// Compare two versions
export async function compareVersions(
  entityType: string,
  entityId: string,
  version1: number,
  version2: number
): Promise<{ version1: ContentVersion; version2: ContentVersion; diff: any } | null> {
  const v1 = await getVersion(entityType, entityId, version1);
  const v2 = await getVersion(entityType, entityId, version2);

  if (!v1 || !v2) return null;

  const diffResult = calculateChanges(v1.content, v2.content);

  return {
    version1: v1,
    version2: v2,
    diff: diffResult,
  };
}

// Helper function for localStorage fallback
function getVersionsFromStorage(): ContentVersion[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('content_versions');
  if (!stored) return [];
  try {
    const versions = JSON.parse(stored);
    return versions.map((v: any) => ({
      ...v,
      createdAt: new Date(v.createdAt),
    }));
  } catch {
    return [];
  }
}

