import { fetchOgData } from "@/lib/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return Response.json({ error: "Missing url" }, { status: 400 });

  try {
    new URL(url); // validate
  } catch {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const data = await fetchOgData(url);
    return Response.json(data);
  } catch {
    return Response.json({ error: "Failed to fetch" }, { status: 400 });
  }
}
