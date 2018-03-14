
import { BaseModel } from "../base.model";
import { CountryInfo } from "../location/country.info";
import { StateInfo } from "../location/state.info";
import { CityInfo } from "../location/city.info";
import { RatingsList } from "./ratings";
//import {  GenderDemographics } from "../../core/models/influencer/audience-demographics/gender.demographics";

export class InfluencerProfile extends BaseModel {

    name :string;
    entityDescription: string;
    gender: string;
    country = new CountryInfo();
    state = new StateInfo();
    city = new CityInfo();
  
    zipCode: string;
    contactNumber: string;
    contentCreator : boolean;
    contentDistributor : boolean;
    digitalConsultant : boolean;
    //influencerObjectiveIds : Array<number> ;
    
    rating = new RatingsList();
    profilePic: any;
    coverPic: any;

}