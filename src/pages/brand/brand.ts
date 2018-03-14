import { Component } from '@angular/core';
import { NavController , NavParams, App, Platform, AlertController  } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { MainPage } from '../auth/main/main';
import { MenuPage } from '../menu/menu';
import { DashboardPage } from '../dashboard/dashboard';
import { LoaderComponent} from '../../shared/loader/loader';
import { tab } from '../../shared/tabs/tabs';
import { UIService } from '../../providers/ui/ui.service'
import { Message, MessageTypes } from "../../models/message";
import { BrandProfile } from "../../models/brand.profile";
import { UserInfoPage } from "./user-info/user-info";
import { PaymentInfoPage } from "./payment-info/payment-info";
import {  ProfileInfoPage } from "./profile-info/profile-info"
import { BrandService } from "../../providers/brand/brand";
import { PaymentGateway } from "../../models/payment/paymentGateway";
import { BankDetails } from "../../models/payment/bank.details";
import { CountryInfo } from "../../models/location/country.info";
import { CreditCardInfo } from "../../models/payment/credit.card.info";
import { CountryIdService } from '../../shared/countryid'
import { AccountService } from "../../providers/general/account.service";
import { ProfileSummaryPage } from './profile-summary/profile-summary';
import { InfluencerSharedData} from "../../shared/influencer.profile";
import { User } from "../../models/user";
@Component({
  selector: 'page-brand',
  templateUrl: 'brand.html'
})
export class BrandPage {
  role: string;
  tab1Root = MenuPage;
  tab2Root = DashboardPage;
  isTabShow: any;

  brand: BrandProfile = new BrandProfile();
  bank: BankDetails = new BankDetails();
  country: CountryInfo;

  brandName : string;
  countryId : string;
  isIos = false;
  user = new User();
 constructor(private _authService: AuthProvider, private alertCtrl: AlertController, private _uiService : UIService,
  private _InfluencerSharedData: InfluencerSharedData, private _accountService: AccountService,
  public platform: Platform,  private _countryId: CountryIdService, public _brandService: BrandService,
   private _tab: tab, private app : App, public navParams:  NavParams, public navCtrl: NavController, public loader: LoaderComponent) {
     this.isTabShow= true;
     this._authService.getUser().then((res) =>
     {
       this.role = res.entityType;
     }) 

     this.isIos = this.platform.is('ios') ? true : false;

    this.loader.show("Please wait")
     this._brandService.getBrandProfile().subscribe(
      (res) => {
        this.loader.hide();
          let brandInfo = res.json().genericResponse.genericBody.data.brand;
          console.log("brandInfo",brandInfo);
          this._InfluencerSharedData.setInfluencer(brandInfo);
          let newBrand = new BrandProfile();

          newBrand.id = brandInfo.profile.id;
          newBrand.about = brandInfo.profile.entityDescription;
          newBrand.brandName = brandInfo.profile.name;
          this.brandName = brandInfo.profile.name;
          newBrand.city = brandInfo.profile.city.name;
          newBrand.cityId = brandInfo.profile.city.id;
          newBrand.contactNumber = brandInfo.profile.contactNumber;
          newBrand.country = brandInfo.profile.country.name;
          newBrand.countryId = brandInfo.profile.country.id;
          this.countryId = brandInfo.profile.country.id;
          this._countryId.set(this.countryId);
          newBrand.industry = brandInfo.profile.industry.name;
          newBrand.industryId = brandInfo.profile.industry.id;
          newBrand.postalCode = brandInfo.profile.zipCode;
          newBrand.state = brandInfo.profile.state.name;
          newBrand.stateId = brandInfo.profile.state.id;
          newBrand.streetOne = brandInfo.profile.streetOne;
          newBrand.streetTwo = brandInfo.profile.streetTwo;
          newBrand.zipCode = brandInfo.profile.zipCode;
          // newBrand.postalCode = brandInfo.profile.zipCode;
          newBrand.webUrl = brandInfo.profile.websiteUrl;

         
          this.country = new CountryInfo();
          this.country.id = newBrand.countryId;
          this.country.name = newBrand.country;

          this.brand = newBrand;
      },
      (err) => {
        this.loader.hide();
          console.log(err);
      }
  )
 }

 
 pop(){
  this.navCtrl.pop();
}

 navigate(page: string) {
   if (page == "user-info") {
    this.navCtrl.push(UserInfoPage);
   }
   else if (page == "profile-info") {
     this.navCtrl.push(ProfileInfoPage);
   }
   else if (page == "payment-info") {
    this.navCtrl.push(PaymentInfoPage);
   }
   else if (page == "profile-view") {
     this.navCtrl.push(ProfileSummaryPage);
   }
 }

//  logout() {
//   this.loader.show("Logging out.. Please wait");
//   this._authService.logoutUser().then((res)=> {
//     this._tab.setData(false);
//     setTimeout(()=> {
//       window.location.reload();
//       this.loader.hide();
//       //this.app.getRootNav().pop();
//       //this.navCtrl.setRoot(MainPage)
//       //console.log("navctrl", this.navCtrl.parent);
//       //this.navCtrl.parent.parent.setRoot(MainPage);
//       //window.location.reload();
//       //this.app.getRootNav().setRoot(MainPage);
//     },2000);
//   });
  
// }

ngOnInit() {
  this._authService.getUser().then((res)=>{
    this.user = res;  


    })


}



userId: number;
type: string=  "brand";
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
