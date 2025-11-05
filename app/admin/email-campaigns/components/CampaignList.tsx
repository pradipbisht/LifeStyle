"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Edit,
  Copy,
  MoreHorizontal,
  Calendar,
  Users,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Campaign {
  id: string;
  title: string;
  subject: string;
  status: "draft" | "scheduled" | "sent" | "sending";
  type: string;
  recipients: number;
  openRate?: number;
  clickRate?: number;
  createdAt: Date;
  sentAt?: Date;
}

interface CampaignListProps {
  campaigns: Campaign[];
  onRefresh: () => void;
}

export default function CampaignList({
  campaigns,
  onRefresh,
}: CampaignListProps) {
  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-700";
      case "sending":
        return "bg-blue-100 text-blue-700";
      case "scheduled":
        return "bg-amber-100 text-amber-700";
      case "draft":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const handleAction = (action: string, campaignId: string) => {
    console.log(`${action} campaign:`, campaignId);
    // TODO: Implement actions
  };

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No campaigns yet
        </h3>
        <p className="text-slate-600 mb-4">
          Create your first email campaign to get started
        </p>
        <Button className="bg-amber-600 hover:bg-amber-700">
          Create Campaign
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Open Rate</TableHead>
            <TableHead>Click Rate</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{campaign.title}</div>
                  <div className="text-sm text-slate-500">
                    {campaign.subject}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  {campaign.recipients.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                {campaign.openRate ? `${campaign.openRate}%` : "-"}
              </TableCell>
              <TableCell>
                {campaign.clickRate ? `${campaign.clickRate}%` : "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {campaign.sentAt
                    ? campaign.sentAt.toLocaleDateString()
                    : campaign.createdAt.toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleAction("view", campaign.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction("edit", campaign.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction("duplicate", campaign.id)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
