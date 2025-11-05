"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Users,
  Calendar,
  Eye,
  Send,
  Save,
  Filter,
  Target,
  Palette,
  Clock,
  BarChart3,
  Settings,
} from "lucide-react";
import { EmailCampaign, EmailTemplate, Subscriber } from "@/lib/types/email";

interface EmailComposerProps {
  templates: EmailTemplate[];
  subscribers: Subscriber[];
  onSave: (campaign: Partial<EmailCampaign>) => void;
  onSend: (campaign: EmailCampaign) => void;
  onPreview: (campaign: Partial<EmailCampaign>) => void;
}

export default function EmailComposer({
  templates,
  subscribers,
  onSave,
  onSend,
  onPreview,
}: EmailComposerProps) {
  const [campaign, setCampaign] = useState<Partial<EmailCampaign>>({
    title: "",
    subject: "",
    previewText: "",
    type: "promotional",
    content: {
      htmlBody: "",
      textBody: "",
      ctaButtons: [],
    },
    audience: {
      targetType: "all",
      filters: {},
    },
    scheduling: {
      sendImmediately: true,
      timezone: "UTC",
    },
    testing: {
      isTest: false,
    },
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [audienceCount, setAudienceCount] = useState<number>(0);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );

  // Calculate audience size based on filters
  useEffect(() => {
    const calculateAudience = () => {
      let filteredSubscribers = subscribers.filter((sub) => sub.isActive);

      if (
        campaign.audience?.targetType === "segmented" &&
        campaign.audience.filters
      ) {
        const filters = campaign.audience.filters;

        if (filters.interests?.length) {
          filteredSubscribers = filteredSubscribers.filter((sub) =>
            filters.interests?.some((interest) =>
              sub.interests.includes(interest)
            )
          );
        }

        if (filters.preferences?.length) {
          filteredSubscribers = filteredSubscribers.filter((sub) =>
            filters.preferences?.some(
              (pref) => sub.preferences[pref as keyof typeof sub.preferences]
            )
          );
        }

        if (filters.engagementScore) {
          const { min, max } = filters.engagementScore;
          filteredSubscribers = filteredSubscribers.filter((sub) => {
            const score = sub.engagementData.engagementScore;
            return (!min || score >= min) && (!max || score <= max);
          });
        }
      }

      setAudienceCount(filteredSubscribers.length);
    };

    calculateAudience();
  }, [campaign.audience, subscribers]);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.templateId === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setCampaign((prev) => ({
        ...prev,
        template: {
          templateId: template.templateId,
          templateName: template.name,
        },
        content: {
          ...prev.content,
          htmlBody: template.htmlContent,
          textBody: template.textContent,
          // ensure ctaButtons remains an array to satisfy Partial<EmailCampaign>
          ctaButtons: prev.content?.ctaButtons || [],
        },
      }));
    }
  };

  const handleSave = () => {
    onSave(campaign);
  };

  const handleSend = () => {
    if (campaign.title && campaign.subject && campaign.content?.htmlBody) {
      onSend(campaign as EmailCampaign);
    }
  };

  const handlePreview = () => {
    onPreview(campaign);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Create Email Campaign
          </h1>
          <p className="text-slate-600">
            Design and send emails to your subscribers
          </p>
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">
                <Mail className="w-4 h-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="audience">
                <Users className="w-4 h-4 mr-2" />
                Audience
              </TabsTrigger>
              <TabsTrigger value="design">
                <Palette className="w-4 h-4 mr-2" />
                Design
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Campaign Title</Label>
                      <Input
                        id="title"
                        value={campaign.title}
                        onChange={(e) =>
                          setCampaign((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Internal campaign name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Campaign Type</Label>
                      <Select
                        value={campaign.type}
                        onValueChange={(value) =>
                          setCampaign((prev) => ({
                            ...prev,
                            type: value as any,
                          }))
                        }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="promotional">
                            Promotional
                          </SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="announcement">
                            Announcement
                          </SelectItem>
                          <SelectItem value="product_launch">
                            Product Launch
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Email Subject Line</Label>
                    <Input
                      id="subject"
                      value={campaign.subject}
                      onChange={(e) =>
                        setCampaign((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      placeholder="Your compelling subject line"
                      className="font-medium"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preview">Preview Text</Label>
                    <Input
                      id="preview"
                      value={campaign.previewText}
                      onChange={(e) =>
                        setCampaign((prev) => ({
                          ...prev,
                          previewText: e.target.value,
                        }))
                      }
                      placeholder="Text shown in email client preview"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {templates.slice(0, 6).map((template) => (
                      <div
                        key={template.templateId}
                        className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all ${
                          selectedTemplate === template.templateId
                            ? "border-amber-500 bg-amber-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() =>
                          handleTemplateSelect(template.templateId)
                        }>
                        <div className="aspect-4/3 bg-slate-100 rounded mb-2">
                          <img
                            src={template.thumbnailImage}
                            alt={template.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <p className="text-sm font-medium">{template.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      value={campaign.content?.htmlBody}
                      onChange={(e) =>
                        setCampaign((prev) => ({
                          ...prev,
                          content: {
                            ...prev.content!,
                            htmlBody: e.target.value,
                          },
                        }))
                      }
                      placeholder="Write your email content here..."
                      className="min-h-[300px] font-mono text-sm"
                    />
                    <p className="text-sm text-slate-500">
                      Use a rich text editor in production for better content
                      creation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audience Tab */}
            <TabsContent value="audience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Target Audience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">Estimated Reach</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {audienceCount.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-500">subscribers</p>
                    </div>
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>

                  <div>
                    <Label>Audience Type</Label>
                    <Select
                      value={campaign.audience?.targetType}
                      onValueChange={(value) =>
                        setCampaign((prev) => ({
                          ...prev,
                          audience: {
                            ...prev.audience!,
                            targetType: value as any,
                          },
                        }))
                      }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subscribers</SelectItem>
                        <SelectItem value="segmented">
                          Segmented Audience
                        </SelectItem>
                        <SelectItem value="custom">Custom Filter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {campaign.audience?.targetType === "segmented" && (
                    <div className="space-y-4">
                      <Separator />
                      <div>
                        <Label>Interest Categories</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {[
                            "health",
                            "skincare",
                            "haircare",
                            "pets",
                            "parenting",
                          ].map((interest) => (
                            <Badge
                              key={interest}
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => {
                                const currentInterests =
                                  campaign.audience?.filters?.interests || [];
                                const newInterests = currentInterests.includes(
                                  interest
                                )
                                  ? currentInterests.filter(
                                      (i) => i !== interest
                                    )
                                  : [...currentInterests, interest];

                                setCampaign((prev) => ({
                                  ...prev,
                                  audience: {
                                    ...prev.audience!,
                                    filters: {
                                      ...prev.audience!.filters,
                                      interests: newInterests,
                                    },
                                  },
                                }));
                              }}>
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Email Preferences</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {[
                            "offers",
                            "newsletters",
                            "productUpdates",
                            "specialEvents",
                          ].map((pref) => (
                            <Badge
                              key={pref}
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => {
                                const currentPrefs =
                                  campaign.audience?.filters?.preferences || [];
                                const newPrefs = currentPrefs.includes(pref)
                                  ? currentPrefs.filter((p) => p !== pref)
                                  : [...currentPrefs, pref];

                                setCampaign((prev) => ({
                                  ...prev,
                                  audience: {
                                    ...prev.audience!,
                                    filters: {
                                      ...prev.audience!.filters,
                                      preferences: newPrefs,
                                    },
                                  },
                                }));
                              }}>
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Design Customization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500">
                    Advanced design customization will be available with the
                    selected template. Features include color schemes, fonts,
                    and layout adjustments.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Send Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={campaign.scheduling?.sendImmediately}
                      onCheckedChange={(checked) =>
                        setCampaign((prev) => ({
                          ...prev,
                          scheduling: {
                            ...prev.scheduling!,
                            sendImmediately: checked,
                          },
                        }))
                      }
                    />
                    <Label>Send immediately after review</Label>
                  </div>

                  {!campaign.scheduling?.sendImmediately && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="scheduleDate">Schedule Date</Label>
                        <Input
                          id="scheduleDate"
                          type="datetime-local"
                          onChange={(e) =>
                            setCampaign((prev) => ({
                              ...prev,
                              scheduling: {
                                ...prev.scheduling!,
                                scheduledDate: new Date(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={campaign.scheduling?.timezone}
                          onValueChange={(value) =>
                            setCampaign((prev) => ({
                              ...prev,
                              scheduling: {
                                ...prev.scheduling!,
                                timezone: value,
                              },
                            }))
                          }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">
                              Eastern Time
                            </SelectItem>
                            <SelectItem value="America/Los_Angeles">
                              Pacific Time
                            </SelectItem>
                            <SelectItem value="Asia/Kolkata">
                              India Standard Time
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Campaign Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <Badge variant="outline">Draft</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Type</span>
                <span className="text-sm font-medium capitalize">
                  {campaign.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Recipients</span>
                <span className="text-sm font-medium">
                  {audienceCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Send Time</span>
                <span className="text-sm font-medium">
                  {campaign.scheduling?.sendImmediately
                    ? "Immediate"
                    : "Scheduled"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Preview Device Toggle */}
          <Card>
            <CardHeader>
              <CardTitle>Preview Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  onClick={() => setPreviewMode("desktop")}>
                  Desktop
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  onClick={() => setPreviewMode("mobile")}>
                  Mobile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Test Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start">
                <Filter className="w-4 h-4 mr-2" />
                Save Audience
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                Spam Check
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
