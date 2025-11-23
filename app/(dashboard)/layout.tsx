import type { ReactNode } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { TopBar } from "@/components/dashboard/top-bar";
import { BottomNavBar } from "@/components/bottom-nav-bar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />
      <main className="flex flex-1 flex-col pb-20 lg:pb-6">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
      <BottomNavBar />
    </div>
  );
}

