import { BaseModel } from "../base.model";

export class SocialMedia extends BaseModel {

    id : number;
    displayName : string;
    codeName : string;
    icon : Array<any>;
    selected : boolean = true;
    totalCount : string;;
    engagementLevelId : number;
}