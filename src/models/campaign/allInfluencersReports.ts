import { BaseModel } from "../base.model";
import { PaymentPlans } from "../payment/payment.plans";
import { Currency } from "../currency";
import { CampaignReport } from "./campaign.report";

export class AllInfluencersReports extends BaseModel {

    campaignReportId : number;
    approveReportFeedback : string;
    cpeValue : string;
    allowSentiment: string;
    offeredInfluencer : {
        socialName : string,
        userDetails : {
            id : number,
            firstName :  string,
            lastName :  string,
        };
        paymentDetails: {
            paymentPlan : PaymentPlans,
            finalOfferedAmount : string,
            initialOfferedAmount : string,
            earnAmount : string,
            paymentStatus : string,
            serviceCharge : {
                id : number;
                serviceChargeValue : number,
                serviceChargeType : string,
            };
            currency: Currency,
        };

    };
    overAllEngagement : number;
    overAllEngagementRate : number;
    overAllReach: number;
    overAllStatus : string;
    rejectReportFeedback : string;
    reportDescription : string;
    submissionDate : string;
    allReports = new Array<CampaignReport>();
    influencerCampaignSentiments : {
        id : number,
        displayName : string,
        placeholderDescription : string,
        codeName: string, 
        sortValue : string
    }
}