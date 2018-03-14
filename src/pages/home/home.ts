import { Component, OnInit } from '@angular/core';
import { NavController , NavParams, App , Events} from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { MainPage } from '../auth/main/main';
import { MenuPage } from '../menu/menu';
import { DashboardPage } from '../dashboard/dashboard';
import { LoaderComponent} from '../../shared/loader/loader';
import { tab } from '../../shared/tabs/tabs'
import { NotificationPage } from "../notification/notification";

import { Notifications} from "../../models/notification/notification"
import { NotificationService} from "../../providers/general/notification.service";
import { BrandCampaignListPage } from "../campaign/campaign-list/brand-campaignlist";
import { InfluencerCampaignListPage} from "../campaign/campaign-list/influencer-campaignlist";
import { InfluencerCampaignTabListPage } from "../campaign/campaign-list/influencer-campaign-tablist"
import { BrandCampaignTabListPage} from "../campaign/campaign-list/brand-campaign-tablist"
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  role: string;
   tab1Root = MenuPage;
   tab2Root = DashboardPage;
   tab4Root = NotificationPage;
   tab3Root :any;
   isTabShow: any;
  constructor(private _authService: AuthProvider, private _notificationService: NotificationService,
    private event: Events,
    private _tab: tab, private app : App, public navParams:  NavParams, public navCtrl: NavController, public loader: LoaderComponent) {
      this.isTabShow= true;
      this._authService.getUser().then((res) =>
      {
        this.role = res.entityType;
        if (this.role == 'brand') {
          this.tab3Root = BrandCampaignTabListPage;
        }
        else {
          this.tab3Root = InfluencerCampaignTabListPage;
        }
      })
    
    event.subscribe('notification:received', (data) => {
        console.log("in notification receive event , this count value", this.countNotif);
        
        this.countNotif = this.countNotif +1;
        console.log("after value", this.countNotif)
    });

  event.subscribe('notification:read', (data) => {
      console.log("in notification receive event , this count value", this.countNotif);
      
      if (this.countNotif >0) {
        this.countNotif = this.countNotif -1;
      }
     
      console.log("after value", this.countNotif)
  });



  }
  notif: Notifications = new Notifications();
  countNotif: number;

  ngOnInit() {
    this._notificationService.notificationChanged.subscribe((res)=>{
      console.log("in tabs home",res);
      this.countNotif = res.notification.totalUnread;
    })
  }
  
  getNotifications() {
    let post = {
        offsetValue: 0,
        limitValue: 10
    };
    this._notificationService.getNotifications(post).subscribe(
        (res) => {
            this.notif = res;
            console.log("Notification response:", this.notif);
            if (this.notif.notification.totalUnread > 0) {
                this.countNotif = this.notif.notification.totalUnread;
            }
           // this.loader.hide();
            this._notificationService.notificationChanged.next(this.notif);

        },
        (error) => console.error(error)
    );
}

receiveMessage($event) {
  this.countNotif = $event;
}

  logout() {
    this.loader.show("Logging out.. Please wait");
    this._authService.logoutUser().then((res)=> {
      this._tab.setData(false);
      setTimeout(()=> {
        window.location.reload();
        this.loader.hide();
        //this.app.getRootNav().pop();
        //this.navCtrl.setRoot(MainPage)
        //console.log("navctrl", this.navCtrl.parent);
        //this.navCtrl.parent.parent.setRoot(MainPage);
        //window.location.reload();
        //this.app.getRootNav().setRoot(MainPage);
      },2000);
    });
    
  }

}
