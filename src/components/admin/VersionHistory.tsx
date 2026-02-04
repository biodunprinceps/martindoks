'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { History, RotateCcw, Eye } from 'lucide-react';
import * as diff from 'diff';

interface Version {
  id: string;
  version: number;
  title?: string;
  username?: string;
  createdAt: Date;
  changes?: any;
}

interface VersionHistoryProps {
  entityType: string;
  entityId: string;
  onRestore?: (version: number) => void;
}

export function VersionHistory({ entityType, entityId, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [comparison, setComparison] = useState<any>(null);

  useEffect(() => {
    loadVersions();
  }, [entityType, entityId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/versions?entityType=${entityType}&entityId=${entityId}`
      );
      const data = await response.json();
      setVersions(data.versions || []);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const compareVersions = async (version1: number, version2: number) => {
    try {
      const response = await fetch(
        `/api/admin/versions?entityType=${entityType}&entityId=${entityId}&version1=${version1}&version2=${version2}`
      );
      const data = await response.json();
      setComparison(data);
      setSelectedVersion(version2);
    } catch (error) {
      console.error('Error comparing versions:', error);
    }
  };

  const renderDiff = (diffParts: any[]) => {
    if (!diffParts || !Array.isArray(diffParts)) return null;

    return (
      <div className="font-mono text-sm">
        {diffParts.map((part: any, index: number) => {
          const lines = part.value.split('\n');
          return lines.map((line: string, lineIndex: number) => {
            if (!line) return null;
            return (
              <div
                key={`${index}-${lineIndex}`}
                className={`${
                  part.added
                    ? 'bg-green-100 text-green-800'
                    : part.removed
                    ? 'bg-red-100 text-red-800'
                    : 'bg-transparent'
                }`}
              >
                {part.added && '+'}
                {part.removed && '-'}
                {line}
              </div>
            );
          });
        })}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading version history...</div>;
  }

  if (versions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No version history available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History ({versions.length} versions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Version {version.version}</span>
                    {version.title && (
                      <span className="text-sm text-muted-foreground">{version.title}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    {version.username && <span>by {version.username}</span>}
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => compareVersions(versions[index - 1].version, version.version)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Compare
                    </Button>
                  )}
                  {onRestore && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore(version.version)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {comparison && (
        <Card>
          <CardHeader>
            <CardTitle>
              Comparing Version {comparison.version1.version} vs Version {comparison.version2.version}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparison.diff?.parts && (
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                  {renderDiff(comparison.diff.parts)}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-2">Version {comparison.version1.version}</p>
                  <p className="text-muted-foreground">
                    {formatDistanceToNow(new Date(comparison.version1.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Version {comparison.version2.version}</p>
                  <p className="text-muted-foreground">
                    {formatDistanceToNow(new Date(comparison.version2.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

