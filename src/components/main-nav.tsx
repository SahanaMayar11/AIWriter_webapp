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
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { useUser } from '@/firebase';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/outline', icon: FileText, label: 'Outline Generator' },
  { href: '/draft', icon: PenSquare, label: 'Draft Generator' },
  { href: '/grammar-check', icon: SpellCheck, label: 'Grammar Check' },
  { href: '/history', icon: History, label: 'History' },
];

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

export default function MainNav() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Icons.logo className="size-7 text-primary" />
          <span className="text-lg font-semibold text-sidebar-foreground font-headline">
            LinguaCraft AI
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
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User avatar'}
                width={36}
                height={36}
              />
            ) : (
              userAvatar && (
                <Image
                  src={userAvatar.imageUrl}
                  alt={userAvatar.description}
                  width={36}
                  height={36}
                  data-ai-hint={userAvatar.imageHint}
                />
              )
            )}
            <AvatarFallback>
              {user?.displayName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
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
