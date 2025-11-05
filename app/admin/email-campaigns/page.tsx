"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Mail, Users, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import AdminLayout from "../AdminLayout";
import EmailStats from "./components/EmailStats";
import CampaignList from "./components/CampaignList";

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalSubscribers: 0,
    avgOpenRate: 0,
    totalSent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch campaigns and stats from Firebase
    const fetchData = async () => {
      try {
        // Placeholder data
        setCampaigns([]);
        setStats({
          totalCampaigns: 12,
          totalSubscribers: 1247,
          avgOpenRate: 24.5,
          totalSent: 8340,
        });
      } catch (error) {
        console.error("Error fetching email data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Email Campaigns
            </h1>
            <p className="text-slate-600">
              Create and manage email campaigns for your subscribers
            </p>
          </div>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/admin/email-campaigns/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <EmailStats stats={stats} />

        {/* Campaigns List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Recent Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CampaignList campaigns={campaigns} onRefresh={() => {}} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
