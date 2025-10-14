"use client";

import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppShell from "@/components/app-shell";
import "./globals.css";

// Metadata can't be exported from a client component.
// We can move it to a new server-side layout file if needed,
// but for this scaffold, we'll comment it out.
// export const metadata: Metadata = {
//   title: "LinguaCraft AI",
//   description: "Multilingual Smart Essay & Article Writer",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noShellRoutes = ["/login", "/signup"];
  const showShell = !noShellRoutes.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Code+Pro:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          {showShell ? <AppShell>{children}</AppShell> : children}
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
