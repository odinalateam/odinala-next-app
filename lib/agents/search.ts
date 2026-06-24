import { tavily } from "@tavily/core";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY! });

export async function webSearch(query: string): Promise<string> {
  const res = await client.search(query, { maxResults: 5, searchDepth: "basic" });
  if (!res.results.length) return "";
  return res.results.map((r) => `${r.title}: ${r.content}`).join("\n\n");
}
