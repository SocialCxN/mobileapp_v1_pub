import { BaseModel } from "../base.model";
import { InfluencerProfile } from "./influencer.profile";
import { InterestGroup } from "./interest.group";
import { PaymentDetail } from "../payment/payment.detail";
import { InfluencerObjective } from "./influencer.objective";
import { AudienceLocation } from "../location/audience.location";
import { User } from "../user";
import { SocialStats } from "../social-media/social.stats";
import { AgeGroups } from "./audience-demographics/age.groups";

export class Influencer extends BaseModel {

    /**
     * influencer
        --profile
        --interestDetails
        --paymentDetails
            --bankInfo
            --creditCardInfo
            --paymentGateWayInfo

     */

    profile = new InfluencerProfile();
    interestDetails = new Array<InterestGroup>();
    paymentDetails = new PaymentDetail();
    objectiveDetails = Array<InfluencerObjective>();
    socialStats = new Array<SocialStats>();
    users = new User();
    audienceLocation = new Array<AudienceLocation>();
    audienceAgeGroup = new Array<AgeGroups>();
    selected : boolean = true;
    paymentPlan : string;
    paymentPlanId : number;
    initialOfferAmount : string;
}