import { BaseModel } from "../base.model";


export class Campaign extends BaseModel {

    id: number;
    associatedId: number;
    campaignObjectiveIds: Array<number>
    campaignObjectiveDescription: string;
    campaignSocialMediaChannelIds: Array<number>
    campaignInfluencerTypeIds: Array<number>
    campaignName: string
    campaignCategoryIds: Array<number>
    campaignStartDate: string;
    campaignEndDate: string;
    campaignDescription: string;
    campaignReferenceUrls: Array<string>
    draftState: string;
    currencyId: number;
    offeredInfluencers: Array<any>;
    attachmentIds : Array<any>;
    campaignMediaLinks : Array<string>;
    attachments: Array<any>;
    
}
