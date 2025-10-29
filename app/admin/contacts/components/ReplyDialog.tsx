"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: any;
}

interface ReplyDialogProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReplyDialog({
  contact,
  isOpen,
  onClose,
  onSuccess,
}: ReplyDialogProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      alert("Please enter a reply message");
      return;
    }

    try {
      setLoading(true);

      // Update contact status to "replied"
      await updateDoc(doc(db, "contacts", contact.id), {
        status: "replied",
      });

      // Here you would typically send an email using a backend API
      // For now, we'll just open the user's email client
      const mailtoLink = `mailto:${contact.email}?subject=Re: ${
        contact.subject
      }&body=${encodeURIComponent(replyMessage)}`;
      window.open(mailtoLink, "_blank");

      alert("Reply sent! Please send the email from your email client.");
      setReplyMessage("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Reply to {contact.name}</DialogTitle>
          <DialogDescription>
            Send a reply to this contact message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="font-medium">{contact.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{contact.email}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Subject</Label>
              <p className="font-medium">{contact.subject}</p>
            </div>
          </div>

          {/* Original Message */}
          <div>
            <Label className="text-muted-foreground">Original Message</Label>
            <div className="mt-2 p-3 bg-muted rounded-md text-sm">
              {contact.message}
            </div>
          </div>

          {/* Reply Input */}
          <div>
            <Label htmlFor="reply">Your Reply</Label>
            <Textarea
              id="reply"
              placeholder="Type your reply here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={6}
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSendReply} disabled={loading}>
            {loading ? "Sending..." : "Send Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
