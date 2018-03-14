
import { Component } from '@angular/core';
import { NavController , NavParams, App, Platform , AlertController } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { MainPage } from '../auth/main/main';
import { MenuPage } from '../menu/menu';
import { DashboardPage } from '../dashboard/dashboard';
import { LoaderComponent} from '../../shared/loader/loader';
import { tab } from '../../shared/tabs/tabs';
import { UIService } from '../../providers/ui/ui.service'
import { Message, MessageTypes } from "../../models/message";
import { BrandProfile } from "../../models/brand.profile";
import { SocialChannelPage} from "./social-channel/social-channel";
import { PersonalInfoPage} from "./personal-info/personal-info";
import { InterestGroupsPage} from "./interest-groups/interest-groups";
import {AudienceDemoGraphicsPage } from "./audience-demographics/audience-demographics";
import {PaymentInfoInfluencerPage} from "./payment-info/payment-info"
import { ProfilePreviewPage} from "./profile-preview/profile-preview";
import { BankDetails } from "../../models/payment/bank.details";
import { InfluencerProfile } from "../../models/influencer/influencer.profile";
import { InfluencerService } from "../../providers/influencer/influencer.service";
import { InterestGroup } from "../../models/influencer/interest.group";
import { Influencer } from "../../models/influencer/influencer";
import { User } from "../../models/user";
import { InfluencerObjective } from "../../models/influencer/influencer.objective";
import { PaymentDetail } from "../../models/payment/payment.detail";
import { CountryInfo } from "../../models/location/country.info";
import { GenderDemographics } from "../../models/influencer/audience-demographics/gender.demographics";
import { SocialStats } from "../../models/social-media/social.stats";
import { AudienceLocation } from "../../models/location/audience.location";
import { AgeGroups } from "../../models/influencer/audience-demographics/age.groups";
import { InfluencerSharedData } from "../../shared/influencer.profile"
import { AccountService } from "../../providers/general/account.service";
@Component({
  selector: 'page-influencer',
  templateUrl: 'influencer.html'
})
export class InfluencerPage {
  
    entityId: number = 0;
    influencerProfile = new Influencer();
    brand = new BrandProfile();
    user: User;
    bank: BankDetails = new BankDetails();
    paymentDetails: PaymentDetail = new PaymentDetail();
    selectedInterests = new Array<InterestGroup>();
    selectedObjectives = new Array<InfluencerObjective>();
    country = new CountryInfo();
    socialStats = new Array<SocialStats>();

    Genderdemographics = new GenderDemographics();

    getAudienceLocation = new Array<AudienceLocation>();
    genderdemographics = new GenderDemographics();
    ageGroups = new Array<AgeGroups>();


    constructor( private _influencerService : InfluencerService,
        private _accountService: AccountService, private alertCtrl: AlertController,
     private _authService : AuthProvider, private _navCtrl: NavController, private _uiService: UIService,
     private _influencerSharedData: InfluencerSharedData,public loader: LoaderComponent) {

    }

    navigate(page: String) {
        if (page == 'social') {
            this._navCtrl.push(SocialChannelPage);
        }
       else if (page == 'personal-info') {
            this._navCtrl.push(PersonalInfoPage)
       }
       else if (page == 'interests') {
        this._navCtrl.push(InterestGroupsPage)
       }
       else if (page == 'demographics') {
        this._navCtrl.push(AudienceDemoGraphicsPage)
       }

       else if (page == 'payment-info') {
        this._navCtrl.push(PaymentInfoInfluencerPage)
       }
       else if (page == 'profile') {
        this._navCtrl.push(ProfilePreviewPage)
       }
    }

    ionViewDidEnter() {
        this.loader.show("Please wait..")
        this._authService.getUser().then((res)=>{
          this.user = res;  
          this._influencerService.getPersonalInfo().subscribe(
            (influencer) => {
                console.log("influencer", influencer);
                this.loader.hide();
                // this.influencerProfile = new Influencer();
                this.influencerProfile = influencer;
                this._influencerSharedData.setInfluencer(influencer);
                this.selectedInterests = influencer.interestDetails;
                this.paymentDetails = influencer.paymentDetails;
                this.country = influencer.profile.country;
                this.entityId = influencer.profile.id;
                this.socialStats = influencer.socialStats;
                // console.log("ddddddddd",influencer['audienceGender'][0]);
                //this.Genderdemographics = influencer['audienceGender'][0].percentage;
                this.getAudienceLocation = influencer.audienceLocation;

                this.genderdemographics = influencer["audienceGender"];

                this.ageGroups = influencer.audienceAgeGroup;

            }
        )
        });
    }
    ngOnInit() {

        

    }


    userId: number;
    type: string=  "influencer";
    reason: string;
    isReason: boolean = true;

    onDisableRequest() {
        console.log('onDisableRequest');

        let alert = this.alertCtrl.create({
            title: 'Send a disable account request',
            inputs: [
              {
                name: 'reason',
                placeholder: 'Give a reason'
              }
            ],
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Submit',
                handler: data => {
                    let check = data.reason.trim();
                    console.log("check", check);
            
                    if (check.length < 1) {
                        this.isReason = false;
                        console.log("this.isReason", this.isReason);
                        return;
                    } else {
                        this.isReason = true;
                    }
                    let post = {
                        id: this.user.entityId,
                        reason: data.reason
                    }
                    this._accountService.disableAccountRequest(post, this.type).subscribe(
                        (res) => {
                            console.log("response of disable request", res);
                            let msg = new Message();
                            msg.msg = "Your request has been sent successfully";
                            msg.msgType = MessageTypes.Information;
                            msg.autoCloseAfter = 400;
                            this._uiService.presentToast(msg.msg);
                           // this.dialogRef.close();
                        },
                        (err) => {
                            let msg = new Message();
                            msg.msg = "Sorry, an error has occurred";
                            msg.msgType = MessageTypes.Error;
                            msg.autoCloseAfter = 400;
                            this._uiService.presentToast(msg.msg);
                        }
                    )
                }
              }
            ]
          });
          alert.present();
    }
}
