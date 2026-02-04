import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  verified: boolean;
  verificationToken: string | null;
  verifiedAt: Date | null;
  subscribedAt: Date;
  unsubscribedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const DATA_DIR = join(process.cwd(), "data");
const SUBSCRIBERS_FILE = join(DATA_DIR, "newsletter-subscribers.json");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

// Load subscribers from file
async function loadSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    await ensureDataDir();
    console.log("Loading newsletter subscribers from:", SUBSCRIBERS_FILE);
    const data = await readFile(SUBSCRIBERS_FILE, "utf-8");
    console.log("Subscribers file size:", data.length, "bytes");
    const subscribers = JSON.parse(data);
    console.log("Loaded subscribers count:", subscribers.length);
    // Convert date strings back to Date objects
    return subscribers.map((sub: any) => ({
      ...sub,
      subscribedAt: new Date(sub.subscribedAt),
      verifiedAt: sub.verifiedAt ? new Date(sub.verifiedAt) : null,
      unsubscribedAt: sub.unsubscribedAt ? new Date(sub.unsubscribedAt) : null,
      createdAt: new Date(sub.createdAt),
      updatedAt: new Date(sub.updatedAt),
    }));
  } catch (error) {
    console.error("Error loading newsletter subscribers:", error);
    console.error("Attempted path:", SUBSCRIBERS_FILE);
    // File doesn't exist yet, return empty array
    return [];
  }
}

// Save subscribers to file
async function saveSubscribers(
  subscribers: NewsletterSubscriber[]
): Promise<void> {
  await ensureDataDir();
  await writeFile(
    SUBSCRIBERS_FILE,
    JSON.stringify(subscribers, null, 2),
    "utf-8"
  );
}

// Generate a unique verification token
function generateVerificationToken(): string {
  return crypto.randomUUID() + "-" + Date.now().toString(36);
}

// Find subscriber by email
export async function findSubscriberByEmail(
  email: string
): Promise<NewsletterSubscriber | null> {
  const subscribers = await loadSubscribers();
  return (
    subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase()) ||
    null
  );
}

// Find subscriber by verification token
export async function findSubscriberByToken(
  token: string
): Promise<NewsletterSubscriber | null> {
  const subscribers = await loadSubscribers();
  return subscribers.find((s) => s.verificationToken === token) || null;
}

// Create a new subscriber
export async function createSubscriber(
  email: string
): Promise<NewsletterSubscriber> {
  const existing = await findSubscriberByEmail(email);

  if (existing) {
    // If already exists but not verified, update the token
    if (!existing.verified) {
      existing.verificationToken = generateVerificationToken();
      existing.updatedAt = new Date();
      const subscribers = await loadSubscribers();
      const index = subscribers.findIndex((s) => s.id === existing.id);
      if (index !== -1) {
        subscribers[index] = existing;
        await saveSubscribers(subscribers);
      }
      return existing;
    }
    throw new Error("Email already subscribed");
  }

  const subscriber: NewsletterSubscriber = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    verified: false,
    verificationToken: generateVerificationToken(),
    verifiedAt: null,
    subscribedAt: new Date(),
    unsubscribedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const subscribers = await loadSubscribers();
  subscribers.push(subscriber);
  await saveSubscribers(subscribers);

  return subscriber;
}

// Verify a subscriber
export async function verifySubscriber(
  token: string
): Promise<NewsletterSubscriber | null> {
  const subscribers = await loadSubscribers();
  const subscriber = subscribers.find((s) => s.verificationToken === token);

  if (!subscriber) {
    return null;
  }

  subscriber.verified = true;
  subscriber.verifiedAt = new Date();
  subscriber.verificationToken = null;
  subscriber.updatedAt = new Date();

  await saveSubscribers(subscribers);
  return subscriber;
}

// Get all verified subscribers
export async function getVerifiedSubscribers(): Promise<
  NewsletterSubscriber[]
> {
  const subscribers = await loadSubscribers();
  return subscribers.filter((s) => s.verified && !s.unsubscribedAt);
}
