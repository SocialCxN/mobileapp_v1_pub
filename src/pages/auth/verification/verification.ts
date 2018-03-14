import { Component, OnInit, Inject } from '@angular/core';
import { NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { AuthProvider } from "../../../providers/auth/auth";
import { LoaderComponent } from "../../../shared/loader/loader";
import { UIService } from "../../../providers/ui/ui.service";
import { Message, MessageTypes } from "../../../models/message";
import { User } from "../../../models/user";
import { HomePage } from '../../home/home';
import { FCM } from '@ionic-native/fcm';


@Component({
    selector: 'page-verification',
    templateUrl: 'verification.html',
})
export class VerificationPage implements OnInit {
    currentURL = '';
    key: string;
    private sub: any;
    errMsg: string;
    successMsg: string;
    role: string;
    email: string;
    isSubmitted = false;
    user: User = new User();
    checkUser: any;
    resendEmail: boolean = false;
    hideResend: boolean = false;

    verificationForm: FormGroup;
    constructor(public navCtrl: NavController,private platform: Platform, private fcm: FCM, public formBuilder: FormBuilder,
    private loader : LoaderComponent, private toastCtrl: ToastController, private _authService: AuthProvider, private _uiService: UIService) {
        this.currentURL = window.location.href;
        this.verificationForm = formBuilder.group({
                key:['', Validators.compose([Validators.required])]
            });
    }


    ngOnInit() {

    }


    verifyKey() {
        this.isSubmitted = true;
        this.loader.show("Verifying key.. Please wait")
        this._authService.verifyKey(this.key).subscribe(
            (res) => {
                this.isSubmitted = false;
                
                this.role = res.json().genericResponse.genericBody.data.userData.entityType;
                this.email = res.json().genericResponse.genericBody.data.userData.loginEmail;
                this.successMsg = "Congratulations! Your account has been successfully verified. Please wait while redirecting to login..."
                if (this.role === "digital_agency" || this.role === "influencer_agent") {
                    console.log("this.role", this.role);
                    console.log("this.role", this.role);
                     this._authService.getUser().then((res)=> {
                        this.user = res;
                        if (this.platform.is('cordova')) {
                            
                            this.fcm.getToken().then(token=>{
                              console.log("token is", token);
                              this.user.deviceToken = token;
                              this._authService.checkLogin(this.user).subscribe(
                                (res) => {
                                    this.loader.hide();
                                    //this.onSubmitFinished.emit();
                                    this.isSubmitted = false;       
                                    this.navCtrl.setRoot(HomePage)          
                                    //this.navCtrl.push(HomePage);
                                },
                                (err) => {
                                    console.log(err);
                                    this.loader.hide();
                                    //this.isError = true; 
                                    //this.isSubmitStarted = false;
                                    //this.onSubmitFinished.emit(err);
                                    let msg = new Message();
                                    if (err.status == 400){
                                        this.errMsg = err.json().genericResponse.genericBody.message;
                                        msg.msg = this.errMsg;
                                        msg.msgType = MessageTypes.Error;
                                        msg.autoCloseAfter = 400;
                                        //this.showToastWithCloseButton(msg.msg);
                                        this._uiService.presentToast(msg.msg);
                                        //this._uiService.showToast(msg,"");
                                    }else{
                                        msg.msg = "Sorry, an error has occured";
                                        msg.msgType = MessageTypes.Error;
                                        msg.autoCloseAfter = 400;
                                        //this.showToastWithCloseButton(msg.msg);
                                        this._uiService.presentToast(msg.msg);
                                        //this._uiService.showToast(msg,"");
                                    }            
                                })
                             // backend.registerToken(token);
                            })
                            // You are on a device, cordova plugins are accessible
                          } else {
                            this.loader.hide();
                            // Cordova not accessible, add mock data if necessary
                          }

                     });
                }

                if (this.role === "influencer" || this.role === "brand") {
                    console.log("this.role", this.role);
                     this._authService.getUser().then((res)=> {
                        this.user = res;
                        if (this.platform.is('cordova')) {
                            
                            this.fcm.getToken().then(token=>{
                              console.log("token is", token);
                              this.user.deviceToken = token;
                              this._authService.checkLogin(this.user).subscribe(
                                (res) => {
                                    this.loader.hide();
                                    //this.onSubmitFinished.emit();
                                    this.isSubmitted = false;       
                                    this.navCtrl.setRoot(HomePage)          
                                    //this.navCtrl.push(HomePage);
                                },
                                (err) => {
                                    console.log(err);
                                    this.loader.hide();
                                    //this.isError = true; 
                                    //this.isSubmitStarted = false;
                                    //this.onSubmitFinished.emit(err);
                                    let msg = new Message();
                                    if (err.status == 400){
                                        this.errMsg = err.json().genericResponse.genericBody.message;
                                        msg.msg = this.errMsg;
                                        msg.msgType = MessageTypes.Error;
                                        msg.autoCloseAfter = 400;
                                        //this.showToastWithCloseButton(msg.msg);
                                        this._uiService.presentToast(msg.msg);
                                        //this._uiService.showToast(msg,"");
                                    }else{
                                        msg.msg = "Sorry, an error has occured";
                                        msg.msgType = MessageTypes.Error;
                                        msg.autoCloseAfter = 400;
                                        //this.showToastWithCloseButton(msg.msg);
                                        this._uiService.presentToast(msg.msg);
                                        //this._uiService.showToast(msg,"");
                                    }            
                                })
                             // backend.registerToken(token);
                            })
                            // You are on a device, cordova plugins are accessible
                          } else {
                            this.loader.hide();
                            // Cordova not accessible, add mock data if necessary
                          }
                     });


                    // setTimeout((router: Router) => {
                    //     this._router.navigate(['/ib-login']);
                    // }, 6000);  //6s                
                }

            },
            (err) => {
                console.log(err);
                this.loader.hide();
                this.isSubmitted = false;
                let msg = new Message();
                if (err.status == 400) {
                    msg.msg = "Invalid or Expired key";
                    msg.msgType = MessageTypes.Error;
                    msg.autoCloseAfter = 400;
                    //this.showToastWithCloseButton(msg.msg);
                    this._uiService.presentToast(msg.msg);
                    //this._uiService.showToast(msg, "");
                } else {
                    msg.msg = "Sorry, an error has occured. Check your email.";
                    msg.msgType = MessageTypes.Error;
                    msg.autoCloseAfter = 400;
                    //this.showToastWithCloseButton(msg.msg);
                    this._uiService.presentToast(msg.msg);
                    //this._uiService.showToast(msg, "");
                }
            }
        )
    }

    onClickResend() {
        //call function here to resend email and get back to this same page
        this.isSubmitted = true;
        this.hideResend = true;
        this.resendEmail = false;
        this._authService.getUser().then((res)=> {
          this.user = res;
          this._authService.resendEmail(this.user).subscribe(

              (res) => {
                  // console.log("Email resend successfully.",res);    
                  this.isSubmitted = false;
                  this.hideResend = false;
                  this.resendEmail = true;
                  let msg = new Message();
                  msg.msg = "Email has been resent successfully.";
                  let resMsg = res.json().genericResponse.genericBody.message;
                  
                  if(resMsg ==='your account is already verified' ) {
                      msg.msg = "Your account has already been verified. Please go to login.";
                  }
                  msg.msgType = MessageTypes.Information;
                  msg.autoCloseAfter = 400;
                  //this.showToastWithCloseButton(msg.msg);
                  this._uiService.presentToast(msg.msg);
                  //this._uiService.showToast(msg, "info");
              },
              (err) => {
                  console.log(this.user);

                  console.log(err);
                  this.isSubmitted = false;
                  let msg = new Message();
                  msg.msg = "Sorry, an error has occured";
                  msg.msgType = MessageTypes.Error;
                  msg.autoCloseAfter = 400;
                  //this.showToastWithCloseButton(msg.msg);
                  this._uiService.presentToast(msg.msg);
                  //this._uiService.showToast(msg, "");
              }
          )
        })

    }

    onClickLogin() {
        this.user.entityType = this._authService.getUser().entityType;
       // this.user.entityType === 'brand' || this.user.entityType === 'influencer' ? this._router.navigateByUrl("ib-login") : this._router.navigateByUrl("aa-login");
        if (!this.user.entityType) {
            //this._router.navigateByUrl("ib-login");
        }
    }

  showToastWithCloseButton(errorMsg: string) {
    const toast = this.toastCtrl.create({
      message: errorMsg,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  private dismissHandler() {
    console.info('Toast onDidDismiss()');
  }
}

