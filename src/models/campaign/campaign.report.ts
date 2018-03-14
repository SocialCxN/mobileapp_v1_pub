import { SocialMedia } from "../social-media/social.media";
import { ReportAttributes } from "./attribute";

export class CampaignReport {

    campaign: {
        id: number;
        name: string;
        startDate: string;
        endDate: string;
    };

    totalEngagement: any;
    totalEngagementRate: any;
    totalReach: any;
    postUrls:Array<string>;
    reportStatus: string;
    socialMediaChannel: SocialMedia;
    attributes = new Array<ReportAttributes>();
    attachments: any;
}