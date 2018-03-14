import { Component, Output, EventEmitter,OnInit } from '@angular/core';
import { NavController , NavParams } from 'ionic-angular';
import { AuthProvider } from "../../../providers/auth/auth";
import { MainPage } from '../../auth/main/main';
import { LoaderComponent} from '../../../shared/loader/loader';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { User } from "../../../models/user";
import { BrandService } from "../../../providers/brand/brand";
import { UIService } from "../../../providers/ui/ui.service";

import { Message, MessageTypes } from "../../../models/message";

@Component({
    selector: 'page-profile-info',
    templateUrl: 'profile-info.html'
  })
export class ProfileInfoPage  implements OnInit {
    role: string;

    @Output() onSubmitStarted = new EventEmitter();
    @Output() onSubmitFinished = new EventEmitter<any>();

    userInfoForm: FormGroup;
    isFirstNameError = false;
    isLastNameError=false;
    user: User = new User();
    isEmailError = false;
    isEmailAvailable = true;
    isSubmitStarted = false;
    oldEmail : string;

    constructor(private _authService: AuthProvider,public formBuilder: FormBuilder,
      public _brandService: BrandService,public uiService : UIService, public navParams:  NavParams, public navCtrl: NavController, public loader: LoaderComponent) {
        this._authService.getUser().then((res) =>
        {
          this.role = res.entityType;
        })

        this.userInfoForm = formBuilder.group({
          firstName: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("[a-zA-Z ]*"), Validators.required])],
          lastName: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("[a-zA-Z ]*"), Validators.required])],
          email:['', Validators.compose([Validators.maxLength(100), Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), Validators.required])]
        })
    }

    ngOnInit(): void {
    this._authService.getUser().then((res)=> {
      this.user = res;
      this.oldEmail = this.user.loginEmail;
    });

  }

  pop(){
    this.navCtrl.pop();
  }

    onFirstNameFocusIn() {
      this.isFirstNameError = false;
  }

  onFirstNameFocusOut() {
      if (!this.userInfoForm.controls.firstName.valid){
          this.isFirstNameError = true;
      }
  }

  onLastNameFocusIn() {
      this.isLastNameError = false;
  }
  onLastNameFocusOut() {
      if (!this.userInfoForm.controls.lastName.valid) {
          this.isLastNameError = true;
      }
  }

  
  onEmailFocus() {
    this.isEmailError = false;
    this.isEmailAvailable = true;
    //this._email = this.user.loginEmail;
}

onEmailFocusOut() {
    if (!this.userInfoForm.controls.email.valid) {
        this.isEmailError = true;
    }
    else {
      if (this.user.loginEmail != this.oldEmail) {
          if (this.user.loginEmail && this.user.loginEmail.length > 0) {
            this._authService.checkEmailAvailability(this.user.loginEmail, this.role)
                .subscribe(
                () => this.isEmailAvailable = true,
                (err) => {
                    this.isEmailError = true;
                    this.isEmailAvailable = false
                } 

                )
        }
      }
    }

}

onSubmit() {
  
          console.log("this is a submit fntcion");
          
          //let parent components to know that submit has been started
          this.onSubmitStarted.emit();
          this.isSubmitStarted = true;
          console.log(this.user);
          
  
         this._brandService.updateBrandUserInfo(this.user).subscribe(
              (res) => {
                  this.onSubmitFinished.emit();
                  this.isSubmitStarted = false;
                  console.log(res);
                  let msg = new Message();
                  msg.msg = "Your user information has saved successfully.";
                  msg.msgType = MessageTypes.Information;
                  msg.autoCloseAfter = 400;
                  this.uiService.presentToast(msg.msg);
                  this._authService.storeUser(this.user);
  
              },
              (err) => {
                  console.log(err);
                  this.isSubmitStarted = false;
                  this.onSubmitFinished.emit(err);
                  let msg = new Message();
                  msg.msg = "Sorry, an error has occured";
                  msg.msgType = MessageTypes.Error;
                  msg.autoCloseAfter = 400;
                  this.uiService.presentToast(msg.msg);
              }
          )
  
         
  
      }

}