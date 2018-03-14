import { BaseModel } from "../base.model";
import { InfluencerObjective } from "../influencer/influencer.objective";
import { SocialMedia } from "../social-media/social.media";
import { CampaignPaymentDetails } from "./campaign.payment.details";
import { CampaignCategory } from "./campaign.category";

export class InfluencerCampaignListModel extends BaseModel {

    id: number;
    uniqueId: number;
    name: string
    startDate : string;
    endDate: string;
    noOfInfluencers : number;
    campaignStatus : string;
    totalBudgetSpent : string;
    campaignPaymentStatus: string;
    description : string;
    objectives : Array<string>;
    campaignObjectives = new Array<InfluencerObjective>();
    referenceUrls : Array<string>;
    socialMediaChannels = new Array<SocialMedia>();
    categories : Array<string>;
    offeredInfluencers : Array<any>;
    owner : any;
    status : string;
    paymentStatus : string;
    
    draftState: string;

    paymentDetails: CampaignPaymentDetails;
    campaignCategories = new Array<CampaignCategory>();
    campaignInfluencerTypes = new Array<InfluencerObjective>();
    

    mediaUrls:Array<any>;
}