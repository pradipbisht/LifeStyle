// Database Schema for Email Marketing System
// This file defines the Firestore collections and document structures

export interface Subscriber {
  userId: string;
  email: string;
  name: string;
  subscriptionDate: Date;
  isActive: boolean;
  preferences: {
    offers: boolean;
    newsletters: boolean;
    productUpdates: boolean;
    specialEvents: boolean;
    healthTips: boolean;
    beautyTips: boolean;
    petCare: boolean;
    parenting: boolean;
  };
  interests: string[]; // ["health", "skincare", "pets", "parenting"]
  demographics?: {
    age?: number;
    gender?: string;
    location?: string;
    timezone?: string;
  };
  engagementData: {
    lastOpenedEmail?: Date;
    lastClickedEmail?: Date;
    totalEmailsReceived: number;
    totalEmailsOpened: number;
    totalEmailsClicked: number;
    engagementScore: number; // 0-100 based on activity
  };
  source: "website" | "blog" | "shop" | "social" | "referral";
  tags: string[]; // Custom tags for segmentation
}

export interface EmailCampaign {
  campaignId: string;
  title: string;
  subject: string;
  previewText?: string;
  type:
    | "promotional"
    | "newsletter"
    | "announcement"
    | "product_launch"
    | "abandoned_cart"
    | "welcome"
    | "reengagement";
  template: {
    templateId: string;
    templateName: string;
    customizations?: Record<string, any>;
  };
  content: {
    htmlBody: string;
    textBody: string;
    headerImage?: string;
    footerText?: string;
    ctaButtons: Array<{
      text: string;
      link: string;
      position: string;
      style?: Record<string, any>;
    }>;
    personalizedContent?: Record<string, any>;
  };
  audience: {
    targetType: "all" | "segmented" | "custom" | "test";
    totalRecipients?: number;
    filters: {
      interests?: string[];
      preferences?: string[];
      engagementScore?: { min?: number; max?: number };
      lastActivity?: { after?: Date; before?: Date };
      demographics?: Record<string, any>;
      tags?: string[];
    };
    excludeGroups?: string[]; // Groups to exclude
  };
  scheduling: {
    sendImmediately: boolean;
    scheduledDate?: Date;
    timezone: string;
    optimizedSendTime?: boolean; // Use AI to optimize send time
  };
  testing: {
    isTest: boolean;
    testType?: "subject_line" | "content" | "send_time";
    variants?: Array<{
      variantId: string;
      subject?: string;
      content?: string;
      percentage: number;
    }>;
  };
  status:
    | "draft"
    | "scheduled"
    | "sending"
    | "sent"
    | "paused"
    | "failed"
    | "cancelled";
  metadata: {
    createdBy: string;
    createdAt: Date;
    lastModified: Date;
    modifiedBy: string;
    sentAt?: Date;
    completedAt?: Date;
  };
  stats: {
    totalSent: number;
    totalDelivered: number;
    totalBounced: number;
    totalOpened: number;
    totalClicked: number;
    totalUnsubscribed: number;
    totalSpamReports: number;
    openRate: number;
    clickRate: number;
    unsubscribeRate: number;
    revenueGenerated?: number;
    conversions?: number;
  };
}

export interface EmailTemplate {
  templateId: string;
  name: string;
  description?: string;
  category:
    | "welcome"
    | "promotional"
    | "newsletter"
    | "product"
    | "cart"
    | "reengagement"
    | "announcement";
  htmlContent: string;
  textContent: string;
  thumbnailImage: string;
  variables: Array<{
    name: string;
    type: "text" | "image" | "url" | "date" | "number" | "boolean";
    label: string;
    defaultValue?: any;
    required: boolean;
    placeholder?: string;
  }>;
  design: {
    responsive: boolean;
    colorScheme: Record<string, string>;
    fonts: Record<string, string>;
    layout: "single-column" | "two-column" | "multi-section";
  };
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  usageCount: number;
}

export interface EmailAnalytics {
  analyticsId: string;
  campaignId: string;
  userId: string;
  email: string;
  events: Array<{
    type:
      | "sent"
      | "delivered"
      | "opened"
      | "clicked"
      | "bounced"
      | "unsubscribed"
      | "spam_reported"
      | "converted";
    timestamp: Date;
    // metadata can contain provider-specific fields (totalSent, totalOpened, etc.)
    metadata: Record<string, any>;
  }>;
  totalRevenue?: number;
  conversionData?: {
    purchaseId?: string;
    productIds?: string[];
    orderValue?: number;
    conversionTime?: Date;
  };
}

export interface EmailAutomation {
  automationId: string;
  name: string;
  description?: string;
  type:
    | "welcome_series"
    | "abandoned_cart"
    | "post_purchase"
    | "birthday"
    | "reengagement"
    | "product_recommendation";
  isActive: boolean;
  trigger: {
    type: "event" | "date" | "behavior" | "attribute";
    condition: Record<string, any>;
    delay?: {
      amount: number;
      unit: "minutes" | "hours" | "days" | "weeks";
    };
  };
  emails: Array<{
    emailId: string;
    templateId: string;
    subject: string;
    delay: {
      amount: number;
      unit: "minutes" | "hours" | "days" | "weeks";
    };
    conditions?: Record<string, any>; // Additional conditions for this email
  }>;
  audience: {
    filters: Record<string, any>;
    excludeGroups?: string[];
  };
  stats: {
    totalTriggered: number;
    totalCompleted: number;
    averageOpenRate: number;
    averageClickRate: number;
    totalRevenue?: number;
  };
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
}

export interface EmailSegment {
  segmentId: string;
  name: string;
  description?: string;
  filters: {
    interests?: string[];
    preferences?: string[];
    engagementScore?: { min?: number; max?: number };
    demographics?: Record<string, any>;
    behaviorData?: Record<string, any>;
    customFields?: Record<string, any>;
    lastActivity?: { after?: Date; before?: Date };
    subscriptionDate?: { after?: Date; before?: Date };
    tags?: string[];
  };
  isActive: boolean;
  subscriberCount: number;
  lastUpdated: Date;
  createdBy: string;
  createdAt: Date;
}

// Campaign Performance Summary for Dashboard
export interface CampaignSummary {
  totalCampaigns: number;
  totalSubscribers: number;
  totalEmailsSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  totalRevenue: number;
  topPerformingCampaigns: Array<{
    campaignId: string;
    title: string;
    openRate: number;
    clickRate: number;
    revenue?: number;
  }>;
  recentActivity: Array<{
    type: "campaign_sent" | "subscriber_added" | "template_created";
    timestamp: Date;
    details: Record<string, any>;
  }>;
}
