"use client";

import { BarChart, Compass, Layout, List, ListChecks, User, BookCopy  } from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";
import { auth, currentUser } from '@clerk/nextjs';
import { isAdmin } from '@/lib/admin';

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
]

const adminRoutes = [
  {
    icon: ListChecks,
    label: "Categories",
    href: "/admin/category",
  },
  {
    icon: User,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: BookCopy,
    label: "Courses",
    href: "/admin/courses",
  },
]

export const  SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");
  const isAdminPage = pathname?.includes("/admin");

  const routes = isAdminPage ? adminRoutes : (isTeacherPage ? teacherRoutes : guestRoutes);

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}