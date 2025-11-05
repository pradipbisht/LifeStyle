import { EmailCampaign, Subscriber, EmailAnalytics } from "@/lib/types/email";

export interface EmailSendResult {
  success: boolean;
  campaignId: string;
  totalSent: number;
  totalFailed: number;
  errors?: string[];
  providerId?: string;
}

export class SendGridProvider {
  name = "SendGrid";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch("https://api.sendgrid.com/v3/user/profile", {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      return response.ok;
    } catch (error) {
      console.error("SendGrid API validation failed:", error);
      return false;
    }
  }

  async sendCampaign(
    campaign: EmailCampaign,
    subscribers: Subscriber[]
  ): Promise<EmailSendResult> {
    try {
      // Use Marketing Campaigns API in production for bulk sends.
      const emailPromises = subscribers.map(async (subscriber) => {
        const emailData = {
          personalizations: [
            {
              to: [{ email: subscriber.email, name: subscriber.name }],
              subject: campaign.subject,
            },
          ],
          from: {
            email: process.env.SENDGRID_FROM_EMAIL || "noreply@yourdomain.com",
            name: process.env.SENDGRID_FROM_NAME || "Your Brand",
          },
          content: [
            { type: "text/html", value: campaign.content.htmlBody },
            { type: "text/plain", value: campaign.content.textBody },
          ],
        };

        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        });
        return response.ok;
      });

      const results = await Promise.allSettled(emailPromises);
      const successful = results.filter(
        (r) => r.status === "fulfilled" && (r as any).value
      ).length;
      const failed = results.length - successful;

      return {
        success: failed === 0,
        campaignId: campaign.campaignId,
        totalSent: successful,
        totalFailed: failed,
        providerId: "sendgrid",
      };
    } catch (error) {
      console.error("SendGrid send error:", error);
      return {
        success: false,
        campaignId: campaign.campaignId,
        totalSent: 0,
        totalFailed: subscribers.length,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  async trackAnalytics(_campaignId: string): Promise<EmailAnalytics[]> {
    // Detailed analytics require Event Webhook setup in SendGrid
    console.warn("SendGrid analytics tracking requires webhook setup");
    return [];
  }
}

export default SendGridProvider;
