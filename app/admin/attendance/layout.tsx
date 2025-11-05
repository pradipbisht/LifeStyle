"use client";

import { ReactNode } from "react";
import AdminLayout from "../AdminLayout";

interface AttendanceLayoutProps {
  children: ReactNode;
}

export default function AttendanceLayout({ children }: AttendanceLayoutProps) {
  return (
    <AdminLayout
      breadcrumbs={[{ label: "Attendance", href: "/admin/attendance" }]}
      title="Attendance Management">
      {children}
    </AdminLayout>
  );
}
