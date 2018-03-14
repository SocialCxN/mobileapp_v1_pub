import { Component, Input , Output, EventEmitter, OnInit } from '@angular/core';
import { NavController , NavParams } from 'ionic-angular';
import { AuthProvider } from "../../../providers/auth/auth";
import { MainPage } from '../../auth/main/main';
import { LoaderComponent} from '../../../shared/loader/loader';

import { BrandService } from "../../../providers/brand/brand";
import { BrandProfile} from "../../../models/brand.profile";
import { Country } from "../../../models/country";
import { CountryInfo } from "../../../models/location/country.info";

@Component({
    selector: 'profile-summary',
    templateUrl: 'profile-summary.html'
  })
export class ProfileSummaryPage {
    role: string;

    @Input()
    brand: BrandProfile = new BrandProfile();
    coverPic: any;
    profilePic: any;
    country: CountryInfo;
    constructor(private _authService: AuthProvider, public _brandService: BrandService,public navParams:  NavParams, public navCtrl: NavController, public loader: LoaderComponent) {
        this._authService.getUser().then((res) =>
        {
          this.role = res.entityType;
        })

        this.loader.show("Please wait");
        this._brandService.getBrandProfile().subscribe(
            (res) => {
              this.loader.hide();
                let brandInfo = res.json().genericResponse.genericBody.data.brand;
                console.log("brandInfo",brandInfo);
                
                let newBrand = new BrandProfile();
    
                newBrand.id = brandInfo.profile.id;

                this.coverPic = brandInfo.profile.coverPic.thumbnails.small;
                this.profilePic = brandInfo.profile.profilePic.thumbnails.small;
                newBrand.about = brandInfo.profile.entityDescription;
                newBrand.brandName = brandInfo.profile.name;
                //this.brandName = brandInfo.profile.name;
                newBrand.city = brandInfo.profile.city.name;
                newBrand.cityId = brandInfo.profile.city.id;
                newBrand.contactNumber = brandInfo.profile.contactNumber;
                newBrand.country = brandInfo.profile.country.name;
                newBrand.countryId = brandInfo.profile.country.id;
               // this.countryId = brandInfo.profile.country.id;
    
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
    }
  
    // logout() {
    //   this.loader.show("Logging out.. Please wait");
    //   this._authService.logoutUser().then((res)=> {
    //     setTimeout(()=> {
    //       this.loader.hide();
    //       this.navCtrl.setRoot(MainPage)
    //     },2000);
    //   });
      
    // }

    pop(){
      this.navCtrl.pop();
    }
}