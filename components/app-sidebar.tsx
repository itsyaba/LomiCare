"use client";
import * as React from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageCircle,
  Newspaper,
  UserCircle,
  Settings,
  ShieldCheck,
  Bell,
  Monitor,
  CreditCard,
  Coffee,
  CalendarDays,
  MapPin,
  Leaf
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { User } from "@/lib/auth";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Daily Check-in",
      url: "/checkin",
      icon: ClipboardCheck,
    },
    {
      title: "AI Companion",
      url: "/chat",
      icon: MessageCircle,
    },
    {
      title: "Daily Ritual",
      url: "/ritual",
      icon: Coffee,
    },
    {
      title: "Peace Plan",
      url: "/peace-plan",
      icon: CalendarDays,
    },
    {
      title: "Retreat Mode",
      url: "/retreat",
      icon: MapPin,
      badge: "Kuriftu",
    },
    {
      title: "Wellness Feed",
      url: "/feed",
      icon: Newspaper,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: UserCircle,
    },
    {
      title: "Setting",
      url: "/dashboard/setting",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/dashboard/setting/profile",
          icon: UserCircle,
        },
        {
          title: "Security",
          url: "/dashboard/setting/security",
          icon: ShieldCheck,
        },
        {
          title: "Notifications",
          url: "/dashboard/setting/notifications",
          icon: Bell,
        },
        {
          title: "Appearance",
          url: "/dashboard/setting/preference",
          icon: Monitor,
        },
        {
          title: "Billing",
          url: "/dashboard/setting/billing",
          icon: CreditCard,
        },
      ],
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Partial<User>;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  if (!user) {
    throw new Error("AppSidebar requires a user but received undefined.");
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <Leaf className="!size-5 text-primary" />
                <span className="font-display text-xl font-semibold">
                  Selam
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
