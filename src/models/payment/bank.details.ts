import { BaseModel } from "../base.model";

export class BankDetails extends BaseModel {

    id: number;
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
    paymentgatewayId: number;
    registeredEmail: string;
    easypayEmail: string;
    easypayTableId: string;
    stripeEmail: string;
    stripeTableId: string;
    paypalEmail: string;
    paypalTableId: string;
    registeredContactNumber: string;
    paymentName: string;

    month: any;
    year: any;

    selectedProvider: string;
    regexPattern: string;




}