"use client";
import * as React from "react";
import {
  IconDashboard,
  IconSettings,
  IconUserCircle,
  IconShieldLock,
  IconBell,
  IconDeviceDesktop,
  IconCreditCard,
  IconHeartRateMonitor,
  IconMessageCircle,
  IconNews,
  IconLeaf,
} from "@tabler/icons-react";

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
import { User } from "@/lib/auth";
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Daily Check-in",
      url: "/checkin",
      icon: IconHeartRateMonitor,
    },
    {
      title: "AI Companion",
      url: "/chat",
      icon: IconMessageCircle,
    },
    {
      title: "Wellness Feed",
      url: "/feed",
      icon: IconNews,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: IconUserCircle,
    },
    {
      title: "Setting",
      url: "/dashboard/setting",
      icon: IconSettings,
      items: [
        {
          title: "Profile",
          url: "/dashboard/setting/profile",
          icon: IconUserCircle,
        },
        {
          title: "Security",
          url: "/dashboard/setting/security",
          icon: IconShieldLock,
        },
        {
          title: "Notifications",
          url: "/dashboard/setting/notifications",
          icon: IconBell,
        },
        {
          title: "Appearance",
          url: "/dashboard/setting/preference",
          icon: IconDeviceDesktop,
        },
        {
          title: "Billing",
          url: "/dashboard/setting/billing",
          icon: IconCreditCard,
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
                <IconLeaf className="!size-5 text-primary" />
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
