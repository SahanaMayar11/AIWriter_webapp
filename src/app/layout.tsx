"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppShell from "@/components/app-shell";
import "./globals.css";
import { FirebaseClientProvider } from "@/firebase";
import LandingLayout from "./landing-layout";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const publicRoutes = ["/", "/login", "/signup", "/features"];
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>SpellAura AI</title>
        <meta name="description" content="Your AI-Powered Writing Companion" />
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <FirebaseClientProvider>
            <SidebarProvider>
              {isPublicRoute ? (
                <LandingLayout>{children}</LandingLayout>
              ) : (
                <AppShell>{children}</AppShell>
              )}
            </SidebarProvider>
          </FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
