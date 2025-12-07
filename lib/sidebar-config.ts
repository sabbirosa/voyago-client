import {
  IconCalendar,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconReport,
  IconUsers,
  type Icon,
} from "@tabler/icons-react";

import type { UserRole } from "@/lib/auth/useAuth";

type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
};

type DocumentItem = {
  name: string;
  url: string;
  icon: Icon;
};

type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
};

export type SidebarConfig = {
  user: SidebarUser;
  navMain: NavItem[];
  documents: DocumentItem[];
};

type RoleKey = NonNullable<UserRole> | "GUEST";

const baseConfig: SidebarConfig = {
  user: {
    name: "Voyago User",
    email: "user@example.com",
    avatar: "/avatars/default.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Trips",
      url: "/dashboard/trips",
      icon: IconFolder,
    },
    {
      title: "Explore",
      url: "/explore",
      icon: IconChartBar,
    },
  ],
  documents: [
    {
      name: "Itineraries",
      url: "/dashboard/itineraries",
      icon: IconFileDescription,
    },
    {
      name: "Guides",
      url: "/dashboard/guides",
      icon: IconFileAi,
    },
  ],
};

export const SIDEBAR_CONFIG_BY_ROLE: Record<RoleKey, SidebarConfig> = {
  GUEST: baseConfig,
  TOURIST: {
    ...baseConfig,
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "My Bookings",
        url: "/dashboard/tourist/bookings",
        icon: IconFolder,
      },
      {
        title: "Explore",
        url: "/explore",
        icon: IconChartBar,
      },
    ],
  },
  GUIDE: {
    ...baseConfig,
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Listings",
        url: "/dashboard/listings",
        icon: IconCamera,
      },
      {
        title: "Bookings",
        url: "/dashboard/guide/bookings",
        icon: IconFolder,
      },
      {
        title: "Availability",
        url: "/dashboard/guide/availability",
        icon: IconCalendar,
      },
    ],
    documents: [
      {
        name: "Tour Playbooks",
        url: "/dashboard/playbooks",
        icon: IconFileWord,
      },
      {
        name: "Reports",
        url: "/dashboard/reports",
        icon: IconReport,
      },
      {
        name: "Data Library",
        url: "/dashboard/data",
        icon: IconDatabase,
      },
    ],
  },
  ADMIN: {
    ...baseConfig,
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Users",
        url: "/dashboard/admin/users",
        icon: IconUsers,
      },
      {
        title: "Listings",
        url: "/dashboard/admin/listings",
        icon: IconFileDescription,
      },
      {
        title: "Analytics",
        url: "/dashboard/admin/analytics",
        icon: IconChartBar,
      },
    ],
    documents: [
      {
        name: "Reports",
        url: "/dashboard/admin/reports",
        icon: IconReport,
      },
    ],
  },
};

export function getSidebarConfigForRole(role: UserRole | null): SidebarConfig {
  const key: RoleKey = role ?? "GUEST";
  return SIDEBAR_CONFIG_BY_ROLE[key];
}
