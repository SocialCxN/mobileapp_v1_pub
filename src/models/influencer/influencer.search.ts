import { SocialMedia } from "../social-media/social.media";
import { AudienceLocation } from "../location/audience.location";
import { Country } from "../country";
import { CampaignCategory } from "../campaign/campaign.category";
import { City } from "../city";

export class InfluencerSearch {

    searchKeyword: string; //input value of search box (optional)
    fansCountRange: string;    // set code_range like "25000_or_less",   (earlier it was followerCountRange)
    influencerRating: string;
    influencerCountry : any;
    influencerCity : any;
    audienceCountry : any;
    socialMediaChannel = new Array<SocialMedia>();
    engagementLevel: string; 
    campaignCategory = new Array<CampaignCategory>();  // set code_names array like ["food"]
    userCountryId: number;        // set brand or digital agency country id like 34
    sortParam: string;  // or  set sort param like "social_name" or "t_fans" or" rating"  
    sortOrder: string;   //or  set like "asc" or "desc'"
    offsetValue: number; // 0 || greater than zero (always a number) (optional)
    limitValue: number; //always a number (optional)

    influencerType : any; //array of Influencer Types

    totalSearchedRows: number;

}