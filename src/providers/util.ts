import { Http, RequestOptions, Headers } from "@angular/http";
import { HttpService } from "./base/http.service";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { HomePage } from '../pages/home/home';
import { BrandPage } from '../pages/brand/brand';
import { ProfileInfoPage } from '../pages/brand/profile-info/profile-info';
import { UserInfoPage } from '../pages/brand/user-info/user-info';
import { PaymentInfoPage } from '../pages/brand/payment-info/payment-info';
import { ProfileSummaryPage } from '../pages/brand/profile-summary/profile-summary';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { MenuPage } from '../pages/menu/menu';
import { IonicStorageModule } from '@ionic/storage';
import { AuthPageModule  } from '../pages/auth/auth.module';
import { AuthProvider } from '../providers/auth/auth';
import { LoginPage } from '../pages/auth/login/login';
import { ForgotPasswordPage } from '../pages/auth/forgot-password/forgot-password';
import { ResetPasswordPage } from '../pages/auth/forgot-password/reset-password';
import { RegistrationPage } from '../pages/auth/registration/registration';
import { AutoCompletePage } from '../pages/auth/registration/auto-complete';
import { CountryAutoCompletePage } from '../pages/brand/user-info/country-auto-complete';
import { StateAutoCompletePage } from '../pages/brand/user-info/state-auto-complete';
import { CityAutoCompletePage } from '../pages/brand/user-info/city-auto-complete';
import { TermServicePage } from '../pages/auth/registration/terms-service';
import { VerificationPage } from '../pages/auth/verification/verification';
import { MainPage } from '../pages/auth/main/main';
import { SplashPage } from '../pages/splash/splash';
import { HttpModule } from '@angular/http';
import { CoreModule } from '../providers/core.module';
import { tab } from '../shared/tabs/tabs';
import { InfluencerPage } from '../pages/influencer/influencer';
import { SocialChannelPage } from '../pages/influencer/social-channel/social-channel';
import { PersonalInfoPage } from '../pages/influencer/personal-info/personal-info';
import { InterestGroupsPage } from '../pages/influencer/interest-groups/interest-groups';
import {AudienceDemoGraphicsPage } from '../pages/influencer/audience-demographics/audience-demographics';
import { PaymentInfoInfluencerPage} from '../pages/influencer/payment-info/payment-info';
import {ProfilePreviewPage} from '../pages/influencer/profile-preview/profile-preview'
import {SharedModule } from '../shared/shared.module'
import { NotificationPage } from "../pages/notification/notification";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { FCM } from '@ionic-native/fcm';
import { InfluencerCampaignListPage } from "../pages/campaign/campaign-list/influencer-campaignlist"
import { InfluencerCampaignDetailsPage } from "../pages/campaign/campaign-details/influencer.campaign.details";
import { BrandCampaignDetailsPage } from "../pages/campaign/campaign-details/brand.campaign.details";
import {AcceptDeclineOffer} from "../pages/campaign/campaign-details/accept-decline.offer.modal"
import { InfluencerReportMain } from "../pages/campaign/campaign-report/influencer/report.main";
import { InfluencerReport } from "../pages/campaign/campaign-report/influencer/report";
import { ConsolidatedReportInfluencer } from "../pages/campaign/campaign-report/influencer/consolidated.report";


@Injectable()
export class Utility {

    //onInfluencerChange = new Subject<Influencer>();

    constructor(private _http: HttpService) {
    }

	public getPageReference(pageName: String): any {
		switch(pageName) {
			case "InfluencerCampaignDetailsPage": return InfluencerCampaignDetailsPage;
			case "BrandCampaignDetailsPage" : return BrandCampaignDetailsPage;
			default: NotificationPage;
		}
	}
}