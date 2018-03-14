import { BaseModel } from "./base.model";

export class BrandProfile extends BaseModel {
    firstName: string;
    lastName: string;
    loginEmail: string;
    country: string;
    countryId: number;
    brandName: string;
    industry: string;
    industryId: number;
    city: string;
    cityId: number;
    state: string;
    stateId: number;
    streetOne: string;
    streetTwo: string;
    zipCode: string;
    postalCode: string;
    about: string;
    imgFile: any;
    contactNumber: string;
    webUrl: string;
    getLocation: string;
    termsAgree:string;
}