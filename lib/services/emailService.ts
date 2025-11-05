// Email service integration for sending campaigns
// Supports multiple providers: Mailchimp, ConvertKit, SendGrid

import { EmailCampaign, Subscriber, EmailAnalytics } from "@/lib/types/email";
import MailchimpProvider from "@/lib/services/providers/mailchimp";
import ConvertKitProvider from "@/lib/services/providers/convertkit";
import SendGridProvider from "@/lib/services/providers/sendgrid";

export interface EmailSendResult {
  success: boolean;
  campaignId: string;
  totalSent: number;
  totalFailed: number;
  errors?: string[];
  providerId?: string;
}

export class EmailService {
  private provider: any;

  constructor(providerType: "mailchimp" | "convertkit" | "sendgrid") {
    switch (providerType) {
      case "mailchimp":
        this.provider = new MailchimpProvider(
          process.env.MAILCHIMP_API_KEY || "",
          process.env.MAILCHIMP_SERVER_PREFIX || ""
        );
        break;
      case "convertkit":
        this.provider = new ConvertKitProvider(
          process.env.CONVERTKIT_API_KEY || "",
          process.env.CONVERTKIT_API_SECRET || ""
        );
        break;
      case "sendgrid":
        this.provider = new SendGridProvider(
          process.env.SENDGRID_API_KEY || ""
        );
        break;
      default:
        throw new Error(`Unsupported email provider: ${providerType}`);
    }
  }

  async sendCampaign(
    campaign: EmailCampaign,
    subscribers: Subscriber[]
  ): Promise<EmailSendResult> {
    const isValid =
      typeof this.provider.validateApiKey === "function"
        ? await this.provider.validateApiKey()
        : true;
    if (!isValid) {
      return {
        success: false,
        campaignId: campaign.campaignId,
        totalSent: 0,
        totalFailed: subscribers.length,
        errors: ["Invalid API key for email provider"],
      };
    }

    return this.provider.sendCampaign(campaign, subscribers);
  }

  async trackAnalytics(campaignId: string): Promise<EmailAnalytics[]> {
    return typeof this.provider.trackAnalytics === "function"
      ? await this.provider.trackAnalytics(campaignId)
      : [];
  }

  getProviderName(): string {
    return this.provider?.name || "unknown";
  }
}

// Small utility helpers
export function validateEmailAddress(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateCampaignId(): string {
  return `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function calculateEngagementScore(subscriber: Subscriber): number {
  const { engagementData } = subscriber;
  const { totalEmailsReceived, totalEmailsOpened, totalEmailsClicked } =
    engagementData;
  if (totalEmailsReceived === 0) return 0;
  const openRate = totalEmailsOpened / totalEmailsReceived;
  const clickRate = totalEmailsClicked / totalEmailsReceived;
  const score = (openRate * 0.6 + clickRate * 0.4) * 100;
  return Math.min(100, Math.max(0, score));
}

export default EmailService;
