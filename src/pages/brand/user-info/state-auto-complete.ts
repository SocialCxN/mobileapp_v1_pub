import { Component , Input, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { CompleteTestService } from "../../../providers/country/country.provider";
import { SplashScreen } from '@ionic-native/splash-screen';
import { User } from "../../../models/user";
import { CountryIdService } from '../../../shared/countryid';
import { CountryService } from "../../../providers/country/country.service"

@Component({
  selector: 'auto-complete',
  templateUrl: 'state-auto-complete.html'
})
export class StateAutoCompletePage  implements OnInit  {


  user: User = new User();
  searchTerm: string = '';
  countryId:string;

  countries = []; 
  countriesInitial = []; 
  @Input() public options: any;

  states = [];

  constructor(public viewCtrl: ViewController, private _countryId: CountryIdService,
    public splashScreen: SplashScreen, private _countryService: CountryService, public completeTestService: CompleteTestService) {
  	console.log(completeTestService.countries)
    this.countries = completeTestService.countries;
    this.options = {
            placeholder : 'State'
        };
        
  }

  ngOnInit() {
    //this._countryId.currentId.subscribe(countryId => this.countryId = countryId);
    console.log("current id", this._countryId.get())
    this._countryService.getStates(this._countryId.get()).subscribe(
        (res) => {
            this.states = res.json().genericResponse.genericBody.data.states;
            this.filterStates('');
        },
        (err) => {  
            console.log(err);
        }
    );

  }

  
  filterStates(val: string) {
    if (val && val != '' && this.states) {
        return this.states.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    else
        return this.states;
    }

  getItems(val: any) {
        this.user.country = val.name;
        this.user.countryId = val.id;
        this.viewCtrl.dismiss(this.user);
    }

   closeModal() {
   		this.viewCtrl.dismiss(this.user);
   }

  ionViewDidEnter() {
 
    // this.splashScreen.hide();
 
    // setTimeout(() => {
    //   this.viewCtrl.dismiss();
    // }, 4000);
 
  }

    ionViewDidLoad() {
 
        this.setFilteredItems();
 
    }

   setFilteredItems() {
 
        this.states = this.getResults(this.searchTerm);
 
    }

    getResults(val:string) {
        if (val && val != '') {
                return this.states.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
            }
            else
                return this.states;
      }

  filterItems(searchTerm){
      return this.states.filter((item) => {
          return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });     
  }


}
