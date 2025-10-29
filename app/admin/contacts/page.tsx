"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import StatsCard from "./components/StatsCard";
import ContactsTable from "./components/ContactsTable";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import AdminLayout from "../AdminLayout";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: any;
  userId?: string;
}

export default function AdminContactsPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (userProfile && userProfile.role !== "admin") {
      router.push("/");
      return;
    }
  }, [user, userProfile, router]);

  // Fetch contacts in real-time
  useEffect(() => {
    if (!user || !userProfile || userProfile.role !== "admin") return;

    const contactsQuery = query(
      collection(db, "contacts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(contactsQuery, (snapshot) => {
      const contactsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];

      setContacts(contactsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userProfile]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const totalContacts = contacts.length;
  const newContacts = contacts.filter((c) => c.status === "new").length;
  const repliedContacts = contacts.filter((c) => c.status === "replied").length;

  if (!user || !userProfile || userProfile.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Loading contacts...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={`${playfair.className} text-3xl font-bold text-gray-900`}>
              Contact Messages
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and respond to contact form submissions
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}>
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCard
          totalContacts={totalContacts}
          newContacts={newContacts}
          repliedContacts={repliedContacts}
        />

        {/* Contacts Table */}
        <ContactsTable contacts={contacts} onRefresh={handleRefresh} />
      </div>
    </AdminLayout>
  );
}
