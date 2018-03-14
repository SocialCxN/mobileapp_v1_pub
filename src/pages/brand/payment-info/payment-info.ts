import { Component,Input, Output, EventEmitter,OnInit } from '@angular/core';
import { NavController , NavParams } from 'ionic-angular';
import { AuthProvider } from "../../../providers/auth/auth";
import { BankDetails } from "../../../models/payment/bank.details";
import { CountryInfo } from "../../../models/location/country.info";
import { MainPage } from '../../auth/main/main';
import { LoaderComponent} from '../../../shared/loader/loader';
import { BrandService } from "../../../providers/brand/brand";
import { BankDetailsService } from '../../../providers/payment/bank-details.service';
import { PaymentGatewayService} from '../../../providers/payment/payment-gateway.service';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { UIService } from "../../../providers/ui/ui.service";
import { User } from "../../../models/user";
import { AvailableServiceProviders } from "../../../models/payment/available.service.providers";
import { PaymentGateway } from "../../../models/payment/paymentGateway";
import { CountryIdService } from '../../../shared/countryid'
import { Message, MessageTypes } from "../../../models/message";

import { BrandProfile} from "../../../models/brand.profile";
import { CreditCardInfo } from "../../../models/payment/credit.card.info";
import {InfluencerSharedData } from "../../../shared/influencer.profile";
@Component({
    selector: 'payment-info',
    templateUrl: 'payment-info.html'
  })
export class PaymentInfoPage implements OnInit {
    role: string;

    @Input() 
    bank: BankDetails = new BankDetails();
    @Input() country = new CountryInfo();
    @Input() cardInfo = new CreditCardInfo();

    @Input()
    brand: BrandProfile = new BrandProfile();
    @Input()  creditCardInfo = new Array<CreditCardInfo>();

    bankForm: FormGroup;
    
    bankForm2: FormGroup;
    bankForm3: FormGroup;
    isRoutingNumberError = false;
    isBankNameError = false;
    isAccountTitleError = false;
    isAccountNumberError = false;
    isIBANError = false;
    isNTNError = false;
    isEmailError = false;
    isNumberError = false;

    @Input() paytab: string = '';
    @Output() onSubmitStarted = new EventEmitter();
    @Output() onSubmitFinished = new EventEmitter<any>();

    gatewayTableId: any;
    bankTableId: any;
    cardTableId: any;

    user: User = new User();
    isEmailAvailable = true;
    isSubmitStarted = false;
    isSubmitted = false;
    countryPk: boolean = false;
    countryUs: number;
    paymentGateway: FormControl = new FormControl();
    enableCard: boolean = false;

    cardTypes:string;
    selectedProvider = '';
    availableServiceProviders = new Array<AvailableServiceProviders>();
    cardServicePattern: string;
    cardServiceTooltip: string;

    payGates: PaymentGateway[];
    selectPayGateway: string;
    isEasyPay: boolean = false;
    isPaypal: boolean = false;
    isStripe: boolean = false;
    gateway: string;
    filteredGateways: any;

    paymentgateway: string;
    isPaymentValid: boolean;
    payGateId: any;
    cardValue: any;
    blankValue: any;

    selectedPayment = 'Bank';
    

    private _name = '';
    private _email = '';
    private _oldCountryId = 0;

    constructor(private _authService: AuthProvider,
     private _InfluencerSharedData:InfluencerSharedData,public formBuilder: FormBuilder, private _countryId: CountryIdService,
       public navParams:  NavParams, public navCtrl: NavController, public loader: LoaderComponent,
       private _brandService: BrandService,
       private _uiService: UIService,
       private _paymentGatewayService: PaymentGatewayService,
       private _bankDetailsService: BankDetailsService) {
        this._authService.getUser().then((res) =>
        {
          this.role = res.entityType;
        })
       // this.loader.show("Please wait");
        // this._brandService.getBrandProfile().subscribe(
        //   (res) => {
            // this.loader.hide();
              let brandInfo =this._InfluencerSharedData.getInfluencer();
              console.log("brandInfo",brandInfo);
              
              let newBrand = new BrandProfile();

              let paymentInfo = brandInfo.paymentDetails.paymentGatewayInfo;
              console.log("paymentInfo",paymentInfo);
              
              if (paymentInfo && paymentInfo.stripe) {
                  this.bank.paymentName = 'stripe';
                  this.bank.stripeEmail = paymentInfo.stripe.email;
                  this.bank.stripeTableId = paymentInfo.stripe.id;
              }
              if (paymentInfo && paymentInfo.paypal) {
                  this.bank.paymentName = 'paypal';
                  this.bank.paypalEmail = paymentInfo.paypal.email;
                  this.bank.paypalTableId = paymentInfo.paypal.id;
              }
              if (paymentInfo && paymentInfo.easypay) {
                  this.bank.paymentName = 'easypay';
                  this.bank.easypayEmail = paymentInfo.easypay.email;
                  this.bank.registeredContactNumber = paymentInfo.easypay.mobileNumber;
                   this.bank.easypayTableId = paymentInfo.easypay.id;
             }
              console.log("checking...", this.bank);
              
              let bankInfo = brandInfo.paymentDetails;
                              
              if (bankInfo && bankInfo.bankInfo) {
                  
                  this.bank.bankName = bankInfo.bankInfo.bankName;
                  this.bank.ibanNumber = bankInfo.bankInfo.ibanNumber;
                  this.bank.routingNumber = bankInfo.bankInfo.routingNumber;
                  this.bank.ntnNumber = bankInfo.bankInfo.ntnNumber;
                  this.bank.accountNumber = bankInfo.bankInfo.accountNumber;
                  this.bank.accountTitle = bankInfo.bankInfo.accountTitle;
                  this.bank.bankTableId = bankInfo.bankInfo.id;
                  

                  // this.bank.creditCardNumber = bankInfo.creditCardInfo.creditcardNumber;
                  // this.bank.cvcValue = bankInfo.creditCardInfo.cvcValue;
                  // this.bank.expiryDate = bankInfo.creditCardInfo.expiryDate;
                 // this.bank.creditCardTableId = bankInfo.creditCardInfo.id;
              }

            

              if (bankInfo && bankInfo.creditCardInfo) {
                  this.creditCardInfo = bankInfo.creditCardInfo;
                  // this.creditCardInfo.creditCardTableId = bankInfo.creditCardInfo.id;
                  // console.log("checking",this.creditCardInfo);
              }

              this.country = new CountryInfo();
              this.country.id = newBrand.countryId;
              this.country.name = newBrand.country;

              this.brand = newBrand;
          // },
          // (err) => {
          //     this.loader.hide();
          //     console.log(err);
          // }
      

        this.bankForm = formBuilder.group({
          routingNumber: ['', Validators.compose([Validators.pattern("[0-9]{1,9}"), Validators.required])],
          bankName: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z .-]{3,50}")])],
          accountTitle: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
          accountNumber : ['', Validators.compose([Validators.required, Validators.pattern("[0-9]*"), Validators.maxLength(25)])],
          IBAN:  ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){7,16}")])], 
          NTN:   ['', Validators.compose([Validators.required, Validators.pattern("[0-9]{7}[-][0-9]{1}")])], 
        })

        this.bankForm2 = formBuilder.group({
          provider: '',
          creditCardNumber:  ['', Validators.compose([ Validators.required, Validators.maxLength(16), Validators.pattern("^[0-9]{16}$") ])],
          cvcValue:  ['', Validators.compose([ Validators.required, Validators.pattern("^[0-9]{3,4}$") ])],
          month: ['', Validators.compose([ Validators.required, Validators.pattern("0[1-9]|1[0-2]") ])],
          year: ['', Validators.compose([ Validators.required, Validators.pattern("201[7-9]|20[2-3][0-9]") ])],
        })

        this.bankForm3 = formBuilder.group({
          gateway: '',
          stripeEmail: ['', Validators.compose([ Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), Validators.required])],
          paypalEmail: ['', Validators.compose([ Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), Validators.required])],
          easypayEmail: ['', Validators.compose([ Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), Validators.required])],
          registeredContactNumber: ['', Validators.compose([Validators.maxLength(20), Validators.minLength(6),  Validators.pattern("[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*")])]
        })
    }


    
    ngOnInit(): void {
      this._authService.getUser().then((res)=> {
        this.user = res;
      });

      if (this.bank && this.bank.creditCardNumber) {
        // this.bank.cardOne = this.bank.creditCardNumber.slice(0, 4);
        // this.bank.cardTwo = "****";
        // this.bank.cardThree = "****";
        // this.bank.cardFour = this.bank.creditCardNumber.slice(12, 16);
        //this.bank.month = this.bank.expiryDate.slice(0,2);
        let spt = this.bank.expiryDate.split('-');

        if (spt[1].length < 2)
            this.bank.month = '0' + spt[1];
        else
            this.bank.month = spt[1];

        this.bank.year = spt[0];
    }

    if (!this.country) return;

    this.countryPk = false; 
   // console.log(this.country.name.toLowerCase());
    if (this.country.id == this._oldCountryId) return;
    this._oldCountryId = this.country.id;

    // if (this.country.name.toLowerCase() === 'pakistan') {
    //     console.log("on change", this.country);
    //     this.countryPk = true;
    // }
          
    //Service Provider
    this.loadServiceProviders();
    this.country.id = this._countryId.get();

    console.log("countryid", this.country.id);
    if (this.country.id == 166) {
      this.countryPk = true;
    }
    //Payment Gateways
    this._paymentGatewayService.getPaymentGateways(this._countryId.get()).subscribe(
        (res) => {
          this.payGates = res.json().genericResponse.genericBody.data.paymentGatewayList;
          console.log("payGates", this.payGates);
          //this.bank.stripeEmail || this.bank.paypalEmail || this.bank.easypayEmail ? this.onPaymentGatewaySelected(this.payGates[0].displayName) : this.onPaymentGatewaySelected(null);
          this._oldCountryId = this.country.id;
          this.bank.paymentName = this.payGates[0].displayName;

          if (this.bank.paymentName === 'Easypay') {
              this.isEasyPay = true;
              this.isPaypal = false;
              this.isStripe = false;
              // this.bank.easypayEmail
          }
          if (this.bank.paymentName === 'Stripe') {
              this.isEasyPay = false;
              this.isPaypal = false;
              this.isStripe = true;
              console.log(this.bank.stripeEmail);
              
          }
          if (this.bank.paymentName === 'Paypal') {
              this.isEasyPay = false;
              this.isPaypal = true;
              this.isStripe = false;
          }
      },
      (err) => {
          console.log(err);
      }
    );


      // if (this.bank.easypayEmail) {
      //     this.isEasyPay = true;
      //     this.isPaypal = false;
      //     this.isStripe = false;
      // }
      // if (this.bank.stripeEmail) {
      //     this.isEasyPay = false;
      //     this.isPaypal = false;
      //     this.isStripe = true;
      // }
      // if (this.bank.paypalEmail) {
      //     this.isEasyPay = false;
      //     this.isPaypal = true;
      //     this.isStripe = false;
      // }
    }
    pop(){
      this.navCtrl.pop();
    }

    isCvcError = false;
    onCvcFocus() {
      this.isCvcError = false;
    }

    onCvcFocusOut() {
      if (!this.bankForm2.controls.cvcValue.valid) {
        this.isCvcError = true;
      }
    }

    isExpiryMonthError = false;
    onExpiryMonthFocus() {
      this.isExpiryMonthError = false;
    }

    onExpiryMonthFocusOut() {
      if (!this.bankForm2.controls.month.valid) {
        this.isExpiryMonthError = true;
      }
    }

    isExpiryYearError = false;
    onExpiryYearFocus() {
      this.isExpiryYearError = false;
    }

    onExpiryYearFocusOut() {
      if (!this.bankForm2.controls.year.valid) {
        this.isExpiryYearError = true;
      }
    }



    isCreditCardError = false;
    onCreditCardFocus() {
      this.isCreditCardError = false;
    }

    onCreditCardFocusOut() {
      if (!this.bankForm2.controls.creditCardNumber.valid) {
        this.isCreditCardError = true;
      }
    }

    onNumberFocus() {
        this.isNumberError = false;
    }

    onNumberFocusOut() {
      if (!this.bankForm3.controls.registeredContactNumber.valid) {
        this.isNumberError = true;
      }
    }

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

    onNTNFocusIn() {
      this.isNTNError = false;
    }
    onNTNFocusOut() {
      if(!this.bankForm.controls.NTN.valid) {
        this.isNTNError = true;
      }
    }
    onIBANFocusIn() {
      this.isIBANError = false;
    }

    onIBANFocusOut() {
      if (!this.bankForm.controls.IBAN.valid) {
        this.isIBANError = true;
      }
    }
    onAccountNumberFocusIn() {
      this.isAccountNumberError = false;
    }

    onAccountNumberFocusOut() {
      if(!this.bankForm.controls.accountNumber.valid) {
        console.log("in if");
        this.isAccountNumberError = true;
      }
    }
    onAccountTitleFocusIn() {
      this.isAccountTitleError = false;
    }

    onAccountTitleFocusOut() {
      if (!this.bankForm.controls.accountTitle.valid) {
        this.isAccountTitleError = true;
      }
    }

    onBankNameFocusIn() {
      this.isBankNameError =false;
    }

    onBankNameFocusOut() {
      if (!this.bankForm.controls.bankName.valid) {
        this.isBankNameError = true;
      }
    }
    onRoutingNumberFocusIn() {
      this.isRoutingNumberError = false;
    }

    onRoutingNumberFocusOut() {
      if (!this.bankForm.controls.routingNumber.valid) {
        this.isRoutingNumberError = true;
    }
    else {
        this._bankDetailsService.getDetailsViaRouting(this.bank.routingNumber).subscribe(
          (res) => {
              console.log(res);
              this.bank.bankName = res.json().genericResponse.genericBody.data.bankdetails.bankName;
              console.log("bank:", this.bank.bankName);
          },
          (err) => {
              console.log(err);
          }
      );
    }
    }

    //Service Providers
    loadServiceProviders() {
      
      console.log("Loading service providers");
      
      this._bankDetailsService.getServiceProviders().subscribe(
              (res) => {
                  this.availableServiceProviders = res.json().genericResponse.genericBody.data.creditCardServiceProvider;
                  console.log("Available providers", res); 
                  if(!this.availableServiceProviders || this.availableServiceProviders.length == 0) {
                      this.selectedProvider = ''; 
                      return;
                  }
                  if(this.selectedProvider && this.selectedProvider !== ''){
                      let findProvider = this.availableServiceProviders.filter( g => g.displayName.toLowerCase() === this.selectedProvider);
                      if(findProvider.length == 0)
                          this.selectedProvider = this.availableServiceProviders[0].displayName.toLowerCase();
                  }
                  else this.selectedProvider = this.availableServiceProviders[0].displayName.toLowerCase();


                  if (this.creditCardInfo && this.creditCardInfo.length > 0) {
                    this.selectedProvider = this.creditCardInfo[0].serviceProvider.displayName;
                    this.enableCard = true;
                    this.cardInfo.creditcardNumber = this.creditCardInfo[0].creditcardNumber;
                    this.cardInfo.cvcValue = this.creditCardInfo[0].cvcValue;
                    this.cardInfo.creditCardTableId = this.creditCardInfo[0].id;

                    let spt = this.creditCardInfo[0].expiryDate.split('/');

                    if (spt.length && spt[0].length < 2)
                        this.cardInfo.month = '0' + spt[0];
                    else
                        this.cardInfo.month = spt[0];

                    this.cardInfo.year = spt[2];
                }
              },
              (err) => {
                  console.log(err);
              }
          );
      }

      
    onServiceProviderSelected(event) {
      console.log("event", this.creditCardInfo);
      this.cardInfo.creditCardTableId = null;
      var provider = this.availableServiceProviders.filter(p => p.displayName === this.selectedProvider);
      this.cardServicePattern = provider['0'].regexPattern;
      this.cardServiceTooltip = provider['0'].tooltipDescription;
      this.enableCard = true;
      this.creditCardInfo.forEach(element => {
          if (element.serviceProvider.displayName === provider['0'].displayName) {

              this.cardInfo.creditcardNumber = element.creditcardNumber;
              this.cardInfo.cvcValue = element.cvcValue;

              let spt = element.expiryDate.split('-');
              if (spt[1].length < 2)
                  this.cardInfo.month = '0' + spt[1];
              else
                  this.cardInfo.month = spt[1];

              this.cardInfo.year = spt[0];

              console.log("element.id", element.id);
              if (element.id) {
                  this.cardInfo.creditCardTableId = element.id;
              } else {
                  console.log("no id");
              }
          }
      });
  }

    //   onServiceProviderSelected(event) {
    //     this.cardInfo.creditCardTableId = null;
    //     var provider = this.availableServiceProviders.filter(p => p.displayName === this.selectedProvider);
    //     this.cardServicePattern = provider['0'].regexPattern;
    //     //this.cardServiceTooltip = provider['0'].tooltipDescription;
    //     this.enableCard = true;


    //     // this.creditCardInfo.forEach(element => {
    //     //     if (element.serviceProvider.displayName === provider['0'].displayName) {

    //     //         this.cardInfo.creditcardNumber = element.creditcardNumber;
    //     //         this.cardInfo.cvcValue = element.cvcValue;

    //     //         let spt = element.expiryDate.split('-');
    //     //         if (spt[1].length < 2)
    //     //             this.cardInfo.month = '0' + spt[1];
    //     //         else
    //     //             this.cardInfo.month = spt[1];

    //     //         this.cardInfo.year = spt[0];

    //     //         console.log("element.id", element.id);
    //     //         if (element.id) {
    //     //             this.cardInfo.creditCardTableId = element.id;
    //     //         } else {
    //     //             console.log("no id");
    //     //         }
    //     //     }
    //     // });
    // }

    onCardSubmit() {
      
              //let parent components to know that submit has been started
              this.onSubmitStarted.emit();
              this.isSubmitStarted = true;
              // if (!this.bank.creditCardTableId) {
              //     this.bank.creditCardTableId = null;
              // }

              
        let provider = this.availableServiceProviders.filter(p => p.displayName === this.selectedProvider);
        let providerId = provider[0].id;
        if (!this.cardInfo.creditCardTableId) {
            this.cardInfo.creditCardTableId = null;
        }
              // if (!this.bank.getCardPartTwo || !this.bank.getCardPartThree) {
              //     this.isSubmitStarted = false;
              // }
              this.cardInfo.expiryDate = this.cardInfo.month + '/01/' + this.cardInfo.year;
              
              //this.bank.expiryDate = this.bank.month + '/01/' + this.bank.year;
              //this.bank.creditCardServiceProviderId = this.selectedProvider;
              // this.bank.creditCardNumber = this.bank.cardOne + this.bank.getCardPartTwo + this.bank.getCardPartThree + this.bank.cardFour + '';
              this._bankDetailsService.updateCardInfo(this.user, this.country.id, this.cardInfo, providerId).subscribe(
                  (res) => {
                    this.isSubmitStarted = false;
                      console.log(res);
                      this.cardTableId = res.json().genericResponse.genericBody.id;
                      let msg = new Message();
                      msg.msg = "Your card information has updated successfully.";
                      msg.msgType = MessageTypes.Information;
                      msg.autoCloseAfter = 400;
                      this._uiService.presentToast(msg.msg);
                      //this._uiService.showToast(msg, "info");
                  },
                  (err) => {
                      console.log(err);
                      this.isSubmitStarted = false;
                      let msg = new Message();
                      msg.msg = "Sorry, an error has occured";
                      msg.msgType = MessageTypes.Error;
                      msg.autoCloseAfter = 400;
                      this._uiService.presentToast(msg.msg);
                  }
              );
          }

    onBankSubmit() {
      
      this.onSubmitStarted.emit();
      this.isSubmitStarted = true;
      if (!this.bank.bankTableId) {
          this.bank.bankTableId = null;
      }
      console.log(this._countryId.get(), "country id");
      this._bankDetailsService.updateBankInfo(this.user, this._countryId.get(), this.bank).subscribe(
          (res) => {
              console.log(res);
              this.isSubmitStarted = false;
              this.bankTableId = res.json().genericResponse.genericBody.id;
              let msg = new Message();
              msg.msg = "Your bank information has updated successfully.";
              msg.msgType = MessageTypes.Information;
              msg.autoCloseAfter = 400;
              this._uiService.presentToast(msg.msg);
              //this._uiService.showToast(msg, "info");
          },
          (err) => {
              this.isSubmitStarted = false;
              let msg = new Message();
              msg.msg = "Sorry, an error has occured";
              msg.msgType = MessageTypes.Error;
              msg.autoCloseAfter = 400;
              //this._uiService.showToast(msg, "");
              this._uiService.presentToast(msg.msg);
              console.log(err);
          }
      );
  }

  onGatewaySubmit() {
    
            //let parent components to know that submit has been started
            this.onSubmitStarted.emit();
            this.isSubmitStarted = true;
              let payGate = this.payGates.filter(p => p.displayName === this.bank.paymentName);
            console.log("payGate", payGate);
            if (payGate.length === 0)  return;
            
            this.bank.paymentgatewayId = payGate[0].id;
            this.bank.gatewayTableId = this.payGateId;
            
            
            let gateway = this.bank.paymentName ? this.bank.paymentName.toLowerCase() : '';
    
            if (gateway === 'easypay') {
                this.bank.registeredEmail = this.bank.easypayEmail;
                this.bank.gatewayTableId = this.bank.easypayTableId? this.bank.easypayTableId : null ;
                
            }
            if (gateway === 'paypal') {
                this.bank.registeredEmail = this.bank.paypalEmail;
                this.bank.gatewayTableId = this.bank.easypayTableId? this.bank.paypalTableId : null ;
            }
            if (gateway === 'stripe') {
                this.bank.registeredEmail = this.bank.stripeEmail;
                this.bank.gatewayTableId = this.bank.easypayTableId? this.bank.stripeTableId : null ;
            }
            this._paymentGatewayService.updateGatewayInfo(this.user, this.country.id, this.bank).subscribe(
                (res) => {
                    console.log(res);
                    this.gatewayTableId = res.json().genericResponse.genericBody.id;
                    let msg = new Message();
                    msg.msg = "Your payment gateway information has updated successfully.";
                    msg.msgType = MessageTypes.Information;
                    msg.autoCloseAfter = 400;
                    this._uiService.presentToast(msg.msg);
                    this.isSubmitStarted = false;
                    //this._uiService.showToast(msg, "info");
                },
                (err) => {
                    console.log(err);
                    let msg = new Message();
                    msg.msg = "Sorry, an error has occured";
                    msg.msgType = MessageTypes.Error;
                    msg.autoCloseAfter = 400;
                    this._uiService.presentToast(msg.msg);
                    this.isSubmitStarted = false;
                    //this._uiService.showToast(msg, "");
                }
            );
        }


  onPaymentGatewayFocus() {
  }
  onPaymentGatewayFocusOut() {

  }

  onPaymentGatewaySelected(event) {

      console.log("changed value")
      let payGate = this.payGates.filter(p => p.displayName === this.bank.paymentName);
      console.log("payGate", payGate, this.bank.paymentName);

      if (payGate.length === 0) {
          return;
      }
      
      this.bank.paymentgatewayId = payGate[0].id;

      this.gateway = this.bank.paymentName ? this.bank.paymentName.toLowerCase() : '';
      console.log("gateway:",this.gateway);

      if (this.gateway === 'easypay') {
          this.isEasyPay = true;
          this.isPaypal = false;
          this.isStripe = false;
      }

      if (this.gateway === 'paypal') {
          this.isEasyPay = false;
          this.isPaypal = true;
          this.isStripe = false;
      }

      if (this.gateway === 'stripe') {
          this.isEasyPay = false;
          this.isPaypal = false;
          this.isStripe = true;

      }
  }
}