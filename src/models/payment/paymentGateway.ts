import { BaseModel } from "../base.model";

export class PaymentGateway extends BaseModel {

    id : number;
    name : string;
    registeredEmail : string;
    registeredContactNumber : string;
    paymentgatewayId : string;
    paymentGatewayTableId : string;

    displayName : string;

    bankTableId: string;
    bankName: string;
    branchName: string;
    ibanNumber: string;
    routingNumber: string;
    ntnNumber: string;
    accountNumber: string;
    accountTitle: string;

    creditCardTableId: string;
    creditCardNumber: string;
    cvcValue: number;
    expiryDate: string;

    gatewayTableId: string;

}