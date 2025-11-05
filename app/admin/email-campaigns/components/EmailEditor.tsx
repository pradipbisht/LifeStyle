"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Image, Link as LinkIcon } from "lucide-react";

interface EmailEditorProps {
  campaign: any;
  onChange: (campaign: any) => void;
}

export default function EmailEditor({ campaign, onChange }: EmailEditorProps) {
  const handleContentChange = (field: string, value: string) => {
    onChange({
      ...campaign,
      content: {
        ...campaign.content,
        [field]: value,
      },
    });
  };

  const templates = [
    {
      id: "promotional",
      name: "Promotional Sale",
      preview: "🛍️ Sale Template",
    },
    { id: "newsletter", name: "Newsletter", preview: "📰 Newsletter Template" },
    { id: "welcome", name: "Welcome Email", preview: "👋 Welcome Template" },
    { id: "product", name: "Product Launch", preview: "🚀 Product Template" },
  ];

  const insertTemplate = (templateId: string) => {
    const templateContent = getTemplateContent(templateId);
    handleContentChange("htmlBody", templateContent);
  };

  const getTemplateContent = (templateId: string) => {
    switch (templateId) {
      case "promotional":
        return `
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
  <h1 style="color: #d97706; text-align: center;">Special Offer Just for You!</h1>
  <p>Hi there!</p>
  <p>We're excited to offer you an exclusive discount on our latest products.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="#" style="background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Shop Now</a>
  </div>
  <p>Don't miss out on this limited-time offer!</p>
</div>`;
      case "newsletter":
        return `
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
  <h1 style="color: #1e293b; border-bottom: 2px solid #d97706; padding-bottom: 10px;">Weekly Newsletter</h1>
  <h2>What's New This Week</h2>
  <p>Here are the latest updates from our wellness community...</p>
  <h2>Featured Article</h2>
  <p>Discover the benefits of mindful living and how it can transform your daily routine.</p>
  <h2>Product Spotlight</h2>
  <p>This week we're featuring our organic skincare collection...</p>
</div>`;
      case "welcome":
        return `
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
  <h1 style="color: #d97706; text-align: center;">Welcome to Our Community!</h1>
  <p>Hi [Name],</p>
  <p>Thank you for joining our wellness community! We're thrilled to have you on board.</p>
  <p>Here's what you can expect:</p>
  <ul>
    <li>Weekly wellness tips and advice</li>
    <li>Exclusive offers and early access to sales</li>
    <li>Product recommendations tailored to your interests</li>
  </ul>
  <div style="text-align: center; margin: 30px 0;">
    <a href="#" style="background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Explore Our Products</a>
  </div>
</div>`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Templates */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Start Templates
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => insertTemplate(template.id)}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{template.preview}</div>
                <p className="text-sm font-medium">{template.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Email Content Editor */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="htmlContent">HTML Content</Label>
          <Textarea
            id="htmlContent"
            value={campaign.content.htmlBody}
            onChange={(e) => handleContentChange("htmlBody", e.target.value)}
            placeholder="Enter your HTML email content here..."
            className="mt-1 min-h-[400px] font-mono text-sm"
          />
        </div>

        <div>
          <Label htmlFor="textContent">Plain Text Version</Label>
          <Textarea
            id="textContent"
            value={campaign.content.textBody}
            onChange={(e) => handleContentChange("textBody", e.target.value)}
            placeholder="Enter plain text version for email clients that don't support HTML..."
            className="mt-1 min-h-[400px]"
          />
        </div>
      </div>

      {/* Editor Tools */}
      <div className="flex gap-4">
        <Button variant="outline" size="sm">
          <Image className="w-4 h-4 mr-2" />
          Insert Image
        </Button>
        <Button variant="outline" size="sm">
          <LinkIcon className="w-4 h-4 mr-2" />
          Insert Link
        </Button>
        <Button variant="outline" size="sm">
          <Palette className="w-4 h-4 mr-2" />
          Customize Colors
        </Button>
      </div>

      {/* Email Guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-900 mb-2">
          📧 Email Best Practices
        </h4>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Keep your design simple and mobile-friendly</li>
          <li>• Use a clear call-to-action button</li>
          <li>• Include both HTML and plain text versions</li>
          <li>• Test your email in different email clients</li>
          <li>• Always include an unsubscribe link</li>
        </ul>
      </div>
    </div>
  );
}
