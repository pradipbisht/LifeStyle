import { EmailCampaign, Subscriber, EmailAnalytics } from "@/lib/types/email";

export interface EmailSendResult {
  success: boolean;
  campaignId: string;
  totalSent: number;
  totalFailed: number;
  errors?: string[];
  providerId?: string;
}

export class ConvertKitProvider {
  name = "ConvertKit";
  private apiKey: string;
  private apiSecret?: string;

  constructor(apiKey: string, apiSecret?: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.convertkit.com/v3/account?api_key=${this.apiKey}`
      );
      return response.ok;
    } catch (error) {
      console.error("ConvertKit API validation failed:", error);
      return false;
    }
  }

  async sendCampaign(
    campaign: EmailCampaign,
    subscribers: Subscriber[]
  ): Promise<EmailSendResult> {
    try {
      const broadcastData = {
        subject: campaign.subject,
        content: campaign.content.htmlBody,
        description: campaign.title,
        public: false,
        published_at: campaign.scheduling.sendImmediately
          ? new Date().toISOString()
          : campaign.scheduling.scheduledDate?.toISOString(),
      };

      const response = await fetch(
        `https://api.convertkit.com/v3/broadcasts?api_key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(broadcastData),
        }
      );

      if (!response.ok)
        throw new Error("Failed to create ConvertKit broadcast");
      const result = await response.json();

      return {
        success: true,
        campaignId: result.broadcast.id.toString(),
        totalSent: subscribers.length,
        totalFailed: 0,
        providerId: "convertkit",
      };
    } catch (error) {
      console.error("ConvertKit send error:", error);
      return {
        success: false,
        campaignId: campaign.campaignId,
        totalSent: 0,
        totalFailed: subscribers.length,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  async trackAnalytics(campaignId: string): Promise<EmailAnalytics[]> {
    try {
      const response = await fetch(
        `https://api.convertkit.com/v3/broadcasts/${campaignId}/stats?api_key=${this.apiKey}`
      );
      if (!response.ok) throw new Error("Failed to fetch ConvertKit analytics");
      const data = await response.json();

      return [
        {
          analyticsId: `convertkit_${campaignId}`,
          campaignId,
          userId: "aggregate",
          email: "aggregate",
          events: [
            {
              type: "sent",
              timestamp: new Date(data.broadcast?.published_at || Date.now()),
              metadata: { totalSent: data.broadcast?.total_subscribed ?? 0 },
            },
            {
              type: "opened",
              timestamp: new Date(),
              metadata: { totalOpened: data.broadcast?.total_opened ?? 0 },
            },
            {
              type: "clicked",
              timestamp: new Date(),
              metadata: { totalClicked: data.broadcast?.total_clicked ?? 0 },
            },
          ],
        },
      ];
    } catch (error) {
      console.error("ConvertKit analytics error:", error);
      return [];
    }
  }
}

export default ConvertKitProvider;
