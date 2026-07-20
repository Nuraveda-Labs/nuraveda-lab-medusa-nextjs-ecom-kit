const DEFAULT_BACKEND_URL = "http://127.0.0.1:9000";

export const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL ?? DEFAULT_BACKEND_URL;
export const MEDUSA_PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY ?? "";
export const MEDUSA_REGION_ID = process.env.MEDUSA_REGION_ID ?? process.env.NEXT_PUBLIC_MEDUSA_REGION_ID ?? "";

export async function medusaStoreFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!MEDUSA_PUBLISHABLE_KEY) {
    throw new Error("MEDUSA_PUBLISHABLE_KEY is not configured.");
  }

  const url = new URL(path, MEDUSA_BACKEND_URL);
  const headers = new Headers(init.headers);
  headers.set("x-publishable-api-key", MEDUSA_PUBLISHABLE_KEY);
  headers.set("accept", "application/json");

  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Medusa request failed (${response.status}): ${message}`);
  }

  return response.json() as Promise<T>;
}
