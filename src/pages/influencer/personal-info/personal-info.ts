import { Component, OnInit, Inject, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { NavController , NavParams, ModalController } from 'ionic-angular';
import { InfluencerService } from "../../../providers/influencer/influencer.service";
import { AuthProvider } from "../../../providers/auth/auth";
import { Influencer } from "../../../models/influencer/influencer";
import { InfluencerObjective } from "../../../models/influencer/influencer.objective";
import { CountryInfo } from "../../../models/location/country.info";
import { CountryService } from "../../../providers/country/country.service";
import { IndustryService } from "../../../providers/industry/industry.service";
import { Country } from "../../../models/country";
import { ZipCode } from "../../../models/zipCode";
import { State } from "../../../models/state";
import { City } from "../../../models/city";
import { InfluencerProfile } from "../../../models/influencer/influencer.profile";
import { BrandProfile } from "../../../models/brand.profile";
import { User } from "../../../models/user";
import { LoaderComponent} from '../../../shared/loader/loader';
import { CountryIdService } from '../../../shared/countryid'
import { UIService } from "../../../providers/ui/ui.service";
import { CountryAutoCompletePage } from "..//../brand/user-info/country-auto-complete";
import { Message, MessageTypes } from "../../../models/message";

import { StateAutoCompletePage } from "..//../brand/user-info/state-auto-complete";

import { CityAutoCompletePage } from "..//../brand/user-info/city-auto-complete";
import { InfluencerSharedData } from "../../../shared/influencer.profile"

@Component({
    selector: 'page-personal-info',
    templateUrl: 'personal-info.html'
  })

export class PersonalInfoPage implements OnInit {
  userInfoForm: FormGroup;

  @Input() 
  user: User = new User();
  @Input() 
  influencer: Influencer = new Influencer();
  @Input() selectedObjectives: Array<InfluencerObjective>;
  @Output() onCountryChanged = new EventEmitter<CountryInfo>();


  genders = [
      'Male',
      'Female'
  ];
  maskPattern = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  allObjectives: Array<InfluencerObjective>;

  isEmailAvailable = true;
  isSubmitStarted = false;
  isSubmitted = false;

  countryName: string;
  isCountryValid = true;
  countryCtrl: FormControl;
  filteredCountries: any;
  countries: Country[];

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


  cities: City[];
  filteredCities: any;
  cityCtrl: FormControl;
  isCityValid: boolean = true;
  contactErr: boolean = false;
  objErr: boolean = false;

  isFirstNameError: boolean;
  isLastNameError: boolean;
  isSocialNameError : boolean;
  countryId : number;

  selected_Values=[];
  constructor(private _navCtrl: NavController, private _authService: AuthProvider,
    public formBuilder: FormBuilder,
    private _influencerService: InfluencerService,
    private _uiService: UIService,
     private _countryId: CountryIdService, 
    private _countryService: CountryService,
    private _cityService: CountryService,
    private _stateService: CountryService,
    public navCtrl: NavController, public loader: LoaderComponent,
     private modalCtrl: ModalController,
     private _influencerSharedData: InfluencerSharedData) {
    

    this.userInfoForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("[a-zA-Z ]*"), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("[a-zA-Z ]*"), Validators.required])],
      socialName: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*"), Validators.required])] ,
      about: ['',Validators.compose([Validators.maxLength(1000)])],
      contactNumber:  ['', Validators.compose([Validators.maxLength(20), Validators.minLength(10),  Validators.pattern("[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*"), Validators.required])],
      country:['', Validators.compose([Validators.required])],
      state: '',
      city: '',
      zipCode: '',
      postalCode: '',
      gender: '',
      email: '',
      userType: ''
    })
  }

  
  filterCountries(val: string) {
    if (val && val != '' && this.countries) {
        return this.countries.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    else
        return this.countries;
}


filterStates(val: string) {
    if (val && val != '' && this.states) {
        return this.states.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    else {
        return this.states;
    }
}

filterCities(val: string) {
    if (val && val != '' && this.cities) {
        return this.cities.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    else
        return this.cities;
}

  ngOnInit(): void {
    
         this._authService.getUser().then((res)=>{
          this.user = res;  
        });
    this.influencer =  this._influencerSharedData.getInfluencer();
    this.countryId = this.influencer.profile.country.id;
            console.log("influencers is", this.influencer);
            this._countryService.getCountries().subscribe(
                (res) => {
                    this.countries = res.json().genericResponse.genericBody.data.countries;
                    this.filterCountries('');
                },
                (err) => {
                    console.log(err);
                }
            );
            this.loader.show("Please wait..")
            this._influencerService.getInfluencerObjects().subscribe(res => {
    
                this.allObjectives = res;
                this.loader.hide();
                if (!this.allObjectives || !this.influencer.objectiveDetails) return;
                this.allObjectives.forEach(obj => {
                    //obj.selected = false;
                    let selObj = this.influencer.objectiveDetails.filter(o => o.id == obj.id);
                    console.log("this influencer", selObj)
                    
                    if (selObj.length != 0)
                        this.selected_Values.push(selObj[0].id);
                        //obj.selected = true;
                    else
                        obj.selected = false;
                });
    
    
                //if(!this.influencer) return;
                // console.log(this.influencer.influencerObjectiveIds);
            });


              //check if a user is logged in


    
        }
        pop() {
            this._navCtrl.pop();
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

    onSocialNameFocusIn() {
        this.isSocialNameError = false;
    }
    onSocialNameFocusOut() {
        if (!this.userInfoForm.controls.socialName.valid) {
            this.isSocialNameError = true;
        }
    }

isAboutError : boolean;
    onAboutFocusIn() {
    this.isAboutError = false;
  }

  onAboutFocusOut() {
    this.isAboutError = true;
  }

isContactError: boolean;

  onContactFocusIn() {
      this.isContactError = false;
  }
  onContactFocusOut() {
      this.isContactError = true;
  }

  isCityModalOpen = false;
  onCityFocus() {
    if (this.influencer.profile.state) {
        let autocomplete = this.modalCtrl.create(CityAutoCompletePage);
        this._countryId.set(this.influencer.profile.state.id);
        if (!this.isCityModalOpen) {
            autocomplete.present();
            this.isCityModalOpen = true;
        }
  
        autocomplete.onDidDismiss(data=>{
          if(data) {
              this.influencer.profile.city.name = data.country;
              this.influencer.profile.city.id = data.countryId;
  
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
            if (this.influencer.profile.state != data.country) {
                this.influencer.profile.state.name = data.country;
                this.influencer.profile.state.id = data.countryId;
                this.influencer.profile.city.name = null;
                this.influencer.profile.city.id = null;
            }


            

        }
        this.isStateModalOpen = false;    
    });
  }
  onZipCodeFocus() {

  }

    onZipCodeFocusOut() {
    
            this._countryService.getZipCodes(this.influencer.profile.country.id, this.influencer.profile.zipCode).subscribe(
                (res) => {
                    console.log(res);
                    this.influencer.profile.state.name = res.json().genericResponse.genericBody.data.state.name;
                    this.influencer.profile.state.id= res.json().genericResponse.genericBody.data.state.id;
                    //console.log("state:", this.brand.state);
    
                    this.influencer.profile.city.name = res.json().genericResponse.genericBody.data.city.name;
                    this.influencer.profile.city.id = res.json().genericResponse.genericBody.data.city.id;
                    //console.log("city:", this.brand.city);
    
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
                this.influencer.profile.country.name = data.country;
                this.influencer.profile.country.id = data.countryId;
                this.countryId = data.countryId ;
                this.influencer.profile.state.id = null;
                this.influencer.profile.state.name= null;
                this.influencer.profile.city.id = null;
                this.influencer.profile.city.name = null; 
              }
              

          let country = this.countries.filter(c => c.name == this.influencer.profile.country.name);
        //   if (country.length === 0) {
        //     if (this.oldCountry && this.oldCountry != '')
        //         //this.brand.country = this.oldCountry;
        //         //else
        //         this.isCountryValid = false;
        //     return;
        //   }
    
          this.isCountryValid = true;
          this.zipCodeCanada = false;
          this.zipCodeUS = false;
         this.influencer.profile.country.id= country[0].id;
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
            newcountry.id = this.influencer.profile.country.id;
            newcountry.name = this.influencer.profile.country.name;
            this.onCountryChanged.emit(newcountry);

        }
      })
  }




  // isCityModalOpen = false;
  // onCityFocus() {
  //   if (this.brand.state) {
  //       let autocomplete = this.modalCtrl.create(CityAutoCompletePage);
  //       this._countryId.set(this.brand.stateId);
  //       if (!this.isCityModalOpen) {
  //           autocomplete.present();
  //           this.isCityModalOpen = true;
  //       }
  
  //       autocomplete.onDidDismiss(data=>{
  //         if(data) {
  //             this.brand.city = data.country;
  //             this.brand.cityId = data.countryId;
  
  //         }
  //         this.isCityModalOpen = false;    
  //     });
  //   }
  // }

  // isStateModalOpen = false;
  // onStateFocus() {
  //     let autocomplete = this.modalCtrl.create(StateAutoCompletePage);
  //     this._countryId.set(this.countryId);
  //     if (!this.isStateModalOpen) {
  //         autocomplete.present();
  //         this.isStateModalOpen = true;
  //     }

  //     autocomplete.onDidDismiss(data=>{
  //       if(data) {
  //           if (this.brand.state != data.country) {
  //               this.brand.state = data.country;
  //               this.brand.stateId = data.countryId;
  //               this.brand.city = null;
  //               this.brand.cityId = null;
  //           }


            

  //       }
  //       this.isStateModalOpen = false;    
  //   });
  // }
  // onZipCodeFocus() {

  // }

  //   onZipCodeFocusOut() {
    
  //           this._countryService.getZipCodes(this.brand.countryId, this.brand.zipCode).subscribe(
  //               (res) => {
  //                   console.log(res);
  //                   this.brand.state = res.json().genericResponse.genericBody.data.state.name;
  //                   this.brand.stateId = res.json().genericResponse.genericBody.data.state.id;
  //                   console.log("state:", this.brand.state);
    
  //                   this.brand.city = res.json().genericResponse.genericBody.data.city.name;
  //                   this.brand.cityId = res.json().genericResponse.genericBody.data.city.id;
  //                   console.log("city:", this.brand.city);
    
  //               },
  //               (err) => {
  //                   console.log(err);
  //               }
  //           );
  //       }
    

  // onStateFocusOut() {

  // }
  
  // isCountryModalOpen = false;


  // onCountryFocus() {
  //     this.isCountryValid = true;
  //     this.oldCountry = this.brand.country;
  //     this.brand.stateId = null;
  //     this.brand.cityId = null;
  //     this.cities = null;

  //     let autocomplete = this.modalCtrl.create(CountryAutoCompletePage);
  //     if (!this.isCountryModalOpen) {
  //         autocomplete.present();
  //         this.isCountryModalOpen = true;
  //     }
      
  //     autocomplete.onDidDismiss(data=>{ //This is a listener which wil get the data passed from modal when the modal's view controller is dismissed
  //         console.log("Data",data)
  //         this.isCountryModalOpen = false;
          
  //         if (data.country) {

  //             if (this.countryId!= data.countryId) {
  //               this.brand.country = data.country;
  //               this.brand.countryId = data.countryId;
  //               this.countryId = data.countryId ;
  //               this.brand.stateId = null;
  //               this.brand.state= null;
  //               this.brand.city = null;
  //               this.brand.cityId = null; 
  //             }
              

  //         let country = this.countries.filter(c => c.name == this.brand.country);
  //         if (country.length === 0) {
  //           if (this.oldCountry && this.oldCountry != '')
  //               //this.brand.country = this.oldCountry;
  //               //else
  //               this.isCountryValid = false;
  //           return;
  //         }
    
  //         this.isCountryValid = true;
  //         this.zipCodeCanada = false;
  //         this.zipCodeUS = false;
  //         this.brand.countryId = country[0].id;
  //         this.oldCountry = this.brand.country;
  //         this.countryName = country[0].name.toLowerCase();
    
  //         if (this.countryName === 'canada') {
  //           this.zipCodeCanada = true;
  //       } else
  //           if (this.countryName === 'united states') {
  //               this.zipCodeUS = true;
  //           }
    
        
  //           // if (this.isCountryValid) {
  //           //     this.brand.state = null;
  //           //     this.brand.city = null;
  //           //     this.states = [];
  //           //     this._stateService.getStates(this.brand.countryId).subscribe(
  //           //         (res) => {
  //           //             this.states = res.json().genericResponse.genericBody.data.states;
  //           //             this.filterStates('');
  //           //             console.log(this.brand.countryId);
    
  //           //         },
  //           //         (err) => {
  //           //             console.log(err);
  //           //         }
  //           //     );
  //           // }
    
  //           let newcountry = new CountryInfo();
  //           newcountry.id = this.brand.countryId;
  //           newcountry.name = this.brand.country;
  //           this.onCountryChanged.emit(newcountry);

  //       }
  //     })
  // }



  onCountryFocusOut() {
        if (!this.countries) return;
        let country = this.countries.filter(c => c.name == this.influencer.profile.country.name);
        if (country.length === 0) {
            this.isCountryValid = false;
            return;
        }
        this.isCountryValid = true;
        this.zipCodeCanada = false;
        this.zipCodeUS = false;
        this.influencer.profile.country.id = country[0].id;
        this.countryName = country[0].name.toLowerCase();

        if (this.countryName === 'canada') {
            this.zipCodeCanada = true;
        } else
            if (this.countryName === 'united states') {
                this.zipCodeUS = true;
            }

        if (this.isCountryValid) {
            this.getStates(this.influencer.profile.country.id);
        }

  }

  getStates(countryId) {
    this._stateService.getStates(countryId).subscribe(
        (res) => {
            this.states = res.json().genericResponse.genericBody.data.states;
            this.filterStates('');
        },
        (err) => {
            console.log(err);
        }
    );
  }
  onChangeObjective(obj) {
    console.log("obj",obj);
    obj.selected = !obj.selected;
}

  onSubmit() {
        console.log("in submit")
            if (!this.influencer.profile.country.name || this.influencer.profile.country.name === '')
                this.influencer.profile.country.id = 0;
    
            if (!this.influencer.profile.state.name || this.influencer.profile.state.name === '')
                this.influencer.profile.state.id = 0;
    
            if (!this.influencer.profile.city.name || this.influencer.profile.city.name === '')
                this.influencer.profile.city.id = 0;
    
            // this.influencer.objectiveDetails = this.allObjectives.filter(obj => obj.selected);
            // if (this.influencer.objectiveDetails.length == 0) {
            //     this.objErr = true;
            //     return;
            // }
            // console.log("Objective Details", this.influencer.objectiveDetails);
            this.objErr = false;
            // this.genderErr = false;
            this.onSubmitStart();
            this.isSubmitStarted = true;
            console.log("user:", this.user);
            console.log("influencer", this.influencer);
    
            this._influencerService.updatePersonalInfo(this.user, this.influencer, this.selected_Values).subscribe(
                (res) => {
                    this.onSubmitFinished(null);
                    this.isSubmitStarted = false;
                    console.log(res);
                    let msg = new Message();
                    msg.msg = "Your personal information has saved successfully.";
                    msg.msgType = MessageTypes.Information;
                    msg.autoCloseAfter = 400;
                    this._uiService.presentToast(msg.msg);
                    this._influencerSharedData.setInfluencer(this.influencer);
                    this._authService.storeUser(this.user);
    
                },
                (err) => {
                    console.log(err);
                    this.isSubmitStarted = false;
                    this.onSubmitFinished(err);
                    let msg = new Message();
                    msg.msg = "Sorry, an error has occured";
                    msg.msgType = MessageTypes.Error;
                    msg.autoCloseAfter = 400;
                    this._uiService.presentToast(msg.msg);
                }
            )
    
    
    
        }

        onSubmitStart() {
            this.isSubmitted = true;
        }
    
        onSubmitFinished(error: any) {
            this.isSubmitted = false;
            console.log(error);
        }

}