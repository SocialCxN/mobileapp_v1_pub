
import { BaseModel } from "../base.model";
import { Currency } from "../currency";

export class CampaignPaymentDetails extends BaseModel {

    totalBudget: string;
    totalBudgetSpent: string;
    currency: Currency;
    paymentStatus: string;

    
}

