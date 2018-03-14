import { Component , Input} from '@angular/core';
import { NavController , NavParams} from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { User } from "../../../models/user";
import { UTM } from "../../../models/utm";
@Component({
  selector: 'utm-modal',
  templateUrl: 'utm.modal.html'
})
export class UtmModal {


  user: User = new User();
  searchTerm: string = '';

  campaignDetails: any;
  reportDetails: any;
  rating = 0;
  websiteUrl: string;
  url: any;
  utm = new UTM();
  utmUrl: string;
  rejectError: any;

  @Input() public options: any;
  constructor(public viewCtrl: ViewController, private navParams : NavParams) {
        this.url = navParams.get("beforeUrl")
  }

  setUrl() {
    //Set utm url link 
    console.log('test', this.utmUrl);
    if (this.utm && this.url) {
        let encodeUrl = this.encodeQueryData(this.utm)
        this.utmUrl = this.url + "?" + encodeUrl;
    }
}

    /**
       * Genrate a utm link based on user enter fields 
       * @param 
       * @returns {string}
     */
    encodeQueryData(data) {
        let ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');


    }


   closeModal() {
   		this.viewCtrl.dismiss(this.utmUrl);
   }

  ionViewDidEnter() {
 
    // this.splashScreen.hide();
 
    // setTimeout(() => {
    //   this.viewCtrl.dismiss();
    // }, 4000);
 
  }

      ionViewDidLoad() {

    }




}
