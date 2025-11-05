import { EmailCampaign, Subscriber, EmailAnalytics } from "@/lib/types/email";

export interface EmailSendResult {
  success: boolean;
  campaignId: string;
  totalSent: number;
  totalFailed: number;
  errors?: string[];
  providerId?: string;
}

export class MailchimpProvider {
  name = "Mailchimp";
  private apiKey: string;
  private serverPrefix: string;

  constructor(apiKey: string, serverPrefix: string) {
    this.apiKey = apiKey;
    this.serverPrefix = serverPrefix;
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://${this.serverPrefix}.api.mailchimp.com/3.0/ping`,
        {
          headers: { Authorization: `apikey ${this.apiKey}` },
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Mailchimp API validation failed:", error);
      return false;
    }
  }

  async sendCampaign(
    campaign: EmailCampaign,
    subscribers: Subscriber[]
  ): Promise<EmailSendResult> {
    // Create -> set content -> send flow
    try {
      const campaignData = {
        type: "regular",
        recipients: { list_id: process.env.MAILCHIMP_LIST_ID },
        settings: {
          subject_line: campaign.subject,
          preview_text: campaign.previewText,
          title: campaign.title,
          from_name: process.env.MAILCHIMP_FROM_NAME || "Your Brand",
          reply_to: process.env.MAILCHIMP_REPLY_TO || "noreply@yourdomain.com",
        },
      };

      const createRes = await fetch(
        `https://${this.serverPrefix}.api.mailchimp.com/3.0/campaigns`,
        {
          method: "POST",
          headers: {
            Authorization: `apikey ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(campaignData),
        }
      );

      if (!createRes.ok) throw new Error("Failed to create Mailchimp campaign");
      const created = await createRes.json();
      const mailchimpCampaignId = created.id;

      // set content
      const contentRes = await fetch(
        `https://${this.serverPrefix}.api.mailchimp.com/3.0/campaigns/${mailchimpCampaignId}/content`,
        {
          method: "PUT",
          headers: {
            Authorization: `apikey ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            html: campaign.content.htmlBody,
            plain_text: campaign.content.textBody,
          }),
        }
      );
      if (!contentRes.ok) throw new Error("Failed to set campaign content");

      // send
      const sendRes = await fetch(
        `https://${this.serverPrefix}.api.mailchimp.com/3.0/campaigns/${mailchimpCampaignId}/actions/send`,
        {
          method: "POST",
          headers: { Authorization: `apikey ${this.apiKey}` },
        }
      );
      if (!sendRes.ok) throw new Error("Failed to send campaign");

      return {
        success: true,
        campaignId: mailchimpCampaignId,
        totalSent: subscribers.length,
        totalFailed: 0,
        providerId: "mailchimp",
      };
    } catch (error) {
      console.error("Mailchimp send error:", error);
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
      const res = await fetch(
        `https://${this.serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/reports`,
        {
          headers: { Authorization: `apikey ${this.apiKey}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch campaign analytics");
      const data = await res.json();

      return [
        {
          analyticsId: `mailchimp_${campaignId}`,
          campaignId,
          userId: "aggregate",
          email: "aggregate",
          events: [
            {
              type: "sent",
              timestamp: new Date(data.send_time || Date.now()),
              metadata: { totalSent: data.emails_sent },
            },
            {
              type: "opened",
              timestamp: new Date(),
              metadata: { totalOpened: data.opens?.opens_total ?? 0 },
            },
            {
              type: "clicked",
              timestamp: new Date(),
              metadata: { totalClicked: data.clicks?.clicks_total ?? 0 },
            },
          ],
        },
      ];
    } catch (error) {
      console.error("Mailchimp analytics error:", error);
      return [];
    }
  }
}

export default MailchimpProvider;
