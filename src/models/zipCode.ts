import { BaseModel } from "./base.model";

export class ZipCode extends BaseModel {

    stateId : number;
    stateName : string;
    cityId : number;
    cityName : string;

}