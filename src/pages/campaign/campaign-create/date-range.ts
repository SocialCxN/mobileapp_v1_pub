import { Component , Input} from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { User } from "../../../models/user";
import { DatePicker } from '@ionic-native/date-picker';
import { DatePipe } from '@angular/common'
@Component({
  selector: 'date-range',
  templateUrl: 'date-range.html'
})
export class DateRangeModal {


  user: User = new User();
  searchTerm: string = '';

  @Input() public options: any;
  constructor(public viewCtrl: ViewController,private datePicker: DatePicker,public datepipe: DatePipe) {
        
  }


  startDate : any;
  startDatePicker() {
    this.datePicker.show({
        date: new Date(),
        mode: 'date',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      }).then(
        date => {
            console.log('Got date: ', date)
            let latest_date =this.datepipe.transform(date, 'MM/dd/yyyy');
            this.startDate = latest_date;
        },
        err => console.log('Error occurred while getting date: ', err)
      );
  }

  endDate: any;
  endDatePicker() {
    this.datePicker.show({
        date: new Date(),
        mode: 'date',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      }).then(
        date => {
            console.log('Got date: ', date)
            let latest_date =this.datepipe.transform(date, 'MM/dd/yyyy');
            this.endDate = latest_date;
        },
        err => console.log('Error occurred while getting date: ', err)
      );
  }

   closeModal() {
   		this.viewCtrl.dismiss({
               'startDate': this.startDate,
               'endDate' : this.endDate
           });
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
