"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Send, Eye } from "lucide-react";
import Link from "next/link";
import AdminLayout from "../../AdminLayout";
import ScheduleSettings from "../components/ScheduleSettings";
import AudienceSelector from "../components/AudienceSelector";
import EmailEditor from "../components/EmailEditor";
import CampaignDetails from "../components/CampaignDetails";

type TabType = "details" | "content" | "audience" | "schedule";

export default function NewCampaignPage() {
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [campaign, setCampaign] = useState({
    title: "",
    subject: "",
    previewText: "",
    type: "promotional",
    content: {
      htmlBody: "",
      textBody: "",
    },
    audience: {
      targetType: "all",
      filters: {},
    },
    scheduling: {
      sendImmediately: true,
      timezone: "UTC",
    },
  });

  const tabs = [
    { id: "details", label: "Campaign Details", icon: "📝" },
    { id: "content", label: "Email Content", icon: "✍️" },
    { id: "audience", label: "Audience", icon: "👥" },
    { id: "schedule", label: "Schedule", icon: "📅" },
  ];

  const handleSave = () => {
    console.log("Saving campaign:", campaign);
    // TODO: Save to Firebase
  };

  const handleSend = () => {
    console.log("Sending campaign:", campaign);
    // TODO: Send campaign
  };

  const handlePreview = () => {
    console.log("Preview campaign:", campaign);
    // TODO: Open preview modal
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/email-campaigns">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Campaigns
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Create New Campaign
                  </h1>
                  <p className="text-slate-600">
                    Design and send emails to your subscribers
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={handleSend}
                  className="bg-amber-600 hover:bg-amber-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Campaign
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50"
                      : "text-slate-600 hover:text-slate-900"
                  }`}>
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "details" && (
                <CampaignDetails campaign={campaign} onChange={setCampaign} />
              )}
              {activeTab === "content" && (
                <EmailEditor campaign={campaign} onChange={setCampaign} />
              )}
              {activeTab === "audience" && (
                <AudienceSelector campaign={campaign} onChange={setCampaign} />
              )}
              {activeTab === "schedule" && (
                <ScheduleSettings campaign={campaign} onChange={setCampaign} />
              )}
            </div>
          </div>

          {/* Campaign Summary Sidebar */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Campaign Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className="font-medium">Draft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Type:</span>
                <span className="font-medium capitalize">{campaign.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Send Time:</span>
                <span className="font-medium">
                  {campaign.scheduling.sendImmediately
                    ? "Immediate"
                    : "Scheduled"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
