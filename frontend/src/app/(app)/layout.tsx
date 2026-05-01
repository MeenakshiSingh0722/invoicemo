"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import Navbar from "@/components/layout/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
