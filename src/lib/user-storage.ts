import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

export type Permission =
  | "manage_blog"
  | "manage_properties"
  | "manage_testimonials"
  | "manage_subscribers"
  | "manage_users"
  | "manage_settings";

export interface AdminUser {
  id: string;
  username: string;
  password: string; // In production, this should be hashed
  role?: "admin" | "editor";
  permissions?: Permission[]; // If empty or undefined, user has no access except dashboard
  createdAt: string;
  lastLogin?: string;
}

const DATA_DIR = join(process.cwd(), "data");
const USERS_FILE = join(DATA_DIR, "admin-users.json");

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

async function loadUsers(): Promise<AdminUser[]> {
  try {
    await ensureDataDir();
    console.log("Loading users from:", USERS_FILE);
    const data = await readFile(USERS_FILE, "utf-8");
    console.log("Users file size:", data.length, "bytes");
    const users = JSON.parse(data);
    console.log("Loaded users count:", users.length);
    return users;
  } catch (error) {
    console.error("Error loading users:", error);
    console.error("Attempted path:", USERS_FILE);
    // File doesn't exist, return empty array
    return [];
  }
}

async function saveUsers(users: AdminUser[]): Promise<void> {
  await ensureDataDir();
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function getAllUsers(): Promise<AdminUser[]> {
  return await loadUsers();
}

export async function getUserByUsername(
  username: string
): Promise<AdminUser | null> {
  const users = await loadUsers();
  return (
    users.find((u) => u.username.toLowerCase() === username.toLowerCase()) ||
    null
  );
}

export async function getUserById(id: string): Promise<AdminUser | null> {
  const users = await loadUsers();
  return users.find((u) => u.id === id) || null;
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<AdminUser | null> {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }

  // Simple password comparison (in production, use bcrypt or similar)
  if (user.password === password) {
    // Update last login
    user.lastLogin = new Date().toISOString();
    await updateUser(user.id, { lastLogin: user.lastLogin });
    return user;
  }

  return null;
}

export async function createUser(
  userData: Omit<AdminUser, "id" | "createdAt">
): Promise<AdminUser> {
  const users = await loadUsers();

  // Check if username already exists
  const existingUser = users.find(
    (u) => u.username.toLowerCase() === userData.username.toLowerCase()
  );
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const newUser: AdminUser = {
    ...userData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

export async function updateUser(
  id: string,
  updates: Partial<AdminUser>
): Promise<AdminUser | null> {
  const users = await loadUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return null;
  }

  // If updating username, check for duplicates
  if (updates.username) {
    const existingUser = users.find(
      (u) =>
        u.id !== id &&
        u.username.toLowerCase() === updates.username!.toLowerCase()
    );
    if (existingUser) {
      throw new Error("Username already exists");
    }
  }

  users[index] = {
    ...users[index],
    ...updates,
  };

  await saveUsers(users);
  return users[index];
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const users = await loadUsers();
    const initialLength = users.length;
    const filtered = users.filter((u) => u.id !== id);

    if (filtered.length === initialLength) {
      return false; // User not found
    }

    await saveUsers(filtered);
    return true;
  } catch (error: any) {
    console.error("Error in deleteUser:", error);
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

// Initialize default users if they don't exist
export async function initializeDefaultUsers(): Promise<void> {
  const users = await loadUsers();

  // Create a master admin user if it doesn't exist
  const adminExists = users.find((u) => u.username.toLowerCase() === "admin");
  if (!adminExists) {
    const { getAllPermissions } = await import("./permissions");
    await createUser({
      username: "admin",
      password: "admin",
      role: "admin" as const,
      permissions: getAllPermissions(), // Admin has all permissions
    });
  }
}
