"use client";

import MainNav from "@/components/main-nav";
import PageHeader from "@/components/page-header";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar>
        <MainNav />
      </Sidebar>
      <SidebarInset>
        <PageHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background/95">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
