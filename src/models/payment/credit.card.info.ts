
import { BaseModel } from "../base.model";
import { AvailableServiceProviders } from "./available.service.providers";

export class CreditCardInfo extends BaseModel {

    creditcardNumber : string;
    cvcValue : string;
    expiryDate : string;
    month : string;
    year : string; 
    creditCardTableId: number;

    serviceProvider = new AvailableServiceProviders();


}