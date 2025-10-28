"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-800">404</h1>
        <p className="mb-6 text-lg text-gray-600">
          Oops! The page <span className="font-semibold">{pathname}</span> doesn’t exist.
        </p>
        <a
          href="/"
          className="text-white bg-blue-600 px-6 py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
