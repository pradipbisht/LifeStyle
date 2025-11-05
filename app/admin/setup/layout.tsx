"use client";

import { ReactNode } from "react";
import AdminLayout from "../AdminLayout";

interface SetupLayoutProps {
  children: ReactNode;
}

export default function SetupLayout({ children }: SetupLayoutProps) {
  return (
    <AdminLayout
      breadcrumbs={[{ label: "Setup", href: "/admin/setup" }]}
      title="Database Setup">
      {children}
    </AdminLayout>
  );
}
