'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  History,
  LayoutDashboard,
  PenSquare,
  Settings,
  SpellCheck,
  ChevronDown,
  WandSparkles,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  { href: '/history', icon: History, label: 'History' },
];

const featureItems = [
  { href: '/outline', icon: FileText, label: 'New Outline' },
  { href: '/draft', icon: PenSquare, label: 'New Draft' },
  { href: '/grammar-check', icon: SpellCheck, label: 'Grammar Check' },
];

export default function MainNav() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <Sidebar>
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
          <Collapsible defaultOpen>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={featureItems.some((item) => pathname.startsWith(item.href))}
                  icon={<WandSparkles />}
                  className="w-full justify-between"
                  suffixIcon={<ChevronDown className='transform transition-transform duration-200 data-[state=open]:rotate-180'/>}
                >
                  Features
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
              <SidebarMenu className="ml-4 border-l pl-4 py-2">
                {featureItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      icon={<item.icon />}
                      tooltip={item.label}
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
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
        >
          <Link href="/settings" />
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
