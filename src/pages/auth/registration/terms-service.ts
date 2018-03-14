import { Component , Input} from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { CompleteTestService } from "../../../providers/country/country.provider";
import { SplashScreen } from '@ionic-native/splash-screen';
import { User } from "../../../models/user";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: 'terms-service',
  templateUrl: 'terms-service.html'
})
export class TermServicePage {


  user: User = new User();
  termsServicForm: FormGroup;
  isAgreed = false;
  @Input() public options: any;
  constructor(public viewCtrl: ViewController, private formBuilder: FormBuilder, public completeTestService: CompleteTestService) {
    this.termsServicForm = formBuilder.group({
            isAgreed: []
        })
        
  }

   closeModal() {
   		this.viewCtrl.dismiss(this.isAgreed);
   }

  ionViewDidEnter() {
 
    // this.splashScreen.hide();
 
    // setTimeout(() => {
    //   this.viewCtrl.dismiss();
    // }, 4000);
 
  }

}
