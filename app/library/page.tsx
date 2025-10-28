'use client'
import { useState } from "react";

// Dummy data
const resources = [
  { id: 1, name: "Course Syllabus Template.pdf", type: "document", size: "2.4 MB", date: "2024-03-15" },
  { id: 2, name: "UX Design Tutorial.mp4", type: "video", size: "45.2 MB", date: "2024-03-14" },
  { id: 3, name: "React Components Guide.pdf", type: "document", size: "1.8 MB", date: "2024-03-13" },
  { id: 4, name: "Hero Banner.png", type: "image", size: "856 KB", date: "2024-03-12" },
  { id: 5, name: "Authentication Flow.mp4", type: "video", size: "32.1 MB", date: "2024-03-11" },
  { id: 6, name: "API Documentation.md", type: "code", size: "124 KB", date: "2024-03-10" },
  { id: 7, name: "Dashboard Wireframe.png", type: "image", size: "1.2 MB", date: "2024-03-09" },
  { id: 8, name: "Database Schema.pdf", type: "document", size: "980 KB", date: "2024-03-08" },
];

const icons: Record<string, string> = {
  document: "📄",
  video: "🎬",
  image: "🖼️",
  code: "💻",
};

export default function ContentLibrary() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredResources = resources.filter((r) => {
    const matchesType = activeTab === "all" || r.type === activeTab;
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <main className="p-6 space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Content Library</h1>
          <p className="text-gray-500">Manage your learning resources and materials</p>
        </div>
        <button
          onClick={() => alert("Upload dialog would open here")}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:opacity-90 active:scale-95 transition"
        >
          ⬆️ Upload Resource
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {["all", "document", "video", "image", "code"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-4 py-1.5 rounded-md text-sm font-medium transition 
              ${activeTab === tab
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"}`}
          >
            {tab === "all" ? "All" : tab + "s"}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {filteredResources.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-xl border border-gray-200 bg-white/80 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="text-3xl">{icons[r.type] || "📁"}</div>
              <button
                onClick={() => alert(`Options for ${r.name}`)}
                className="text-gray-400 hover:text-gray-600"
              >
                ⋮
              </button>
            </div>

            <h3 className="font-semibold text-gray-800 mb-2 truncate hover:text-blue-600">
              {r.name}
            </h3>

            <div className="text-xs text-gray-500 flex justify-between">
              <span>{r.size}</span>
              <span>{r.date}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
