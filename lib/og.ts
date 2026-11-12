import * as cheerio from "cheerio";

export interface OgData {
  title: string;
  description: string;
  thumbnail: string | null;
  type: "website" | "video";
}

export async function fetchOgData(url: string): Promise<OgData> {
  let html = "";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "GoonSurf/1.0 OG-fetcher" },
      signal: AbortSignal.timeout(6000),
    });
    html = await res.text();
  } catch {
    return { title: url, description: "", thumbnail: null, type: "website" };
  }

  const $ = cheerio.load(html);
  const meta = (prop: string) =>
    $(`meta[property="${prop}"]`).attr("content") ||
    $(`meta[name="${prop}"]`).attr("content") ||
    "";

  const ogType = meta("og:type");
  const isVideo =
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com") ||
    ogType.startsWith("video");

  return {
    title: meta("og:title") || $("title").text() || url,
    description: meta("og:description") || meta("description") || "",
    thumbnail: meta("og:image") || null,
    type: isVideo ? "video" : "website",
  };
}
