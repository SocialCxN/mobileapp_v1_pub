
import { BaseModel } from "../base.model";

export class AvailableServiceProviders extends BaseModel {
    displayName : string;
    codeName : string;
    regexPattern : string;
    tooltipDescription : string;
}