"use client";

import { ReactNode } from "react";
import AdminLayout from "../AdminLayout";

interface EventsLayoutProps {
  children: ReactNode;
}

export default function EventsLayout({ children }: EventsLayoutProps) {
  return (
    <AdminLayout breadcrumbs={[{ label: "Events", href: "/admin/events" }]}>
      {children}
    </AdminLayout>
  );
}
