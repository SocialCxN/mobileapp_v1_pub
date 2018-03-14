import { BaseModel } from "./base.model";
import { Currency } from "./currency";

export class User extends BaseModel {
    userName: string; //social CxN user name (must be unique)
    password: any;
    confirmPassword: any
    loginEmail: string;
    fullName: string;
    firstName: string;
    lastName: string;
    country: string;
    countryId: number;
    webUrl: string;
    token: string;
    expiry: number;
    entityType: string;
    entityName: string;
    entityId: number;
    profilePic: any;
    coverPic: any;
    accountVerified: boolean;
    userRole: string;
    roleId: number;
    roleName: string;
    lastLogin: string;
    created: string;
    updated: string;
    gender: string;
    currency : Currency;
    minCampaignPaymentOffer : string;
    termsAgree : any;
    deviceToken: string;
    entityDescription: string;
    associationKey:string;
    planId : string;
    subscription : any;
    permissions = new Array<any>();
    subscriptionRequired : boolean;
}