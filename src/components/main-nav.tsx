
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  History,
  LayoutDashboard,
  PenSquare,
  Settings,
  WandSparkles,
  CheckSquare,
  Package,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useUser } from '@/firebase';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/playground', icon: WandSparkles, label: 'Playground' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/features', icon: Package, label: 'Features' },
];

const featureItems = [
  { href: '/outline', icon: FileText, label: 'New Outline' },
  { href: '/draft', icon: PenSquare, label: 'New Draft' },
  { href: '/grammar-check', icon: CheckSquare, label: 'Grammar Check' },
  { href: '/improve-style', icon: WandSparkles, label: 'Improve Style' },
]

export default function MainNav() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Icons.logo className="size-7 text-primary" />
          <span className="text-lg font-semibold text-sidebar-foreground font-headline">
            SpellAura AI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                icon={<item.icon />}
                tooltip={item.label}
              >
                <Link href={item.href}>{item.label}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu>
            {featureItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    icon={<item.icon />}
                    tooltip={item.label}
                >
                    <Link href={item.href}>{item.label}</Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3">
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-medium text-sm text-sidebar-foreground">
              {user?.displayName || 'User'}
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              {user?.email || 'user@example.com'}
            </span>
          </div>
        </div>
        <SidebarMenuButton
          asChild
          icon={<Settings />}
          tooltip="Settings"
          size="icon"
          isActive={pathname === '/settings'}
        >
          <Link href="/settings" />
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
