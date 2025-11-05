"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Globe } from "lucide-react";

interface ScheduleSettingsProps {
  campaign: any;
  onChange: (campaign: any) => void;
}

export default function ScheduleSettings({
  campaign,
  onChange,
}: ScheduleSettingsProps) {
  const handleSchedulingChange = (field: string, value: any) => {
    onChange({
      ...campaign,
      scheduling: {
        ...campaign.scheduling,
        [field]: value,
      },
    });
  };

  const timezones = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  ];

  const getOptimalSendTimes = () => {
    return [
      "9:00 AM - High open rates for business content",
      "1:00 PM - Good for lunch-time reading",
      "4:00 PM - Afternoon engagement peak",
      "8:00 PM - Evening leisure time",
    ];
  };

  return (
    <div className="space-y-6">
      {/* Send Timing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Send Timing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Switch
              checked={campaign.scheduling.sendImmediately}
              onCheckedChange={(checked) =>
                handleSchedulingChange("sendImmediately", checked)
              }
            />
            <div>
              <Label>Send immediately after review</Label>
              <p className="text-sm text-slate-500">
                Campaign will be sent as soon as you click "Send Campaign"
              </p>
            </div>
          </div>

          {!campaign.scheduling.sendImmediately && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label htmlFor="scheduleDate">Schedule Date & Time</Label>
                <Input
                  id="scheduleDate"
                  type="datetime-local"
                  className="mt-1"
                  onChange={(e) =>
                    handleSchedulingChange(
                      "scheduledDate",
                      new Date(e.target.value)
                    )
                  }
                />
                <p className="text-sm text-slate-500 mt-1">
                  Select when you want this campaign to be sent
                </p>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={campaign.scheduling.timezone}
                  onValueChange={(value) =>
                    handleSchedulingChange("timezone", value)
                  }>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Time Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Send Time Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">
                Optimal Send Times
              </h4>
              <ul className="space-y-2">
                {getOptimalSendTimes().map((time, index) => (
                  <li
                    key={index}
                    className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    {time}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h5>
              <p className="text-sm text-blue-800">
                Consider your audience's timezone and daily routine.
                Business-related content performs better during work hours,
                while lifestyle content works well in the evenings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Delivery Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>From Name</Label>
              <Input value="Wellness Hub" className="mt-1" disabled />
              <p className="text-sm text-slate-500 mt-1">
                Configure in email provider settings
              </p>
            </div>

            <div>
              <Label>From Email</Label>
              <Input value="hello@wellnesshub.com" className="mt-1" disabled />
              <p className="text-sm text-slate-500 mt-1">
                Must match your verified domain
              </p>
            </div>
          </div>

          <div>
            <Label>Reply-To Email</Label>
            <Input value="support@wellnesshub.com" className="mt-1" disabled />
            <p className="text-sm text-slate-500 mt-1">
              Where replies will be sent
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-900 mb-2">📅 Schedule Summary</h4>
        <div className="text-sm text-slate-600 space-y-1">
          <p>
            <strong>Send Method:</strong>{" "}
            {campaign.scheduling.sendImmediately ? "Immediate" : "Scheduled"}
          </p>
          <p>
            <strong>Timezone:</strong> {campaign.scheduling.timezone}
          </p>
          {!campaign.scheduling.sendImmediately &&
            campaign.scheduling.scheduledDate && (
              <p>
                <strong>Scheduled For:</strong>{" "}
                {new Date(campaign.scheduling.scheduledDate).toLocaleString()}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
