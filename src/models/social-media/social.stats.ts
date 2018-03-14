
import { PageDetails } from "./page.details";
import { SocialMedia } from "./social.media";
import { EngagementList } from "../influencer/engagement.list";

export class SocialStats {

    id: number;
    pageDetails = new Array<PageDetails>();
    socialMediaChannel = new SocialMedia();
    totalCount: string;
    totalFanCount = 0;
    avgEngagementValue: string;
    engagementLevel : EngagementList;
    socialmediaProfileName: string;
    socialmediaProfileUrl: string;
}
