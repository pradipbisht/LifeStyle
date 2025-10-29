"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Reply, Eye } from "lucide-react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import ReplyDialog from "./ReplyDialog";
// import ReplyDialog from "./ReplyDialog";

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

interface ContactsTableProps {
  contacts: Contact[];
  onRefresh: () => void;
}

export default function ContactsTable({
  contacts,
  onRefresh,
}: ContactsTableProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleMarkAsRead = async (contactId: string) => {
    try {
      await updateDoc(doc(db, "contacts", contactId), {
        status: "read",
      });
      onRefresh();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      setDeletingId(contactId);
      await deleteDoc(doc(db, "contacts", contactId));
      onRefresh();
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  };

  const handleReply = (contact: Contact) => {
    setSelectedContact(contact);
    setIsReplyOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">New</Badge>;
      case "read":
        return <Badge variant="secondary">Read</Badge>;
      case "replied":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Replied
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground">
                      No contact messages yet
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="text-xs">
                        {formatDate(contact.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell className="text-sm">{contact.email}</TableCell>
                      <TableCell className="text-sm">
                        {contact.phone || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {contact.subject}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm text-muted-foreground">
                          {contact.message}
                        </p>
                      </TableCell>
                      <TableCell>{getStatusBadge(contact.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {contact.status === "new" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsRead(contact.id)}
                              title="Mark as read">
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReply(contact)}
                            title="Reply">
                            <Reply className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(contact.id)}
                            disabled={deletingId === contact.id}
                            title="Delete">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedContact && (
        <ReplyDialog
          contact={selectedContact}
          isOpen={isReplyOpen}
          onClose={() => {
            setIsReplyOpen(false);
            setSelectedContact(null);
          }}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
