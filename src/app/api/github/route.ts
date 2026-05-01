import { NextResponse } from "next/server";

/* ─── In-memory cache ─── */
interface CachedData {
  stars: number;
  forks: number;
  latestVersion: string;
  description: string;
}

const fallbackData: CachedData = {
  stars: 0,
  forks: 0,
  latestVersion: "v1.0.0",
  description: "",
};

let cachedData: CachedData | null = null;
let cachedAt = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/* ─── Fetch latest release version ─── */
async function fetchLatestVersion(): Promise<string> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/Qiyao-sudo/NeiLink/releases/latest",
      {
        headers: { "User-Agent": "NeiLink-Website" },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return "v1.0.0";
    const data = await res.json();
    return data.tag_name || "v1.0.0";
  } catch {
    return "v1.0.0";
  }
}

/* ─── GET handler ─── */
export async function GET() {
  const now = Date.now();

  // Return cached data if still fresh
  if (cachedData && now - cachedAt < CACHE_TTL) {
    return NextResponse.json(cachedData);
  }

  try {
    const res = await fetch(
      "https://api.github.com/repos/Qiyao-sudo/NeiLink",
      {
        headers: { "User-Agent": "NeiLink-Website" },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      // Return stale cache or fallback on API error
      return NextResponse.json(cachedData || fallbackData);
    }

    const data = await res.json();

    const latestVersion = await fetchLatestVersion();

    const result: CachedData = {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      latestVersion,
      description: data.description ?? "",
    };

    // Update cache
    cachedData = result;
    cachedAt = now;

    return NextResponse.json(result);
  } catch {
    // Return stale cache or fallback on any error
    return NextResponse.json(cachedData || fallbackData);
  }
}
