import { BaseModel } from "../base.model";

export class FacebookPageInfo extends BaseModel {

    id : number;
    name : string;
    fan_count : number;
    totalImpression :number;
    totalEngagement : number;
    avgEngagement : number;
   
}