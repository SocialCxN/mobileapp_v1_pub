import { Notifications} from "../../models/notification/notification"
import { NotificationService} from "../../providers/general/notification.service";
import { Component, OnInit, Inject, OnDestroy, OnChanges, SimpleChanges  } from '@angular/core';
import { NavController , NavParams, App, Events } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { MainPage } from '../auth/main/main';

import { UIService } from '../../providers/ui/ui.service'
import { LoaderComponent} from '../../shared/loader/loader';
import { User } from "../../models/user";
import { NotificationSharedData} from "../../shared/notification.shared"

import { NotificationArray } from "../../models/notification/notification.array";
import { Utility} from "../../providers/util";

import { MessagingComponent } from "../../pages/messaging/messaging.component";
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage implements OnInit {
	
	constructor(public navCtrl: NavController, private _authService: AuthProvider, private app : App, private event: Events, private utility: Utility, public navParams: NavParams, private _notificationService: NotificationService , private _notificationSharedData : NotificationSharedData) {

  }
  

  notif: Notifications = new Notifications();
  countNotif: number;

  showAllNotif = new Array<NotificationArray>();
  newLimitValue : number = 10;
  newOffsetValue : number;
  user: User = new User();

  ionViewDidEnter() {
    this.getMoreNotifications();
  }
  ngOnInit(){
    console.log("in ng oninit notification")
    this._authService.getUser().then((res)=>{
        this.user = res; 
        //
        this.getChatMessagesStatus();
  
      });
    // this.notif = this._notificationSharedData.get();
    // this.newLimitValue = this.notif.limitValue;
    // this.newOffsetValue = this.notif.offsetValue;
    // if (this.notif.notification) {
    //     this.showAllNotif = this.notif.notification.all;
    //     console.log("showAllNotif", this.showAllNotif);
    // }
    // this._notificationService.notificationChanged.subscribe((res)=>{
    //   console.log("in notification",res);
    // })
  }


  updateNotifications(id) {
    this._notificationService.updateNotifications(id).subscribe(
        (res) => {
            console.log("Notification response:", res);
            this.event.publish("notification:read", {});
        },
        (error) => console.error(error)
    );
}

readMe(id, notification) {
    if (notification.readStatus !=1 ) {
        notification.readStatus =1;
        this.updateNotifications(id);
    }
    
    if (notification.parentId != null) {
        let page = this.utility.getPageReference(notification.mobilePage);
        this.navCtrl.push(page, {
            campaignId: notification.parentId
        })
    }
   // this._router.navigateByUrl(url);
}

overAllUnreadStatus : boolean = false;

navigateToChat() {
    this.app.getRootNav().push(MessagingComponent);
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

getMoreNotifications() {
    let post = {
        offsetValue: this.newOffsetValue ,
        limitValue: this.newLimitValue
    };
    this._notificationService.getNotifications(post).subscribe(
        (res) => {
            this.notif = res;
            this.newLimitValue = this.notif.limitValue;
            this.newOffsetValue = this.notif.offsetValue;
            this.newOffsetValue  += this.newLimitValue;
            if (this.notif.notification) {
                this.showAllNotif = this.showAllNotif.concat(this.notif.notification.all);
                console.log("showAllNotif", this.showAllNotif);
            }
        },
        (error) => console.error(error)
    );
}

doInfinite(infiniteScroll) {
    setTimeout(() => {
            let post = {
                offsetValue: this.newOffsetValue ,
                limitValue: this.newLimitValue
            };
            this._notificationService.getNotifications(post).subscribe(
                (res) => {
                    this.notif = res;
                    this.newLimitValue = this.notif.limitValue;
                    this.newOffsetValue = this.notif.offsetValue;
                    this.newOffsetValue  += this.newLimitValue;
                    if (this.notif.notification) {
                        this.showAllNotif = this.showAllNotif.concat(this.notif.notification.all);
                        console.log("showAllNotif", this.showAllNotif);
                    }
                },
                (error) => console.error(error)
            );

            console.log('Async operation has ended');
            infiniteScroll.complete();
    },1000);


}
}