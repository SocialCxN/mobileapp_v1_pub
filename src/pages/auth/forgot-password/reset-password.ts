import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { AuthProvider } from '../../../providers/auth/auth'
import { LoaderComponent } from '../../../shared/loader/loader';
import { UIService } from "../../../providers/ui/ui.service";
import { Message, MessageTypes } from "../../../models/message";
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';


@Component({
    selector: 'reset-password',
    templateUrl: 'reset-password.html'
})
export class ResetPasswordPage {

    @Input() key: string = '';
    @Output() onSubmitStarted = new EventEmitter();
    @Output() onSubmitFinished = new EventEmitter<any>();

    resetForm: FormGroup;
    user: User = new User();
    isSubmitted = false;
    successMsg : string ;
    errMsg : string;
    constructor(public navCtrl: NavController,  private toastCtrl: ToastController, private loader: LoaderComponent, private _authService : AuthProvider,public formBuilder: FormBuilder,
                
                private _uiService : UIService) { 

        this.resetForm = formBuilder.group({
             key:['', Validators.compose([Validators.required])],
             password: ['', Validators.compose([Validators.pattern("^(?=.{8,})(?=.*[a-z])(?=.*[@#$%^&+=]).*$") ,Validators.maxLength(20),Validators.required]) ],
             confirmPassword: ['', Validators.compose([Validators.pattern("^(?=.{8,})(?=.*[a-z])(?=.*[@#$%^&+=]).*$") ,Validators.maxLength(20),Validators.required])]
        });
    }

    onClickReset(){
        this.isSubmitted = true;
        //this.key = this.activatedRoute.snapshot.queryParams["k"];
        this.loader.show("Resetting your password.. Please wait");
        this._authService.resetPassword(this.user, this.key).subscribe(
            (res) => {
                this.isSubmitted = false;
                this.loader.hide();
                this.user.entityType = res.json().genericResponse.genericBody.data.userData.entityType;
                this.user.loginEmail = res.json().genericResponse.genericBody.data.userData.loginEmail;
                this.successMsg = res.json().genericResponse.genericBody.message;
                //this.showToastWithCloseButton(this.successMsg);
                this._uiService.presentToast(this.successMsg);
                this.navCtrl.pop();
                // if(this.user.entityType==="digital_agency" || this.user.entityType==="influencer_agent"){
                //     setTimeout((router: Router) => {
                //         this._router.navigate(['/aa-login']);
                //     }, 6000);  //6s 
                // }else
                // { 
                //     setTimeout((router: Router) => {
                //         this._router.navigate(['/ib-login']);
                //     }, 6000);  //6s 
                // }
            
            },
            (err) => {
                this.loader.hide();
                let msg = new Message();
                this.isSubmitted = false;
                if(err.status === 500){
                    msg.msg = "This link is expired or invalid.";
                    this.errMsg = "This link is expired or invalid. Please go to forgot password to generate a new link.";
                }else{
                    msg.msg = "Sorry, an error has occured";
                }
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                
               // this.showToastWithCloseButton(msg.msg)
            }
        )
    }

    onSubmit() {
        this.isSubmitted =true;
    }
isPasswordError = false;
    onPasswordFocusIn() {
        this.isPasswordError = false;
    }
    onPasswordFocusOut() {
        if(!this.resetForm.controls.password.valid) {
            this.isPasswordError = true;
        }
    }
isEqualPasswordError = false; 
isConfirmPasswordError = false;
    onConfirmPasswordFocusIn() {
        this.isEqualPasswordError = false;        
        this.isConfirmPasswordError = false;
    }
    onConfirmPasswordFocusOut() {
        if(!this.resetForm.controls.confirmPassword.valid) {
            this.isConfirmPasswordError = true;
            if (this.user.password != this.user.confirmPassword) {
                this.isEqualPasswordError = true;
            }
        }
        else {
            
            if (this.user.password != this.user.confirmPassword) {
                this.isEqualPasswordError = true;
            }
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