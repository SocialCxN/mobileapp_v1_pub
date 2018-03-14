import { Component, Input, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { NavController, NavParams,Platform, ToastController, Slides } from 'ionic-angular';
import { User } from '../../../models/user';
import { AuthProvider } from '../../../providers/auth/auth'
import { UIService } from '../../../providers/ui/ui.service'
import { Message, MessageTypes } from "../../../models/message";
import { HomePage } from '../../home/home';
import { ForgotPasswordPage  } from '../forgot-password/forgot-password';
import { VerificationPage } from '../verification/verification';
import { RegistrationPage } from '../registration/registration';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderComponent } from '../../../shared/loader/loader';

import { FCM } from '@ionic-native/fcm';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage  implements OnInit {
    getURL: string;

    @Input() role: string = '';
    @Output() onSubmitStarted = new EventEmitter();
    @Output() onSubmitFinished = new EventEmitter<any>();
    @ViewChild('signupSlider') signupSlider: any;
    @ViewChild(Slides) slides: Slides;

    loginForm: FormGroup;
    user: User = new User();
    isUser: User = new User();
    isNameAvailable = true;
    isEmailAvailable = true;
    step: number = 0;
    isAgreed = false;
    isSubmitStarted = false;
    errMsg: string ;
    isError: boolean = false; 
    isLogin:boolean;
    private _name = '';
    private _email = ''; 
    type : String;
    isEmailError = false;
    constructor(public navCtrl: NavController, private _uiService: UIService,private platform: Platform, private fcm: FCM, private _authService: AuthProvider, 
    private loader: LoaderComponent, private navParams: NavParams, public formBuilder: FormBuilder, private toastCtrl: ToastController) {
        this.type =  navParams.get('type');
        this.loginForm = formBuilder.group({
            email:['',  Validators.compose([Validators.maxLength(100), Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), Validators.required])],
            password: ['', Validators.required]
        });
        
 
    }

    ngOnInit(): void {
        this._authService.storeUrlPath("{'abc','abc'}");
        this.getURL = this._authService.getUrlPath();
        console.log("get url",this.getURL);

       this._authService.isLoggedIn().then((isLogin)=> {
            if(isLogin){
                this.navCtrl.push(HomePage);
            }
       });
       
        this.user.entityType = this.role;
    }

    toggleIsAgrreed() {
        this.isAgreed = !this.isAgreed;
    }

    emailFocusIn() {
        this.isEmailError = false;
    }
    emailFocusOut() {
        console.log("is valid", this.loginForm.controls.email.valid);
        if (!this.loginForm.controls.email.valid) {
            this.isEmailError = true;
        }
    }

    changeStep(stepNumber: number) {
        this.step = stepNumber;
    }

    onForgetPassword() {
        this.navCtrl.push(ForgotPasswordPage,{role: this.navParams.get('role')});      
    }

    onRegistration() {
        this.navCtrl.push(RegistrationPage, {
            type: this.navParams.get('type'),
            role: this.navParams.get('role')
        });
    }
    ionViewDidLoad() { this.slides.lockSwipes(true) }
    next() {
        this.slides.lockSwipes(false);
        this.signupSlider.slideNext();
        this.slides.lockSwipes(true);
    }

    getToken() {

    }
    
    onSubmit() {
        this.user.entityType = this.navParams.get('role');
      
        if (this.platform.is('cordova')) {
            this.fcm.subscribeToTopic('marketing');
            console.log("in iff cordova")
            this.fcm.getToken().then(token=>{
              console.log("token is", token);
              this.user.deviceToken = token;
              console.log(this.user)
              //let parent components to know that submit has been started
              this.onSubmitStarted.emit();
              this.isSubmitStarted = true;
              this.loader.show("Logging in... Please wait");
                  this._authService.checkLogin(this.user).subscribe(
                  (res) => {
                      console.log("Res",res);
                      this.onSubmitFinished.emit();
                      this.user = res.json().genericResponse.genericBody.data.userData;
                      //this._authService.storeUser(this.user);
                      this.loader.hide();
                     //this.user.
                      this.isSubmitStarted = false;
                      if (this.user.accountVerified) {
                          this.navCtrl.setRoot(HomePage)
                      }
                      else {
                          this.navCtrl.push(VerificationPage);
                      }
                  },
                  (err) => {
                      console.log(err);
                      this.loader.hide();
                      this.isError = true; 
                      this.isSubmitStarted = false;
                      this.onSubmitFinished.emit(err);
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
                          //this._uiService.showToast(msg,"");
                          this._uiService.presentToast(msg.msg);
                      }            
                  }
              )
             // backend.registerToken(token);
            })
            // You are on a device, cordova plugins are accessible
          } else {
            this.loader.show("Logging in... Please wait");
            this._authService.checkLogin(this.user).subscribe(
            (res) => {
                console.log("Res",res);
                this.onSubmitFinished.emit();
                this.user = res.json().genericResponse.genericBody.data.userData;
                //this._authService.storeUser(this.user);
                this.loader.hide();
               //this.user.
                this.isSubmitStarted = false;
                if (this.user.accountVerified) {
                    this.navCtrl.setRoot(HomePage)
                }
                else {
                    this.navCtrl.push(VerificationPage);
                }
            },
            (err) => {
                console.log(err);
                this.loader.hide();
                this.isError = true; 
                this.isSubmitStarted = false;
                this.onSubmitFinished.emit(err);
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
                    msg.msg = "Sorry, an error has occured. Email or password is incorrect";
                    msg.msgType = MessageTypes.Error;
                    msg.autoCloseAfter = 400;
                    //this.showToastWithCloseButton(msg.msg);
                    //this._uiService.showToast(msg,"");
                    this._uiService.presentToast(msg.msg);
                }            
            }
        )
            // Cordova not accessible, add mock data if necessary
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