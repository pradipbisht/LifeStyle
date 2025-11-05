"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CampaignDetailsProps {
  campaign: any;
  onChange: (campaign: any) => void;
}

export default function CampaignDetails({
  campaign,
  onChange,
}: CampaignDetailsProps) {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...campaign,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Campaign Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              value={campaign.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Internal campaign name"
              className="mt-1"
            />
            <p className="text-sm text-slate-500 mt-1">
              This is for your reference only and won't be seen by recipients
            </p>
          </div>

          <div>
            <Label htmlFor="type">Campaign Type</Label>
            <Select
              value={campaign.type}
              onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promotional">Promotional</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="product_launch">Product Launch</SelectItem>
                <SelectItem value="welcome">Welcome Series</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Email Settings
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              value={campaign.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="Your compelling subject line"
              className="mt-1"
            />
            <p className="text-sm text-slate-500 mt-1">
              Keep it under 50 characters for better mobile display
            </p>
          </div>

          <div>
            <Label htmlFor="previewText">Preview Text</Label>
            <Textarea
              id="previewText"
              value={campaign.previewText}
              onChange={(e) => handleChange("previewText", e.target.value)}
              placeholder="Text shown in email client preview"
              className="mt-1"
              rows={2}
            />
            <p className="text-sm text-slate-500 mt-1">
              This appears after the subject line in most email clients
            </p>
          </div>
        </div>
      </div>

      {/* Campaign Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Campaign Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Use action words in your subject line to increase open rates
          </li>
          <li>• Personalize the subject line when possible</li>
          <li>• Test different subject lines with A/B testing</li>
          <li>• Keep preview text informative and engaging</li>
        </ul>
      </div>
    </div>
  );
}
