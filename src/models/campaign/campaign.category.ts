import { BaseModel } from "../base.model";

export class CampaignCategory extends BaseModel {

    id: number;
    codeName: string;
    displayName : string;
    selected: boolean;
}