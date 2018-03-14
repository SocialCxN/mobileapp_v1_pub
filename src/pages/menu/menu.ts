import { Component, OnInit, Inject, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { NavController, App ,Events} from 'ionic-angular';
import { BrandPage} from '../brand/brand';
import { InfluencerPage } from '../influencer/influencer';
import { AuthProvider } from "../../providers/auth/auth";
import { User } from "../../models/user";
import { Sidebar } from "../../models/nav/sidebar";
import { InfluencerCampaignListPage } from "../campaign/campaign-list/influencer-campaignlist";
import { UIService } from '../../providers/ui/ui.service'
import {SidemenuSharedData} from "../../shared/sidemenu.shared"
import { CampaignCreate } from "../campaign/campaign-create/campaign.create";
import { BrandCampaignListPage } from "../campaign/campaign-list/brand-campaignlist"
import { MainPage } from '../auth/main/main';
import { LoaderComponent} from '../../shared/loader/loader';
import { NotificationService} from "../../providers/general/notification.service";
import { MessagingComponent } from "../../pages/messaging/messaging.component"
import { InfluencerReferralComponent} from "../../pages/referrals/referrals";

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage  implements OnInit, OnDestroy {

  role : string;

  navigation : {
    sidebar: Sidebar;
};
overAllUnreadStatus : boolean = false;
  constructor(public navCtrl: NavController, private _sharedSideMenu: SidemenuSharedData,
    private loader: LoaderComponent, private events: Events,private _notificationService: NotificationService,
    private _uiService : UIService, private app: App, private _authService: AuthProvider) {
    this._authService.getUser().then((res) =>
    {
      this.role = res.entityType;
      console.log("This role", this.role)
    })
    events.subscribe('overAllUnreadStatus', (overAllUnreadStatus) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log("overAllUnreadStatus", overAllUnreadStatus)
      this.overAllUnreadStatus = overAllUnreadStatus;
    });
  }

  getChatMessagesStatus(){

    this._notificationService.getChatMessagesStatus().subscribe(
        (res) => {
            this.overAllUnreadStatus = res.overAllUnreadStatus;
            console.log("overAllUnreadStatus", this.overAllUnreadStatus)
           // this.event.publish('overAllUnreadStatus', this.overAllUnreadStatus);
            // console.log('data-------' ,res.overAllUnreadStatus);
        },
        (error) => console.error(error)
    );

}

  navigateToCampaignList() {
    if (this.role == "influencer" ) {
      this.navCtrl.push(InfluencerCampaignListPage);
    }
    else {
      this.navCtrl.push(BrandCampaignListPage);
    }
    
  }

  navigateToReferInfluencer() {
    this.navCtrl.push(InfluencerReferralComponent)
  }

  navigateToCampaignCreation() {
    this.navCtrl.push(CampaignCreate)
  }

  onSubmit() {
    this.navCtrl.push(BrandPage);
      //let nav = this.app.getRootNav();

      //nav.push(BrandPage);
  }

  user: User = new User();
  menuLoaded = false;
  ngOnInit(): void {
    this._authService.getUser().then((res)=>{
      this.user = res; 
      this.role = res.entityType;
      setTimeout(()=> {
        this.navigation = this._sharedSideMenu.get();
        this.menuLoaded = true;
      },10);
      //
      this.getChatMessagesStatus();
      console.log("This role",  this._sharedSideMenu.get())

    });
  console.log(this.user);

  // this._authService.loginStatusChanged.subscribe(
  //     (user) => {
  //         this.user = user;
  //         console.log("User getting in nav:", this.user);
  //     },
  //     (error) => console.error(error),
  //     () => console.log('Login state has been marked completed!')
  // );

}

ngOnDestroy(): void {
  //this._authService.loginStatusChanged.unsubscribe();
}

  navigateToProfile() {
    if (this.role == 'brand') {
      this.navCtrl.push(BrandPage);
    }
    else {
      this.navCtrl.push(InfluencerPage);
    }
  }

  navigateToChat() {
    this.app.getRootNav().push(MessagingComponent);
  }


  logout() {
    this.loader.show("Logging out.. Please wait");
    this._authService.logoutUser().then((res)=> {
      setTimeout(()=> {
        // this.loader.hide();
        // this.navCtrl.setRoot(MainPage)
        //window.location.reload();
        this.loader.hide();
        //this.app.getRootNav().pop();
        //this.navCtrl.setRoot(MainPage)
        //console.log("navctrl", this.navCtrl.parent);
        //this.navCtrl.parent.parent.setRoot(MainPage);
        //window.location.reload();
        this.app.getRootNav().setRoot(MainPage);
      },2000);
    });
    
  }
}
