import { Component, OnInit, Inject, NgZone, ViewChild } from '@angular/core';
import { Platform, ModalController, IonicApp, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/auth/login/login';
import { SplashPage } from '../pages/splash/splash';
import { MainPage } from '../pages/auth/main/main';
import { UIService } from '../providers/ui/ui.service';
import { AuthProvider } from '../providers/auth/auth';
import { FCM } from '@ionic-native/fcm';
import {  Utility } from "../providers/util"

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = MainPage;

  @ViewChild(Nav) nav;
  isLoggedIn : boolean = false;
  constructor(platform: Platform, private fcm: FCM,statusBar: StatusBar, private app: IonicApp,
    public _authService: AuthProvider, splashScreen: SplashScreen, public event: Events,
  private _zone : NgZone,  modalCtrl: ModalController, private _uiService : UIService, private utility: Utility) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      let splash = modalCtrl.create(SplashPage);
      splash.present();
      this._uiService.initCaptions();
      //splashScreen.hide();
       //get loggedin status
      this._authService.isLoggedIn().then((isLoggedIn)=> {
        console.log("in app module",this.isLoggedIn);
          if (isLoggedIn) {
            this.rootPage = HomePage;
            if (platform.is('cordova')) {
              fcm.onNotification().subscribe(data=>{
                if(data.wasTapped){
                  console.log("Received in background",data);
                  let page = this.utility.getPageReference(data.state);
                  //var nav = this.app.getActiveNav();
                  this.nav.push(page, {
                      campaignId: data.id
                  })
                } else {
                  console.log("Received in foreground", data);
                  event.publish('notification:received', {});
                };
      
              })
            }

          } 
      });

      if (platform.is('cordova')) {
        fcm.subscribeToTopic('marketing');
        
        fcm.getToken().then(token=>{
          console.log("token is", token);
         // backend.registerToken(token);
        })
        

        
        fcm.onTokenRefresh().subscribe(token=>{
          console.log("token is", token);
          //backend.registerToken(token);
        })
        
        fcm.unsubscribeFromTopic('marketing');
        // You are on a device, cordova plugins are accessible
      } else {
        // Cordova not accessible, add mock data if necessary
      }

 

      //get updates
      this._authService.loginStatusChanged.subscribe(
        (user) => {
                     
       //   this._zone.run( () => {
            this._authService.isLoggedIn().then((isLoggedIn)=> {
              console.log("in app module",this.isLoggedIn);
                if (isLoggedIn) {
                  this.rootPage = HomePage;
                } 
            });
            
          //   console.log('Re-drawing header, footer & navigation bar!');
          //   console.log(this.token);
          // })
        }
      )
    });
  }
}

