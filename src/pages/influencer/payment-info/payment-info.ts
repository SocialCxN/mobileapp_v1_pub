import { Component, Input, OnInit, Inject, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { NavController , NavParams, ModalController } from 'ionic-angular';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { UIService } from "../../../providers/ui/ui.service";
import { Message, MessageTypes } from "../../../models/message";
import { User } from "../../../models/user";
import { PaymentGatewayService } from "../../../providers/payment/payment-gateway.service";
import { AuthProvider } from "../../../providers/auth/auth";
import { BankDetails } from "../../../models/payment/bank.details";
import { BankDetailsService } from "../../../providers/payment/bank-details.service";
import { CountryInfo } from "../../../models/location/country.info";
import { PaymentDetail } from "../../../models/payment/payment.detail";
import { PaymentGatewayDetails } from "../../../models/payment/payment.gateway.details";
import { AvailablePaymentGateway } from "../../../models/payment/available.payment.gateway";
import { InfluencerService } from "../../../providers/influencer/influencer.service";
import { InfluencerSharedData } from "../../../shared/influencer.profile"
import { LoaderComponent} from '../../../shared/loader/loader';
import { Influencer } from "../../../models/influencer/influencer";
import { environment } from "../../../environments/environment";
import { InAppBrowser } from '@ionic-native/in-app-browser';
@Component({
    selector: 'page-payment-info',
    templateUrl: 'payment-info.html'
  })

export class PaymentInfoInfluencerPage implements OnInit, OnChanges {
  @Input() entityId : number;
  @Input() country = new CountryInfo();
  @Input() paymentDetails : PaymentDetail = new PaymentDetail();
  easypay = new PaymentGatewayDetails();
  paypal = new PaymentGatewayDetails();
  stripe = new PaymentGatewayDetails();
  user = new User();

  influencer = new Influencer();
  selectedGateway = '';
  availableGateways = new Array<AvailablePaymentGateway>();
  connectStripeUrl: string;
  /* Status Fields */
  isBankInfoSubmitted = false;
  isPaymentInfoSubmitted = false;

  /* Private Fields */
  private _oldCountryId = 0;
  bankForm: FormGroup;

  selectedPayment = 'Bank';


  countryPk =false;
  bankForm3: FormGroup;

  constructor(private _authService: AuthProvider, private _navCtrl: NavController,
    public formBuilder: FormBuilder,
    private _influencerService: InfluencerService,
    private _uiService: UIService,private iab: InAppBrowser,
    public navCtrl: NavController, public loader: LoaderComponent,
     private modalCtrl: ModalController,
     private _influencerSharedData: InfluencerSharedData,
    private _bankDetailsService : BankDetailsService,
  private _paymentGatewayService :PaymentGatewayService) {

    
    this.bankForm = formBuilder.group({
      routingNumber: ['', Validators.compose([Validators.pattern("[0-9]{1,9}"), Validators.required])],
      bankName: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z .-]{3,50}")])],
      accountTitle: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      accountNumber : ['', Validators.compose([Validators.required, Validators.pattern("[0-9]*"), Validators.maxLength(25)])],
      IBAN:  ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){7,16}")])], 
      NTN:   ['', Validators.compose([Validators.required, Validators.pattern("[0-9]{7}[-][0-9]{1}")])], 
    })

    this.bankForm3 = formBuilder.group({
      gateway: '',
      stripeEmail: ['', Validators.compose([ Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), Validators.required])],
      paypalEmail: ['', Validators.compose([ Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), Validators.required])],
      easypayEmail: ['', Validators.compose([ Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), Validators.required])],
      registeredContactNumber: ['', Validators.compose([Validators.maxLength(20), Validators.minLength(6),  Validators.pattern("[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*")])]
    })


     }
    /* Initialize Values */
    ngOnInit(): void {

      this._authService.getUser().then((res)=>{
        this.user = res;  
      });

      this.influencer = this._influencerSharedData.getInfluencer();
      this.paymentDetails =this.influencer.paymentDetails;
      this.country = this.influencer.profile.country;
console.log("this country", this.country);
      if (this.country.id == 166) {
        this.countryPk = true;
      }

      if (this.influencer.paymentDetails.paymentGatewayInfo.stripe != undefined){
        this.stripe = this.influencer.paymentDetails.paymentGatewayInfo.stripe;
      }

      if (this.influencer.paymentDetails.paymentGatewayInfo.paypal != undefined){
        this.paypal = this.influencer.paymentDetails.paymentGatewayInfo.paypal;
      }

      if (this.influencer.paymentDetails.paymentGatewayInfo.easypay != undefined){
        this.easypay = this.influencer.paymentDetails.paymentGatewayInfo.easypay;
      }

      this.loadAvailablePaymentGateways();
      this._authService.getUser().then((res) =>{
        this.user =res;
          //stripe connect payment url 
          let parameters = {
            client_id: environment.stripe.client_id,
            state: Math.random().toString(36).slice(2),
            'stripe_user[business_type]': 'individual',
            'stripe_user[first_name]': this.user.firstName,
            'stripe_user[last_name]': this.user.lastName,
            'stripe_user[email]': this.user.loginEmail,
            'stripe_user[business_name]': 'individual'
        }
  
        //generate dynamic account url based on user
        let url = environment.stripe.authorizeUri + '?' + this.encodeQueryData(parameters)
        this.connectStripeUrl = url;
      })

 }

 encodeQueryData(data) {
  let ret = [];
  for (let d in data) {


      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));

      console.log('dddd', d);
  }
  return ret.join('&');
}
stripeKey: string;
openConnectStripe() {
  console.log("connect stripe url", this.connectStripeUrl)
  //var browserRef = (<any>window).cordova.InAppBrowser.open(this.connectStripeUrl, '_blank', 'location=no');
  //console.log("(<any>window).cordova.InAppBrowser",(<any>window).cordova.InAppBrowser)
  let that = this;
  console.log("thiss is", this)
  const browser = this.iab.create(this.connectStripeUrl, '_blank', 'location=no');
  browser.on('loadstart').subscribe((event)=>{
    try {
      console.log("url is",event.url);
      if (event.url.includes('code')) {
        let keys = event.url.split('=');
        let key2 = keys[1].split('&');
        that.stripeKey = key2[0];
        that.stripe.accountId = that.stripeKey;
        that.selectedGateway = 'stripe';
        console.log("key is",that.stripeKey);
        that.saveStripeInfo();
        browser.close();
    }
    }
    catch(err) {
      console.log("Err is ",err);
      alert("This error is shown for testing purpose only. Error is"+ err + "\t " + event.url);
    }
  })

  // browserRef.addEventListener('loadstart', function(event) {


  // });
}

getParameterByName(name, url) {
  console.log("in get qyert params");
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


 /* Any of the input fields has been changed */
 ngOnChanges(changes: SimpleChanges): void {

     this.loadAvailablePaymentGateways();

     if(!this.paymentDetails) return;

     if(this.paymentDetails.paymentGatewayInfo && this.paymentDetails.paymentGatewayInfo.easypay){
         this.easypay = this.paymentDetails.paymentGatewayInfo.easypay;
         this.selectedGateway = 'easypay';
     }
     else if(!this.easypay) this.easypay = new PaymentGatewayDetails();

     if(this.paymentDetails.paymentGatewayInfo && this.paymentDetails.paymentGatewayInfo.paypal){
         this.paypal = this.paymentDetails.paymentGatewayInfo.paypal;
         this.selectedGateway = 'paypal';
     }
     else if(!this.paypal) this.paypal = new PaymentGatewayDetails();

     if(this.paymentDetails.paymentGatewayInfo && this.paymentDetails.paymentGatewayInfo.stripe){
         this.stripe = this.paymentDetails.paymentGatewayInfo.stripe;
         this.selectedGateway = 'stripe';
     }
     else if(!this.stripe) this.stripe = new PaymentGatewayDetails();  
 }

 isNTNError = false;
 onNTNFocusIn() {
  this.isNTNError = false;
}
onNTNFocusOut() {
  if(!this.bankForm.controls.NTN.valid) {
    this.isNTNError = true;
  }
}

isIBANError = false;
onIBANFocusIn() {
  this.isIBANError = false;
}

onIBANFocusOut() {
  if (!this.bankForm.controls.IBAN.valid) {
    this.isIBANError = true;
  }
}

isAccountNumberError = false;
onAccountNumberFocusIn() {
  this.isAccountNumberError = false;
}

onAccountNumberFocusOut() {
  if(!this.bankForm.controls.accountNumber.valid) {
    console.log("in if");
    this.isAccountNumberError = true;
  }
}

isAccountTitleError = false; 
onAccountTitleFocusIn() {
  this.isAccountTitleError = false;
}

onAccountTitleFocusOut() {
  if (!this.bankForm.controls.accountTitle.valid) {
    this.isAccountTitleError = true;
  }
}

isBankNameError = false;
onBankNameFocusIn() {
  this.isBankNameError =false;
}

onBankNameFocusOut() {
  if (!this.bankForm.controls.bankName.valid) {
    this.isBankNameError = true;
  }
}

isRoutingNumberError =false;
onRoutingNumberFocusIn() {
  this.isRoutingNumberError = false;
}

onRoutingNumberFocusOut() {
  
        this._bankDetailsService.getDetailsViaRouting(this.paymentDetails.bankInfo.routingNumber).subscribe(
            (res) => {
                console.log(res);
                this.paymentDetails.bankInfo.bankName = res.json().genericResponse.genericBody.data.bankdetails.bankName;
                console.log("bank:", this.paymentDetails.bankInfo.bankName);
            },
            (err) => {
                console.log(err);
            }
        );
    }


     /* Payment Gatway has been changed */
     onPaymentGatewaySelected(event){
      //console.log(event.value);
      //this.selectedGateway = event.value.toLowerCase();
      //this.selectedGateway = this.selectedGateway.toLowerCase();
  }

  /* Load available payment gateways according to selected profile country */
  loadAvailablePaymentGateways() {
      //this.loader.show("please wait");
      if(this.country && this.country.id){
          this._oldCountryId = this.country.id;
          this._paymentGatewayService.getPaymentGateways(this.country.id).subscribe(
              (res) => {
                this.loader.hide();
                  this.availableGateways = res.json().genericResponse.genericBody.data.paymentGatewayList;
                  console.log("Available Gateways", res); 
                  if(!this.availableGateways || this.availableGateways.length == 0) {
                      this.selectedGateway = ''; 
                      return;
                  }
                  if(this.selectedGateway && this.selectedGateway !== ''){
                      let findGateway = this.availableGateways.filter( g => g.displayName.toLowerCase() === this.selectedGateway);
                      if(findGateway.length == 0)
                          this.selectedGateway = this.availableGateways[0].displayName.toLowerCase();
                  }
                  else this.selectedGateway = this.availableGateways[0].displayName.toLowerCase();
              },
              (err) => {
                this.loader.hide();
                  console.log(err);
              }
          );
      }
  }

  /* Save bank information */
  saveBankInfo() {

      this.isBankInfoSubmitted = true;
      this.entityId = this.user.entityId;

      this._influencerService.saveBankInfo(this.entityId, this.country.id, this.paymentDetails.bankInfo).subscribe(
          (res) => {
              this.isBankInfoSubmitted = false;
              this.paymentDetails.bankInfo.id = res.json().genericResponse.genericBody.data.id;
              let msg = new Message();
              msg.msg = "Your bank information has been updated successfully.";
              msg.msgType = MessageTypes.Information;
              msg.autoCloseAfter = 400;
              this.influencer.paymentDetails.bankInfo = this.paymentDetails.bankInfo;
              this._influencerSharedData.setInfluencer(this.influencer);
              this._uiService.presentToast(msg.msg);
          },
          (err) => {
              this.isBankInfoSubmitted = false;
              let msg = new Message();
              msg.msg = "Sorry, an error has occured";
              msg.msgType = MessageTypes.Error;
              msg.autoCloseAfter = 400;
              this._uiService.presentToast(msg.msg);
              console.log(err);
          }
      )
  }

  pop() {
    this._navCtrl.pop();
}

  /* Save payment gateway informaiton */
  savePaymentGatewayInfo() {

      this.isPaymentInfoSubmitted = true;
      this.entityId = this.user.entityId;
      let selectedGateway = this.availableGateways.filter(g => g.displayName.toLowerCase() === this.selectedGateway);

      if(selectedGateway.length == 0){
          //ToDo: Show an error
          return;
      }

      let gatwayId = selectedGateway[0].id;

      let gatewayDetails : PaymentGatewayDetails;

      if(this.selectedGateway === 'paypal'){
          gatewayDetails = this.paypal;
          this.influencer.paymentDetails.paymentGatewayInfo.paypal =this.paypal;
      }
      else if(this.selectedGateway === 'easypay'){
          gatewayDetails = this.easypay;
          this.influencer.paymentDetails.paymentGatewayInfo.easypay =this.easypay;
      }
      else if (this.selectedGateway === 'stripe'){
          gatewayDetails = this.stripe;
          this.influencer.paymentDetails.paymentGatewayInfo.stripe =this.stripe;
      }

      this._influencerService.savePaymentGatewayInfo(this.entityId, gatwayId, this.country.id, gatewayDetails).subscribe(
          (res) => {
              this.isPaymentInfoSubmitted = false;
              gatewayDetails.id = res.json().genericResponse.genericBody.data.id;
              let msg = new Message();
              msg.msg = "Your payment information has been updated successfully.";
              msg.msgType = MessageTypes.Information;
              msg.autoCloseAfter = 400;
              
              this._influencerSharedData.setInfluencer(this.influencer);
              this._uiService.presentToast(msg.msg);
          },
          (err) => {
              this.isPaymentInfoSubmitted = false;
              let msg = new Message();
              msg.msg = "Sorry, an error has occured";
              msg.msgType = MessageTypes.Error;
              msg.autoCloseAfter = 400;
              this._uiService.presentToast(msg.msg);
              console.log(err);
          }
      )
  }

  isNumberError = false;
  onNumberFocus() {
    this.isNumberError = false;
}

onNumberFocusOut() {
  if (!this.bankForm3.controls.registeredContactNumber.valid) {
    this.isNumberError = true;
  }
}

isEmailError = false;
onEmailFocus() {
  this.isEmailError = false;
}
 
onEmailFocusOut() {
  if (!this.bankForm3.controls.stripeEmail.valid) {
    this.isEmailError = true;
  }

  if (!this.bankForm3.controls.paypalEmail.valid) {
    this.isEmailError = true;
  }

  if (!this.bankForm3.controls.easypayEmail.valid) {
    this.isEmailError = true;
  }
}


saveStripeInfo() {

  let selectedGateway = this.availableGateways.filter(g => g.displayName.toLowerCase() === 'stripe');
  console.log('data--------', selectedGateway);

  console.log("key is in save function",this.stripeKey);
  let gatwayId = selectedGateway[0].id;
  this.entityId = this.user.entityId;
  let gatewayDetails: PaymentGatewayDetails;
      gatewayDetails = this.stripe;
      console.log('stripe testing........');
  this._influencerService.savePaymentGatewayInfo(this.entityId, gatwayId, this.country.id, this.stripe).subscribe(
      (res) => {
          this.isPaymentInfoSubmitted = false;
          this.paymentDetails.paymentGatewayInfo.id = res.json().genericResponse.genericBody.data.id;

          // gatewayDetails.id = res.json().genericResponse.genericBody.data.id;
          let msg = new Message();
          msg.msg = "Your payment information has been updated successfully.";
          msg.msgType = MessageTypes.Information;
          msg.autoCloseAfter = 400;
          this._uiService.presentToast(msg.msg);
      },
      (err) => {
          this.isPaymentInfoSubmitted = false;
          let msg = new Message();
          msg.msg = "Sorry, an error has occured";
          if (err.message) {
              msg.msg = err.message;
          }
          msg.msgType = MessageTypes.Error;
          msg.autoCloseAfter = 400;
          this._uiService.presentToast(msg.msg);
          console.log(err);
      }
  )
}


}