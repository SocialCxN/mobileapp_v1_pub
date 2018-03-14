import { BaseModel } from "../base.model";
import { CampaignPaymentDetails } from "../campaign/campaign.payment.details"
import { OverAllInfluencerStatus } from "../campaign/overallinfluencer.status"
export class BrandCampaignListModel extends BaseModel {

    id: number;
    uniqueId: number;
    name: string
    startDate: string;
    endDate: string;
    noOfInfluencers: number;
    status: string;
    paymentStatus: string;
    totalBudgetSpent: string;
    description: string;
    objectives: Array<string>;
    campaignObjectives: Array<any>;
    referenceUrls: Array<any>;

    mediaUrls:Array<any>;
    socialMediaChannels: Array<any>;
    campaignCategories: Array<any>;
    campaignInfluencerTypes: Array<any>;
    offeredInfluencers: Array<any>;
    owners: Array<any>;
    paymentDetails = new CampaignPaymentDetails;
    overAllInfluencerStatuses = new OverAllInfluencerStatus;
    draftState :string;
    associated : {
        id : number;
        name : string;
        type : string;
    }
}