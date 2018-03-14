import { Component, OnInit, Inject, OnDestroy, OnChanges, Output, EventEmitter, SimpleChanges  } from '@angular/core';
import {  NavController , LoadingController, NavParams, App, Events } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { MainPage } from '../auth/main/main';
import { LoaderComponent} from '../../shared/loader/loader';
import { User } from "../../models/user";
import { Sidebar } from "../../models/nav/sidebar";
import { UIService } from '../../providers/ui/ui.service'
import {SidemenuSharedData} from "../../shared/sidemenu.shared";
import { Notifications} from "../../models/notification/notification"
import { NotificationService} from "../../providers/general/notification.service";
import {NotificationSharedData } from "../../shared/notification.shared";
import { CampaignCreate } from "../campaign/campaign-create/campaign.create";
import { InfluencerProfile } from "../../models/influencer/influencer.profile";
import { DashboardService } from "../../providers/general/dashboard.service";
import { Dashboard } from "../../models/dashboard";
import { BrandCampaignDetailsPage} from "../campaign/campaign-details/brand.campaign.details";
import { InfluencerCampaignDetailsPage } from "../campaign/campaign-details/influencer.campaign.details"
import { MessagingComponent } from "../messaging/messaging.component";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage  implements OnInit {
  role: string;
  totalUnread: Number;


  dashboard: Dashboard = new Dashboard();
  influencerProfile = new InfluencerProfile();
  @Output() tabBadge = new EventEmitter<Number>();
  constructor(private _authService: AuthProvider,public loadingCtrl : LoadingController, 
    private _dashboardService : DashboardService,
    private event: Events,
    private _sharedSidemenu: SidemenuSharedData,
    private _uiService : UIService, private app : App, private _notificationSharedData : NotificationSharedData, 
    private _notificationService: NotificationService, public navParams:  NavParams, public navCtrl: NavController, public loader: LoaderComponent) {
      this._authService.getUser().then((res) =>
      {
        this.role = res.entityType;
      })
      
  }
  navigation : {
    sidebar: Sidebar;
};

overAllUnreadStatus : boolean = false;
files: any;
    notif: Notifications = new Notifications();
    countNotif: number;


  user: User = new User();
  loading:any;
  ngOnInit() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: "Please wait"
  });
  this.loading.present().then(()=>{
    this._authService.getUser().then((res)=>{
      this.user = res; 
      this.role = res.entityType;
      console.log("This role", this.role)
      this._uiService.navigationService().subscribe(
        (res) => {
            console.log("Response nav:", res);
            if (res.navigations.sidebar.length > 0) {
                this.navigation = res.navigations;
                this._sharedSidemenu.set(res.navigations);
               // this.loader.hide();
                this.getNotifications();
                this.getChatMessagesStatus();
                console.log("this.sidebarMenu",this.navigation);
                console.log("this.sidebar",this.navigation.sidebar);
            }

            // console.log("sidebar: ", this.sidebarMenu);

        },
        (error) => 
        {
          console.log(error)
        }
    );
    });
  });

  }


  createCampaign() {
    this.navCtrl.push(CampaignCreate);
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

  getNotifications() {
    let post = {
        offsetValue: 0,
        limitValue: 10
    };

    this._notificationService.getNotifications(post).subscribe(
        (res) => {
          this.loading.dismiss();
            this.notif = res;
            console.log("Notification response dashboard:", this.notif);
            if (this.notif.notification.totalUnread > 0) {
                this.countNotif = this.notif.notification.totalUnread;
                //this.tabBadge.emit(this.countNotif)
            }

           
            // setTimeout(()=> {
            //   this.loader.hide();
            // },5000);
            this._notificationSharedData.set(this.notif);
            this._notificationService.notificationChanged.next(this.notif);

        },
        (error) => {
          this.loader.hide();
          console.error(error)
        }
    );
}

ionViewDidEnter() {
  this._authService.getUser().then((res)=>{
    this.user = res; 
    this.loadDashboard(this.user.entityType);
  });
  
}

loadDashboard(entityType) {
  this._dashboardService.getDashboard(entityType).subscribe(
      (res) => {
          this.dashboard = res.dashboard;
          this.files = res.dashboard.caseStudies.files;
          console.log("dashboard", this.dashboard);
          this.influencerProfile = res.dashboard.influencerOfTheMonth.profile;
          console.log("influencerProfile", this.influencerProfile);

      }
  )
}

navigateToChat() {
  this.app.getRootNav().push(MessagingComponent);
}

navigateTo(id){
  console.log("navigation ID", id);
  
  if(this.user.entityType==='brand' ){
      this.navCtrl.push(BrandCampaignDetailsPage, {
        campaignId: id
      })
     // this._router.navigateByUrl('brand/campaign/details/'+id)
  }
  else if(this.user.entityType==='influencer' ){
      // this._router.navigate(['influencer/campaign/details/'],id);
      this.navCtrl.push(InfluencerCampaignDetailsPage, {
        campaignId: id
      })

  }

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
