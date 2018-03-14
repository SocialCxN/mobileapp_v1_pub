import { Component , Input} from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { CompleteTestService } from "../../../providers/country/country.provider";
import { SplashScreen } from '@ionic-native/splash-screen';
import { User } from "../../../models/user";

@Component({
  selector: 'auto-complete',
  templateUrl: 'auto-complete.html'
})
export class AutoCompletePage {


  user: User = new User();
  searchTerm: string = '';
  countries = []; 
  countriesInitial = []; 
  @Input() public options: any;
  constructor(public viewCtrl: ViewController, public splashScreen: SplashScreen,  public completeTestService: CompleteTestService) {
  	console.log(completeTestService.countries)
    this.countries = completeTestService.countries;
    this.options = {
            placeholder : 'Country'
        };
        
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
 
        this.countries = this.completeTestService.getResults(this.searchTerm);
 
    }

  filterItems(searchTerm){
      return this.countries.filter((item) => {
          return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });     
  }


}
