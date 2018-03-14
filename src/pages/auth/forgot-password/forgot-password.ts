import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { AuthProvider } from '../../../providers/auth/auth'
import { UIService } from "../../../providers/ui/ui.service";
import { LoaderComponent } from "../../../shared/loader/loader";
import { Message, MessageTypes } from "../../../models/message";
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { ResetPasswordPage } from './reset-password';


@Component({
    selector: 'forgot-password',
    templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage implements OnInit {

    @Input() role: string = '';
    // @Output() onSubmitStarted = new EventEmitter();
    // @Output() onSubmitFinished = new EventEmitter<any>();
    type: string;
    forgetForm: FormGroup;
    user: User = new User();
    isEmailAvailable = true;
    isSubmitStarted = false;
    emailSuccess = false;
    private _name = '';
    private _email = '';
    gotoUrl: string;
    isEmailError = false;
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public loader: LoaderComponent, private toastCtrl: ToastController,private navParams: NavParams,public formBuilder: FormBuilder, private _authService : AuthProvider,
    private _uiService : UIService) {  
      this.type =  navParams.get('type');
      this.role = navParams.get('role');
        this.forgetForm = formBuilder.group({
            email:['', Validators.compose([Validators.maxLength(100), Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), Validators.required])],
        });
    }

    ngOnInit(): void {
        //this.role = this.activatedRoute.snapshot.queryParams["role"];
        // if (this.role==='brand'||this.role=='influencer'){
        //     this.gotoUrl= "/ib-login";
        // }

        // if (this.role==='influencer_agent'||this.role=='digital_agency'){
        //     this.gotoUrl= "/aa-login";
        // }

    }

    onSubmit() {

    }

    recoverPassword(){
        //this.role = this.activatedRoute.snapshot.queryParams["role"];
        this.user.entityType = this.role;
        //console.log(this.user);
        this.loader.show("Processing request.. Please wait")
        this._authService.forgotPassword(this.user).subscribe(
            (res) => {
                this.loader.hide();
                this.emailSuccess = true;
                this.navCtrl.push(ResetPasswordPage).then(() => {
                  // first we find the index of the current view controller:
                  const index = this.viewCtrl.index;
                  // then we remove it from the navigation stack
                  this.navCtrl.remove(index);
                });                
            },
            (err) => {
                // console.log(err);
                this.loader.hide();
                let msg = new Message();
                if(err.status === 400){
                    this.isEmailAvailable = false;
                    msg.msg = "Email address does not exist.";
                }else{
                    msg.msg = "Sorry, an error has occured";
                }
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                //this.showToastWithCloseButton(msg.msg);
                this._uiService.presentToast(msg.msg);
            }
        )
    }
    
    onClickLogin(){
      this.navCtrl.pop();
        //this.role = this.activatedRoute.snapshot.queryParams["role"];
       // this.role=='brand'||this.role=='influencer' ? this._router.navigate(['/ib-login']): this._router.navigate(['/aa-login']);
    }

    emailFocusIn() {
        this.isEmailError = false;
    }

    onEmailFocusOut() {
        if (!this.forgetForm.controls.email.valid) {
            this.isEmailError =true;
        }
        // else {
        //     if(this.user.loginEmail && this.user.loginEmail.length > 0){
        //         this._authService.checkEmailAvailability(this.user.loginEmail, this.role)
        //             .subscribe(
        //                 (res) => {
        //                     this.isEmailAvailable = true;
        //                 },
        //                 (err) => {
        //                     this.isEmailError =true;
        //                     this.isEmailAvailable = false;
        //                 }
                        
        //             )
        //     }
        // }

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