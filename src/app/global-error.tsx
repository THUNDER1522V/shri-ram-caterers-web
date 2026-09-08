"use client";

import { fontBody } from "@/lib/fonts";
import "@/app/globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={fontBody.variable}>
      <body className="flex min-h-screen items-center justify-center bg-[#FAF8F5] p-6 text-center font-body text-[#18181B]">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-[#71717A]">
            A critical error occurred. Please refresh or try again.
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-btn bg-[#C5A880] px-6 py-3 font-medium text-white transition hover:bg-[#9C7A44]"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
