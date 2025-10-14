"use client";

import { usePathname } from "next/navigation";
import AppShell from "@/components/app-shell";
import LandingLayout from "./landing-layout";

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname === '/features';

  return isPublicRoute && pathname !== '/features' ? (
    <LandingLayout>{children}</LandingLayout>
  ) : (
    <AppShell>{children}</AppShell>
  );
}
