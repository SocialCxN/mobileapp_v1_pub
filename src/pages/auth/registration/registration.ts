import { Component, Input, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Slides , Platform, ModalController} from 'ionic-angular';
import { User } from "../../../models/user";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { StatusBar, Keyboard } from 'ionic-native';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { AuthProvider } from "../../../providers/auth/auth";
import { LoaderComponent } from '../../../shared/loader/loader';
import { CountryService } from "../../../providers/country/country.service";
import { CompleteTestService } from "../../../providers/country/country.provider";
import { Country } from "../../../models/country";
import { UIService } from "../../../providers/ui/ui.service";
import { Message, MessageTypes } from "../../../models/message";
import { VerificationPage } from '../verification/verification';
import { LoginPage } from '../login/login';
import { AutoCompletePage } from './auto-complete';
import { TermServicePage } from './terms-service';

@Component({
    selector: 'page-registration',
    templateUrl: 'registration.html'
})

export class RegistrationPage implements OnInit {

    @Input() role: string = '';
    @Output() onSubmitStarted = new EventEmitter();
    @Output() onSubmitFinished = new EventEmitter<any>();
    @Input() public options: any;
    @ViewChild('signupSlider') signupSlider: any;
    @ViewChild(Slides) slides: Slides;


    registrationForm: FormGroup;
    registrationFormSecond: FormGroup;
    user: User = new User();
    isNameAvailable = true;
    isEmailAvailable = true;
    step: number = 0;
    isAgreed = false;
    isSubmitted = false;
    isSubmitStarted = false;
    isCountryValid = true;
    countryCtrl: FormControl;
    filteredCountries: any;
    country: FormControl;

    countries: Country[];

    private _name = '';
    private _email = '';
    type: String;

    isFirstNameError = false;
    isLastNameError = false;
    isSocialNameError = false;
    isFullNameError =false;
    isUrlError =false;
    isEmailError = false;
    isPasswordError = false;
    isConfirmPasswordError = false;
    isEqualPasswordError= false;
    constructor( public navCtrl: NavController, public platform:Platform, private _authService: AuthProvider,
        private _countryService: CountryService, private loader: LoaderComponent,
        private _uiService: UIService, private navParams: NavParams, public formBuilder: FormBuilder, 
        private toastCtrl: ToastController, public modalCtrl: ModalController,
        public completeTestService: CompleteTestService) {
        this.type =  navParams.get('type');
        this.role = navParams.get('role');
        this.countryCtrl = new FormControl();
        this.filteredCountries = this.countryCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterCountries(name));

        if (this.role == "influencer") {
            this.registrationForm = formBuilder.group({
                firstName: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("[a-zA-Z ]*"), Validators.required])],
                lastName: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("[a-zA-Z ]*"), Validators.required])],
                fullName: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*"), Validators.required])] ,
                country:['', Validators.compose([Validators.required])],
                
            });
        }
        else {
              this.registrationForm = formBuilder.group({
                fullName: ['', Validators.compose([Validators.maxLength(100), Validators.pattern(this.getNamePattern()), Validators.required])],
                webURL: ['', Validators.compose([Validators.pattern("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$"), Validators.required ]) ]  ,
                country:['', Validators.compose([Validators.required])]
                });
        }

        this.registrationFormSecond = formBuilder.group({
            email:['', Validators.compose([Validators.maxLength(100), Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), Validators.required])],
            password: ['', Validators.compose([Validators.pattern("^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$") ,Validators.maxLength(20),Validators.required]) ],
            confirmPassword: ['', Validators.compose([Validators.pattern("^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$") , Validators.maxLength(20),Validators.required])],
            isAgreed: []
        })



        this.options = {
            placeholder : 'Country'
        };
        
       

    }

    filterCountries(val: string) {
        if (val && val != '') {
            return this.countries.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        else
            return this.countries;
    }


    ngOnInit(): void {

        //if (this._authService.isLoggedIn())
           // this._router.navigate(['/home']);

        this._countryService.getCountries().subscribe(
            (res) => {
                this.countries = res.json().genericResponse.genericBody.data.countries;
                this.filterCountries('');
            },
            (err) => console.log(err)
        )

        
    }

    ionViewDidLoad() { this.slides.lockSwipes(true) }

    // ionViewDidEnter() {
    //     this.platform.ready().then(() => {
    //     Keyboard.disableScroll(false);
    //     });
    // }

    // ionViewWillLeave() {
    //     this.platform.ready().then(() => {
    //     Keyboard.disableScroll(false);
    //     });
    // }
    toggleIsAgrreed() {
        this.isAgreed = !this.isAgreed;
    }

    onFirstNameFocusIn() {
        this.isFirstNameError = false;
    }

    onFirstNameFocusOut() {
        if (!this.registrationForm.controls.firstName.valid){
            this.isFirstNameError = true;
        }
    }

    onLastNameFocusIn() {
        this.isLastNameError = false;
    }
    onLastNameFocusOut() {
        if (!this.registrationForm.controls.lastName.valid) {
            this.isLastNameError = true;
        }
    }

    onSocialNameFocusIn() {
        this.isSocialNameError = false;
    }
    onSocialNameFocusOut() {
        if (!this.registrationForm.controls.fullName.valid) {
            this.isSocialNameError = true;
        }
    }

    onPasswordFocusIn() {
        this.isPasswordError = false;
    }
    onPasswordFocusOut() {
        if(!this.registrationFormSecond.controls.password.valid) {
            this.isPasswordError = true;
        }
    }

    onConfirmPasswordFocusIn() {
        this.isEqualPasswordError = false;        
        this.isConfirmPasswordError = false;
    }
    onConfirmPasswordFocusOut() {
        if(!this.registrationFormSecond.controls.confirmPassword.valid) {
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

    changeStep(stepNumber: number) {
        this.step = stepNumber;
    }

    getItems(val: any) {
        this.user.country = val.name;
        this.user.countryId = val.id;
    }

    

    next() {
        this.slides.lockSwipes(false);
        this.signupSlider.slideNext();
        this.slides.lockSwipes(true);
    }

    onSubmit() {
        console.log("this user", this.user);
        //let parent components to know that submit has been started
        this.onSubmitStarted.emit();
        this.isSubmitStarted = true;
        this.user.entityType = this.role;
        this.loader.show("Signing up.. Please wait")
        this._authService.register(this.user).subscribe(
            () => {
                this.loader.hide();
                this.onSubmitFinished.emit();
                this.isSubmitStarted = false;
                this._authService.storeUser(this.user);
                this.navCtrl.push(VerificationPage);
            },
            (err) => {
                console.log(err);
                this.loader.hide();
                this.isSubmitStarted = false;
                this.onSubmitFinished.emit(err);
                let msg = new Message();
                msg.msg = "Sorry, an error has occured";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                //sthis.showToastWithCloseButton(msg.msg);
                this._uiService.presentToast(msg.msg);
                //this._uiService.showToast(msg, "");
            }
        )

    }

    navToVerification() {
        this.navCtrl.push(VerificationPage);
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

    onUrlFocusIn() {
        this.isUrlError = false;
    }

    onUrlFocusOut() {
        if (!this.registrationForm.controls.webURL.valid) {
            this.isUrlError = true;
        }
        else {
            if (this.user.webUrl && (this.user.webUrl.toLocaleLowerCase().indexOf('http') >= 0 ||
                this.user.webUrl.toLocaleLowerCase().indexOf('https') >= 0)) {
                this.user.webUrl = this.user.webUrl.toLowerCase();
                return;
            }
            else if (this.user.webUrl){
            this.user.webUrl = this.user.webUrl.toLowerCase();
            this.user.webUrl = 'http://' + this.user.webUrl;
            }
        }            
    }

    onNameFocus() {
        this.isFullNameError = false;
        this.isNameAvailable = true;
        this._name = this.user.fullName;
    }

    onNameFocusOut() {
        //don't do anything in case of influencer
        if (this.role === 'influencer') return;

        //console.log(this.role);
        if (!this.registrationForm.controls.fullName.valid) {
            this.isFullNameError = true;
        }
        else {
            if (this.user.fullName && this.user.fullName.length > 0) {
                //check if name is available    
                this._authService.checkEntityNameAvailability(this.user.fullName, this.role)
                    .subscribe(
                    () => this.isNameAvailable = true,
                    (err) =>{
                        this.isFullNameError = true; 
                        this.isNameAvailable = false
                    } 
                    );
            }
        }

    }

    onEmailFocus() {
        this.isEmailError = false;
        this.isEmailAvailable = true;
        this._email = this.user.loginEmail;
    }

    onEmailFocusOut() {
        if (!this.registrationFormSecond.controls.email.valid) {
            this.isEmailError = true;
        }
        else {
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

    onCountryFocusOut() {
        let country = this.countries.filter(c => c.name == this.user.country);
        if (country.length === 0) {
            this.isCountryValid = false;
            return;
        }
        this.isCountryValid = true;
        this.user.countryId = country[0].id;

    }

    isCountryModalOpen = false;
    onCountryFocus() {
        this.isCountryValid = true;
        let autocomplete = this.modalCtrl.create(AutoCompletePage);
        if (!this.isCountryModalOpen) {
            autocomplete.present();
            this.isCountryModalOpen = true;
        }
        
        autocomplete.onDidDismiss(data=>{ //This is a listener which wil get the data passed from modal when the modal's view controller is dismissed
            console.log("Data",data)
            if (data) {
                this.user.country = data.country;
                this.user.countryId = data.countryId;
            }
            this.isCountryModalOpen = false;
        })
    }

    openTermsService() {
        let termsService = this.modalCtrl.create(TermServicePage);
        termsService.present();
        termsService.onDidDismiss(data=> {
            this.isAgreed = data;
        })   
    }

    getNamePattern(): string {
        if (this.role === 'brand' || this.role === 'digital_agency')
            return "^[a-zA-Z0-9 ]*";
        else
            return "^[a-zA-Z ]*";
    }

    getEntityNamePlaceHolder() {
        if (this.role === 'brand')
            return this._uiService.captions['brand'] + ' Name';
        else if (this.role === 'digital_agency')
            return this._uiService.captions['digital_agency'] + ' Name';
        else
            return this._uiService.captions['influencer_agent'] + ' Name';
    }
    onLogin() {
        this.navCtrl.pop();
    }
}