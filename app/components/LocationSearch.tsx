"use client";

import { useState } from "react";
import { type GeoResult, searchLocation } from "@/lib/weather";

export function LocationSearch({
  onSelect,
}: {
  onSelect: (result: GeoResult) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const res = await searchLocation(query);
    setResults(res);
    setLoading(false);
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-zinc-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "..." : "Search"}
        </button>
      </form>
      {results.length > 0 && (
        <ul className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
          {results.map((r, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  onSelect(r);
                  setResults([]);
                  setQuery("");
                }}
                className="w-full px-3 py-2 text-left text-sm transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {r.name}
                </span>
                <span className="ml-2 text-zinc-400">
                  {r.admin1 ? `${r.admin1}, ` : ""}
                  {r.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
