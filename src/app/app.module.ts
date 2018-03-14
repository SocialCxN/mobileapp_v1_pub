import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { MyApp } from './app.component';
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
import { InfluencerCampaignTabListPage} from "../pages/campaign/campaign-list/influencer-campaign-tablist"
import { BrandCampaignListPage } from "../pages/campaign/campaign-list/brand-campaignlist"
import { BrandCampaignTabListPage } from "../pages/campaign/campaign-list/brand-campaign-tablist"
import {  InfluencerCampaignDetailsPage } from "../pages/campaign/campaign-details/influencer.campaign.details";
import {AcceptDeclineOffer} from "../pages/campaign/campaign-details/accept-decline.offer.modal"
import { InfluencerReportMain } from "../pages/campaign/campaign-report/influencer/report.main";
import { InfluencerReport } from "../pages/campaign/campaign-report/influencer/report";
import { ConsolidatedReportInfluencer } from "../pages/campaign/campaign-report/influencer/consolidated.report";
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Clipboard } from '@ionic-native/clipboard';
import { ImagePicker } from '@ionic-native/image-picker';
import { CampaignCreate } from "../pages/campaign/campaign-create/campaign.create";
import { DatePicker } from '@ionic-native/date-picker';
import {DateRangeModal } from "../pages/campaign/campaign-create/date-range"
import { UtmModal} from "../pages/campaign/campaign-create/utm.modal"
import { DatePipe } from '@angular/common'
import {BrandCampaignDetailsPage } from "../pages/campaign/campaign-details/brand.campaign.details"
import {CampaignSelectInfluencerComponent } from "../pages/campaign/campaign-select-influencer/campaign.select.influencer.component"
import {CampaignAddInfluencerComponent } from "../pages/campaign/campaign-select-influencer/campaign.add.influencer"
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { TabindexDirective} from "../shared/directives/tabindex.directive";
import {MessagingComponent } from "../pages/messaging/messaging.component"
import { InfluencerReferralComponent } from "../pages/referrals/referrals"

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SplashPage,
    MainPage,
    ForgotPasswordPage,
    RegistrationPage,
    VerificationPage,
    ResetPasswordPage,
    AutoCompletePage,
    TermServicePage,
    BrandPage,
    DashboardPage,
    MenuPage,
    ProfileInfoPage,
    UserInfoPage,
    ProfileSummaryPage,
    PaymentInfoPage,
    CountryAutoCompletePage,
    StateAutoCompletePage,
    CityAutoCompletePage,
    InfluencerPage,
    SocialChannelPage,
    PersonalInfoPage,
    InterestGroupsPage,
    AudienceDemoGraphicsPage,
    PaymentInfoInfluencerPage,
    ProfilePreviewPage,
    InfluencerCampaignListPage,
    InfluencerCampaignDetailsPage,
    AcceptDeclineOffer,
    InfluencerReportMain,
    InfluencerReport,
    ConsolidatedReportInfluencer,
    NotificationPage,
    CampaignCreate,
    BrandCampaignListPage,
    DateRangeModal,
    UtmModal,
    CampaignSelectInfluencerComponent,
    BrandCampaignDetailsPage,
    CampaignAddInfluencerComponent,
    InfluencerCampaignTabListPage,
    BrandCampaignTabListPage,
    TabindexDirective,
    MessagingComponent,
    InfluencerReferralComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
            scrollPadding: false,
            scrollAssist: true,
            autoFocusAssist: false

    }),
    IonicStorageModule.forRoot(),
    AuthPageModule,
    CoreModule,
    AutoCompleteModule,
    SharedModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SplashPage,
    MainPage,
    ForgotPasswordPage,
    RegistrationPage,
    VerificationPage,
    ResetPasswordPage,
    AutoCompletePage,
    TermServicePage,
    BrandPage,
    DashboardPage,
    MenuPage,
    ProfileInfoPage,
    UserInfoPage,
    ProfileSummaryPage,
    PaymentInfoPage,
    CountryAutoCompletePage,
    StateAutoCompletePage,
    CityAutoCompletePage,
    InfluencerPage,
    SocialChannelPage,
    PersonalInfoPage,
    InterestGroupsPage,
    AudienceDemoGraphicsPage,
    PaymentInfoInfluencerPage,
    ProfilePreviewPage,
    InfluencerCampaignListPage,
    InfluencerCampaignDetailsPage,
    AcceptDeclineOffer,
    InfluencerReportMain,
    InfluencerReport,
    ConsolidatedReportInfluencer,
    NotificationPage,
    CampaignCreate,
    BrandCampaignListPage,
    DateRangeModal,
    UtmModal,
    BrandCampaignDetailsPage,
    CampaignAddInfluencerComponent,
    InfluencerCampaignTabListPage,
    BrandCampaignTabListPage,
    MessagingComponent,
    InfluencerReferralComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    tab,
    FCM,
    FileChooser,
    FileTransfer,
    File,
    Camera,
    FilePath,
    InAppBrowser,
    Clipboard,
    ImagePicker,
    DatePicker,
    DatePipe,
    PhotoViewer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
