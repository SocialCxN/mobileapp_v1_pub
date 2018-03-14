import { NgModule } from '@angular/core';
import { HttpModule} from '@angular/http';

import { LogService } from "./log/log.service";
import { AuthProvider } from "./auth/auth";
import { HttpService } from "./base/http.service";
import { UIService } from "./ui/ui.service";
import { CountryService } from './country/country.service';
import { CompleteTestService } from './country/country.provider';
import { BrandService } from "./brand/brand";
import {IndustryService } from "./industry/industry.service";
import {StateService } from "./state/state.provider";
import { CountryIdService} from "../shared/countryid"
import { PaymentGatewayService} from './payment/payment-gateway.service';
import { BankDetailsService } from './payment/bank-details.service';
import { SocialMediaService } from './socialMedia/social.media.service';
import { FBService } from './socialMedia/facebook.service';
import { InfluencerService } from './influencer/influencer.service';
import {CampaignService} from "./campaign/campaign.service";
import { AudienceDemographicsService } from './influencer/audience.demographics.service';
import { AccountService} from "./general/account.service";
import { NotificationService} from "./general/notification.service";
import { FileUploadService } from "./file/file.upload";
import {Utility } from "./util";
import { UtilityService } from "./general/utility.service";
import {AdvanceSearchService } from "./influencer/advance.search.service";
import { DashboardService} from "./general/dashboard.service"
import {  EventData } from "./file/event.data";
import{ InfluencerReferalService } from "./influencer/influencer.referral.service"
@NgModule({
    imports : [HttpModule],
    providers: [{ provide: 'LogService', useClass: LogService},
              {provide: 'AuthProvider', useClass: AuthProvider},
              UIService,FileUploadService,Utility,EventData,AdvanceSearchService, InfluencerReferalService, DashboardService, UtilityService, HttpService,CountryIdService,NotificationService, InfluencerService,CampaignService, AudienceDemographicsService, PaymentGatewayService,FBService,SocialMediaService, BankDetailsService, CountryService, CompleteTestService, BrandService,AccountService, StateService, IndustryService],
    declarations : [],
    exports : []
})
export class CoreModule{}