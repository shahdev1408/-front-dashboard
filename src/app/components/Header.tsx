"use client";

import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 backdrop-blur-md bg-white/70 border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="search"
            placeholder="Search courses, learners, content..."
            className="w-full pl-10 pr-3 py-2 rounded-md border border-neutral-200 bg-black/2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Notification Button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-110"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>
      </div>
    </header>
  );
}
