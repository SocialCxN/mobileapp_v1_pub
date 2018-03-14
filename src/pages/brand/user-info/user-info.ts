import { Component, Input , Output, EventEmitter, OnInit} from '@angular/core';
import { NavController , NavParams, ModalController } from 'ionic-angular';
import { AuthProvider } from "../../../providers/auth/auth";
import { MainPage } from '../../auth/main/main';
import { BrandService } from "../../../providers/brand/brand";
import { LoaderComponent} from '../../../shared/loader/loader';
import { CountryIdService } from '../../../shared/countryid'
import { UIService } from "../../../providers/ui/ui.service";
import { BrandProfile} from "../../../models/brand.profile";
import { CountryInfo } from "../../../models/location/country.info";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { CountryService } from "../../../providers/country/country.service";
import { IndustryService } from "../../../providers/industry/industry.service";
import { Country } from "../../../models/country";
import { City } from "../../../models/city";
import { ZipCode} from "../../../models/zipCode";
import { State} from "../../../models/state";
import { Industry } from "../../../models/industry";
import { User } from "../../../models/user";
import { Message, MessageTypes } from "../../../models/message";
import { CountryAutoCompletePage } from "./country-auto-complete";
import { StateAutoCompletePage} from "./state-auto-complete";
import { CityAutoCompletePage} from "./city-auto-complete";

@Component({
    selector: 'user-info',
    templateUrl: 'user-info.html'
  })
export class UserInfoPage implements OnInit {
    role: string;
    userInfoForm: FormGroup;

    @Input()
    brand: BrandProfile = new BrandProfile();

    
    @Output() onCountryChanged = new EventEmitter<CountryInfo>();
    @Output() onSubmitStarted = new EventEmitter();
    @Output() onSubmitFinished = new EventEmitter<any>();

    country: CountryInfo;
    isBrandNameError = false;
    isAboutError = false;
    countryName: string;
    isNameAvailable = false;
    isSubmitStarted = false;
    isSubmitted = false;

    user: User = new User();
    changeUser: User = new User();
    countries: Country[];
    industries: Industry[];
    isUrlError = false;
    brandName : String;
    isContactError =false;
    isCountryValid = true;
    oldCountry = '';
    cities: City[];
    countryId:string;

    zipCodes: ZipCode[];
    zipCodeCanada: boolean = false;
    zipCodeUS: boolean = false;
    zipCodePattern: string = "";
    zipCodeToolTip: string = "";

    
    stateCtrl: FormControl;
    states: State[];
    filteredStates: any;
    isStateSelected: boolean = false;
    isStateValid: boolean = true;
    oldState = '';

    constructor(private _authService: AuthProvider, 
       private modalCtrl: ModalController, private _countryId: CountryIdService, private _industryService: IndustryService, private _stateService: CountryService, private _countryService: CountryService, public formBuilder: FormBuilder,
      public uiService : UIService, public navParams:  NavParams, public _brandService: BrandService,
      public navCtrl: NavController, public loader: LoaderComponent) {

        // if (!this._authService.isLoggedIn())
        // this._router.navigateByUrl('ib-login');
        this.loader.show("Please wait");
    this._brandService.getBrandProfile().subscribe(
        (res) => {
          this.loader.hide();
            let brandInfo = res.json().genericResponse.genericBody.data.brand;
            console.log("brandInfo",brandInfo);
            
            let newBrand = new BrandProfile();

            newBrand.id = brandInfo.profile.id;
            newBrand.about = brandInfo.profile.entityDescription;
            newBrand.brandName = brandInfo.profile.name;
            this.brandName = brandInfo.profile.name;
            newBrand.city = brandInfo.profile.city.name;
            newBrand.cityId = brandInfo.profile.city.id;
            newBrand.contactNumber = brandInfo.profile.contactNumber;
            newBrand.country = brandInfo.profile.country.name;
            newBrand.countryId = brandInfo.profile.country.id;
            this.countryId = brandInfo.profile.country.id;

            newBrand.industry = brandInfo.profile.industry.name;
            newBrand.industryId = brandInfo.profile.industry.id;
            newBrand.postalCode = brandInfo.profile.zipCode;
            newBrand.state = brandInfo.profile.state.name;
            newBrand.stateId = brandInfo.profile.state.id;
            newBrand.streetOne = brandInfo.profile.streetOne;
            newBrand.streetTwo = brandInfo.profile.streetTwo;
            newBrand.zipCode = brandInfo.profile.zipCode;
            // newBrand.postalCode = brandInfo.profile.zipCode;
            newBrand.webUrl = brandInfo.profile.websiteUrl;

           
            this.country = new CountryInfo();
            this.country.id = newBrand.countryId;
            this.country.name = newBrand.country;

            this.brand = newBrand;
        },
        (err) => {
          this.loader.hide();
            console.log(err);
        }
    )
        this.userInfoForm = formBuilder.group({
          brandName: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*"), Validators.required])] ,
          industry: '',
          about: ['',Validators.compose([Validators.maxLength(1000)])],
          webURL: ['', Validators.compose([Validators.pattern("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$"), Validators.required ]) ] ,
          contactNumber:  ['', Validators.compose([Validators.maxLength(20), Validators.minLength(6),  Validators.pattern("[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*")])],
           country:['', Validators.compose([Validators.required])],
           state: '',
           city: '',
           zipCode: '',
           postalCode: '',
           streetOne : '',
           streetTwo : ''
        })
        // this._authService.getUser().then((res) =>
        // {
        //   this.role = res.entityType;
        // })
    }


  pop(){
      this.navCtrl.pop();
  }
  onAboutFocusIn() {
    this.isAboutError = false;
  }

  onAboutFocusOut() {
    this.isAboutError = true;
  }

  onContactFocusIn() {
      this.isContactError = false;
  }
  onContactFocusOut() {
      this.isContactError = true;
  }

  onCountryFocusOut() {
      let country = this.countries.filter(c => c.name == this.brand.country);
      if (country.length === 0) {
        if (this.oldCountry && this.oldCountry != '')
            //this.brand.country = this.oldCountry;
            //else
            this.isCountryValid = false;
        return;
      }


  }

  isCityModalOpen = false;
  onCityFocus() {
    if (this.brand.state) {
        let autocomplete = this.modalCtrl.create(CityAutoCompletePage);
        this._countryId.set(this.brand.stateId);
        if (!this.isCityModalOpen) {
            autocomplete.present();
            this.isCityModalOpen = true;
        }
  
        autocomplete.onDidDismiss(data=>{
          if(data) {
              this.brand.city = data.country;
              this.brand.cityId = data.countryId;
  
          }
          this.isCityModalOpen = false;    
      });
    }
  }

  isStateModalOpen = false;
  onStateFocus() {
      let autocomplete = this.modalCtrl.create(StateAutoCompletePage);
      this._countryId.set(this.countryId);
      if (!this.isStateModalOpen) {
          autocomplete.present();
          this.isStateModalOpen = true;
      }

      autocomplete.onDidDismiss(data=>{
        if(data) {
            if (this.brand.state != data.country) {
                this.brand.state = data.country;
                this.brand.stateId = data.countryId;
                this.brand.city = null;
                this.brand.cityId = null;
            }


            

        }
        this.isStateModalOpen = false;    
    });
  }
  onZipCodeFocus() {

  }

    onZipCodeFocusOut() {
    
            this._countryService.getZipCodes(this.brand.countryId, this.brand.zipCode).subscribe(
                (res) => {
                    console.log(res);
                    this.brand.state = res.json().genericResponse.genericBody.data.state.name;
                    this.brand.stateId = res.json().genericResponse.genericBody.data.state.id;
                    console.log("state:", this.brand.state);
    
                    this.brand.city = res.json().genericResponse.genericBody.data.city.name;
                    this.brand.cityId = res.json().genericResponse.genericBody.data.city.id;
                    console.log("city:", this.brand.city);
    
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    

  onStateFocusOut() {

  }
  
  isCountryModalOpen = false;


  onCountryFocus() {
      this.isCountryValid = true;
      this.oldCountry = this.brand.country;
      this.brand.stateId = null;
      this.brand.cityId = null;
      this.cities = null;

      let autocomplete = this.modalCtrl.create(CountryAutoCompletePage);
      if (!this.isCountryModalOpen) {
          autocomplete.present();
          this.isCountryModalOpen = true;
      }
      
      autocomplete.onDidDismiss(data=>{ //This is a listener which wil get the data passed from modal when the modal's view controller is dismissed
          console.log("Data",data)
          this.isCountryModalOpen = false;
          
          if (data.country) {

              if (this.countryId!= data.countryId) {
                this.brand.country = data.country;
                this.brand.countryId = data.countryId;
                this.countryId = data.countryId ;
                this.brand.stateId = null;
                this.brand.state= null;
                this.brand.city = null;
                this.brand.cityId = null; 
              }
              

          let country = this.countries.filter(c => c.name == this.brand.country);
          if (country.length === 0) {
            if (this.oldCountry && this.oldCountry != '')
                //this.brand.country = this.oldCountry;
                //else
                this.isCountryValid = false;
            return;
          }
    
          this.isCountryValid = true;
          this.zipCodeCanada = false;
          this.zipCodeUS = false;
          this.brand.countryId = country[0].id;
          this.oldCountry = this.brand.country;
          this.countryName = country[0].name.toLowerCase();
    
          if (this.countryName === 'canada') {
            this.zipCodeCanada = true;
        } else
            if (this.countryName === 'united states') {
                this.zipCodeUS = true;
            }
    
        
            // if (this.isCountryValid) {
            //     this.brand.state = null;
            //     this.brand.city = null;
            //     this.states = [];
            //     this._stateService.getStates(this.brand.countryId).subscribe(
            //         (res) => {
            //             this.states = res.json().genericResponse.genericBody.data.states;
            //             this.filterStates('');
            //             console.log(this.brand.countryId);
    
            //         },
            //         (err) => {
            //             console.log(err);
            //         }
            //     );
            // }
    
            let newcountry = new CountryInfo();
            newcountry.id = this.brand.countryId;
            newcountry.name = this.brand.country;
            this.onCountryChanged.emit(newcountry);

        }
      })
  }

  onUrlFocusIn() {
      this.isUrlError = false;
  }

  onUrlFocusOut() {
      if (!this.userInfoForm.controls.webURL.valid) {
          this.isUrlError = true;
      }
      else {
          if (this.brand.webUrl && (this.brand.webUrl.toLocaleLowerCase().indexOf('http') >= 0 ||
              this.brand.webUrl.toLocaleLowerCase().indexOf('https') >= 0)) {
              this.brand.webUrl = this.brand.webUrl.toLowerCase();
              return;
          }
          else if (this.brand.webUrl){
          this.brand.webUrl = this.brand.webUrl.toLowerCase();
          this.brand.webUrl = 'http://' + this.brand.webUrl;
          }
      }            
  }
  onBrandNameFocusIn() {
      this.isBrandNameError = false;
      this.isNameAvailable = true;
      //this._name = this.user.fullName;
  }

  onBrandNameFocusOut() {
      if (!this.userInfoForm.controls.brandName.valid) {
          this.isBrandNameError = true;
      }
      else {

          if (this.brand.brandName != this.brandName) {
            if (this.brand.brandName && this.brand.brandName.length > 0) {
              //check if name is available    
              this._authService.checkEntityNameAvailability(this.brand.brandName, 'brand')
                  .subscribe(
                  () => this.isNameAvailable = true,
                  (err) =>{
                      this.isBrandNameError = true; 
                      this.isNameAvailable = false
                  } 
                  );
            }
          }

      }

  }

  ngOnInit(): void {
    // //getting URL of this page and storing it in public function storeUrlPath
    // this.currentURL = window.location.href;
    // this._authService.storeUrlPath(this.currentURL);


    // this.isLogin = this._authService.isLoggedIn();

    // if (!this.isLogin) {
    //     this._router.navigateByUrl('ib-login');
    // }

    //Get User
    this._authService.getUser().then((res)=>{
      this.user = res;  
    });
    //console.log("Get user from local storage:",this.user);

    this._countryService.getCountries().subscribe(
        (res) => {
            this.countries = res.json().genericResponse.genericBody.data.countries;
            this.filterCountries('');
        },
        (err) => {
            console.log(err);
        }
    );

    this._industryService.getIndustries().subscribe(
        (res) => {
            this.industries = res.json().genericResponse.genericBody.data.industries;
            this.filterIndustries('');
        },
        (err) => {  
            console.log(err);
        }
    );

    //this._countryId.currentId.subscribe(countryId => this.countryId = countryId);

}


onSubmit() {
            if(!this.brand.country || this.brand.country === '')
                this.brand.countryId = null ;
    
            if(!this.brand.city || this.brand.city === '')
                this.brand.cityId = null;
    
            if(!this.brand.state || this.brand.state === '')
                this.brand.stateId = null;
    
    
            //let parent components to know that submit has been started
            this.onSubmitStarted.emit();
            this.isSubmitStarted = true;
    
    
            this._brandService.updateBrandInfo(this.user, this.brand).subscribe(
                (res) => {
                    this.onSubmitFinished.emit();
                    this.isSubmitStarted = false;
                    console.log(res);
                    this._authService.getUser().then((user) => {
                        this.changeUser = user;
                        this.changeUser.fullName = this.brand.brandName;
                        this.changeUser.country = this.brand.country;
                        this.changeUser.countryId = this.brand.countryId;
                        this._countryId.set(this.brand.countryId);
                        this._authService.storeUser(this.changeUser);
                        console.log("getUser:", this._authService.getUser());
                        let msg = new Message();
                        msg.msg = "Your " + this.uiService.captions['brand'] + " information has saved successfully.";
                        msg.msgType = MessageTypes.Information;
                        msg.autoCloseAfter = 400;
                        this.uiService.presentToast(msg.msg);
                    })

    
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
                    //this.uiService.showToast(msg, "");
                }
            )
    
        }
    

filterCountries(val: string) {
  if (val && val != '') {
      return this.countries.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  else
      return this.countries;
}

filterIndustries(val: string) {
  if (val && val != '' && this.industries) {
      return this.industries.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  else
      return this.industries;
}

filterStates(val: string) {
    if (val && val != '' && this.states) {
        return this.states.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    else
        return this.states;
}

}