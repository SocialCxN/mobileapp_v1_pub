import { Component, ViewChild, Input,ElementRef } from '@angular/core';
import { NavController , NavParams, App, Platform , ModalController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { User } from "../../../models/user";
import { InfluencerService } from "../../../providers/influencer/influencer.service";
import { UIService } from "../../../providers/ui/ui.service";
import { AuthProvider } from "../../../providers/auth/auth";
import { LoaderComponent} from '../../../shared/loader/loader';
import { InfluencerSharedData } from "../../../shared/influencer.profile"
import { Influencer } from "../../../models/influencer/influencer";
import { AudienceDemographicsService } from "../../../providers/influencer/audience.demographics.service";
import { MessageTypes, Message } from "../../../models/message";
import { GenderDemographics } from "../../../models/influencer/audience-demographics/gender.demographics";
import { AgeGroups } from "../../../models/influencer/audience-demographics/age.groups";
import { AudienceLocation } from "../../../models/location/audience.location";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Country } from "../../../models/country";
import { ZipCode } from "../../../models/zipCode";
import { State } from "../../../models/state";
import { City } from "../../../models/city";
import { Observable } from 'rxjs/Observable';
import { CountryService } from "../../../providers/country/country.service";
import { FBService } from "../../../providers/socialMedia/facebook.service";
import { SocialMedia } from "../../../models/social-media/social.media";
import { FacebookPageInfo } from "../../../models/social-media/fb.page.info";
import { SocialStats } from "../../../models/social-media/social.stats";
import { FacebookPagekeys } from "../../../models/social-media/fb.page.keys";
import { CountryAutoCompletePage } from "../../brand/user-info/country-auto-complete";
import { StateAutoCompletePage} from "../../brand/user-info/state-auto-complete";
import { CityAutoCompletePage} from "../../brand/user-info/city-auto-complete";
import { CountryIdService } from '../../../shared/countryid'

@Component({
    selector: 'page-audience-demographics',
    templateUrl: 'audience-demographics.html'
  })

export class AudienceDemoGraphicsPage {
//@ViewChild('barCanvas') barCanvas;
 
    @Input() 
    user: User = new User();

    private barCanvas: ElementRef;
    
     @ViewChild('barCanvas') set content(content: ElementRef) {
        this.barCanvas = content;
     }


     totalSum: number = 0;
     errMsg: string;
     indexes = [0, 1];
     // Pie
     //public pieChartLabels:string[] = ['Male', 'Female'];
     pieChartData: number[] = [300, 500];
     pieChartType: string = 'pie';
     genderAudienceChartLabels = ['Female', 'Male'];
     genderAudienceChartData = [50, 50];

    barChart: any;
    private doughnutCanvas: ElementRef;
    doughnutChart: any;

    @ViewChild('doughnutCanvas') set contentPie(content: ElementRef) {
        this.doughnutCanvas = content;
    }

    influencer: Influencer = new Influencer();

    segment = 'gender'; 
    barData = new Array<any>();

    genderdemographics : GenderDemographics = new GenderDemographics();
    gender: GenderDemographics = new GenderDemographics();

    @Input() savedAgeGrups = new Array<AgeGroups>();
    ageGroups = new Array<AgeGroups>();
    submitGenderArray = [];
  
    audienceLocation = new Array<AudienceLocation>();
    @Input() getAudienceLocation: Array<AudienceLocation>;
    locationObj1 = new AudienceLocation;
    locationObj2 = new AudienceLocation;
    locationObj3 = new AudienceLocation;
  
    firstCountryName: string;
    firstCountryId: number;
    secondCountryName: string;
    secondCountryId: number;
    thirdCountryName: string;
    thirdCountryId: number;
  
    isCountryValid = true;
    isSecondCountryValid = true;
    isThirdCountryValid = true;
    firstCountryCtrl: FormControl;
    secondCountryCtrl: FormControl;
    thirdCountryCtrl: FormControl;
    filteredCountries: any;
    secondFilteredCountries: any;
    thirdFilteredCountries: any;
    countries: Country[];
    secondCountries: Country[];
    thirdCountries: Country[];
  
    firstStateName: string;
    firstStateId: number;
    secondStateName: string;
    secondStateId: number;
    thirdStateName: string;
    thirdStateId: number;
    firstStateCtrl: FormControl;
    secondStateCtrl: FormControl;
    thirdStateCtrl: FormControl;
    states: State[];
    secondStates: State[];
    thirdStates: State[];
    filteredStates: Observable<any[]>;
    secondFilteredStates: Observable<any[]>;
    thirdFilteredStates: Observable<any[]>;
    isStateSelected: boolean = false;
    isStateValid: boolean = true;
    isSecondStateValid: boolean = true;
    isThirdStateValid: boolean = true;
  
    firstCityName: string;
    firstCityId: number;
    secondCityName: string;
    secondCityId: number;
    thirdCityName: string;
    thirdCityId: number;
    cities: City[];
    secondCities: City[];
    thirdCities: City[];
    filteredCities: Observable<any[]>;
    secondFilteredCities: Observable<any[]>;
    thirdFilteredCities: Observable<any[]>;
    firstCityCtrl: FormControl;
    secondCityCtrl: FormControl;
    thirdCityCtrl: FormControl;
    isCityValid: boolean = true;
    isSecondCityValid: boolean = true;
    isThirdCityValid: boolean = true;
  
    firstLocationValue: number;
    secondLocationValue: number;
    thirdLocationValue: number;


    isAddMore= false;
    isAddThird = false;
    showFirstAddMoreButton = true;
    showSecondAddMoreButton = false;
    addMore(){
      this.isAddMore = !this.isAddMore;
      this.showFirstAddMoreButton= false;
      this.showSecondAddMoreButton = true;
    }

    addThirdMore() {
      console.log("in add third")
      this.isAddThird = !this.isAddThird;
    }
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
      };
      // public barChartLabels: string[] = ['16 - 21', '22 - 30', '31 - 40', '41 - 50', '50 - 64', '65+'];
      barChartLabels: string[] = [];
      barChartType: string = 'bar';
      barChartLegend: boolean = false;
    
    
      barChartData: any[] = [
        { data: [] }
      ];

      
    constructor(private _navCtrl:NavController, private _countryService: CountryService,
        private modalCtrl: ModalController,private _countryId: CountryIdService,
         private _influencerSharedData: InfluencerSharedData,
    	private _influencerService: InfluencerService,   
     private _uiService: UIService,
      private _authService : AuthProvider,  private _facebook: FBService,   private _cityService: CountryService,
      private _stateService: CountryService,
       public loader: LoaderComponent, private _audienceDemographicsService: AudienceDemographicsService) {

        this.firstCountryCtrl = new FormControl();
        this.secondCountryCtrl = new FormControl();
        this.thirdCountryCtrl = new FormControl();
    
    
        this.firstStateCtrl = new FormControl();
        this.secondStateCtrl = new FormControl();
        this.thirdStateCtrl = new FormControl();
    
        this.firstCityCtrl = new FormControl();
        this.secondCityCtrl = new FormControl();
        this.thirdCityCtrl = new FormControl();
    }

    filterCountries(val: string) {
        if (val && val != '' && this.countries) {
          return this.countries.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        else
          return this.countries;
      }
    
      secondFilterCountries(val: string) {
        if (val && val != '' && this.secondCountries) {
          return this.secondCountries.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        else return this.secondCountries;
      }
    
      thirdFilterCountries(val: string) {
        if (val && val != '' && this.thirdCountries) {
          return this.thirdCountries.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        else return this.thirdCountries;
      }
    
    
      filterStates(val: string) {
        if (val && val != '' && this.states) {
          return this.states.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        else return this.states;
      }
    
      secondFilterStates(val: string) {
        if (val && val != '' && this.secondStates) {
          return this.secondStates.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        else return this.secondStates;
      }
      thirdFilterStates(val: string) {
        if (val && val != '' && this.thirdStates) {
          return this.thirdStates.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        else return this.thirdStates;
      }
    
    
      filterCities(val: string) {
        if (val && val != '' && this.cities) {
          return this.cities.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        else return this.cities;
      }
    
      secondFilterCities(val: string) {
        if (val && val != '' && this.secondCities) {
          return this.secondCities.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        else return this.secondCities;
      }
    
      thirdFilterCities(val: string) {
        if (val && val != '' && this.thirdCities) {
          return this.thirdCities.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        else return this.thirdCities;
      }


    ionViewDidLoad() {
         this.influencer = this._influencerSharedData.getInfluencer();
         this.savedAgeGrups = this.influencer.audienceAgeGroup;
          this.genderdemographics = this.influencer["audienceGender"];
          console.log("this gender demographics", this.genderdemographics)
          if (this.influencer.audienceLocation.length > 0) {
            this.firstCountryId = this.influencer.audienceLocation[0].country.id;
            this.firstCountryName = this.influencer.audienceLocation[0].country.name;
            this.firstCityId = this.influencer.audienceLocation[0].city.id;
            this.firstCityName = this.influencer.audienceLocation[0].city.name;
            this.firstStateId = this.influencer.audienceLocation[0].state.id;
            this.firstStateName = this.influencer.audienceLocation[0].state.name;
            this.firstLocationValue = this.influencer.audienceLocation[0].percentageCount;
            
            if ( this.influencer.audienceLocation[1] != undefined ) {
              if (this.influencer.audienceLocation[1].country != undefined) {
                this.secondCountryId =this.influencer.audienceLocation[1].country.id;
                this.secondCountryName = this.influencer.audienceLocation[1].country.name;
                this.secondCityId = this.influencer.audienceLocation[1].city.id;
                this.secondCityName = this.influencer.audienceLocation[1].city.name;
                this.secondStateId = this.influencer.audienceLocation[1].state.id;
                this.secondStateName = this.influencer.audienceLocation[1].state.name;
                this.secondLocationValue = this.influencer.audienceLocation[1].percentageCount;
              }
            }

            if ( this.influencer.audienceLocation[2] != undefined ) {
              if (this.influencer.audienceLocation[2].country != undefined) {
                this.thirdCountryId =this.influencer.audienceLocation[2].country.id;
                this.thirdCountryName = this.influencer.audienceLocation[2].country.name;
                this.thirdCityId = this.influencer.audienceLocation[2].city.id;
                this.thirdCityName = this.influencer.audienceLocation[2].city.name;
                this.thirdStateId = this.influencer.audienceLocation[2].state.id;
                this.thirdStateName = this.influencer.audienceLocation[2].state.name;
                this.thirdLocationValue = this.influencer.audienceLocation[2].percentageCount;
              }
                
            }


          }
          
         console.log("this gender demographics", this.genderdemographics)

        if (this.genderdemographics[0] != undefined) {
            console.log("this doughnut canvas", this.doughnutCanvas, this.barCanvas);
            this.gender.femalePercentage = this.genderdemographics[1].percentage;
            this.gender.malePercentage = this.genderdemographics[0].percentage;
            // this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
                
            //                type: 'doughnut',
            //                data: {
            //                    labels: ["Male", "Female"],
            //                    datasets: [{
            //                        label: '# of Votes',
            //                        data: [this.genderdemographics[0].percentage, this.genderdemographics[1].percentage],
            //                        backgroundColor: [
            //                            'rgba(139, 199, 243, 1)',
            //                            'rgba(255, 161, 181, 1)'
            //                        ],
            //                        hoverBackgroundColor: [
            //                            "rgba(139, 199, 243, 1)",
            //                            "rgba(255, 161, 181, 1)"
            //                        ]
            //                    }]
            //                }
                
            //            });
        }

 
    }

    ngOnInit(): void {
        
            this.loadInfluencerAgeGroups();
        
            this.loadCountries();
        
            //FB Pages Location 
            this._facebook.pagesLocation.subscribe(
              (pageLoc) => {
                let finalPagesLoation = [];
                if (pageLoc['0']) {
                  pageLoc['0'].values.forEach(pagelocation => {
                    finalPagesLoation.push(pagelocation.value);
        
                  });
                  console.log("Page Locations", finalPagesLoation);
        
                }
        
              })
        
            // initialize local variables to keep the count
            let maleCount = 0;
            let femaleCount = 0;
            let ageGroups = new Array<number>();
            let facebookPageKeys = new FacebookPagekeys();
            let totalCountAgeWise = 0;
            //trigger by facebook service for each page
            this._facebook.pagesGender.subscribe(
              (pagesGender) => {
                let pageGender = [];
                if (pagesGender.length > 0) {
        
                  if (pagesGender['0']) {
                    pagesGender['0'].values.forEach(gender => {
                      pageGender.push(gender.value);
                      console.log("final gender", pageGender);
                    });
        
                  }
        
                  let ageAndGender = pageGender[0];
                  let index = 0;
        
                  facebookPageKeys.femaleGenderkeys.forEach(key => {
                    let ageCount = 0;
                    if (ageAndGender[key]) {
                      femaleCount += ageAndGender[key];
                      ageCount = ageAndGender[key];
                    }
                    //check if there is already an entry available in the array
                    //becasue the same array is used on multiple page add trigger
                    if (ageGroups.length > index)
                      ageGroups[index] += ageCount;
                    else
                      ageGroups.push(ageCount);
        
                    // if(index == 6)
                    //   ageGroups[5] += ageCount;
        
                    totalCountAgeWise += ageCount;
                    ++index;
                  });
        
                  index = 0;
        
                  facebookPageKeys.maleGenderKeys.forEach(key => {
                    if (ageAndGender[key]) {
                      maleCount += ageAndGender[key];
                      totalCountAgeWise += ageAndGender[key];
                      ageGroups[index] += ageAndGender[key];
        
                      // if(index == 6)
                      //   ageGroups[5] += ageAndGender[key];
                    }
                    ++index;
        
                  });
        
                  let total = maleCount + femaleCount;
        
                  this.gender.femalePercentage = ((femaleCount / total) * 100).toFixed(2);
                  this.gender.malePercentage = ((maleCount / total) * 100).toFixed(2);
                  this.genderAudienceChartData = [this.gender.femalePercentage, this.gender.malePercentage];
        
        
                  //merge last two entries of the array (55-65 & 65+ into 55+)
                  //ageGroups[ageGroups.length - 2] += ageGroups[ageGroups.length - 1];
        
                  // console.log("Total Count", totalCountAgeWise);
                  // console.log("Age Groups", ageGroups);
        
                  index = 0;
                  this.barChartData = [];
                  this.ageGroups.forEach(g => {
                    g.percentageCount = ((ageGroups[index] / totalCountAgeWise) * 100).toFixed(2);
                    this.barChartData.push(g.percentageCount);
                    ++index;
                  });
        
        
                }
        
              });
        
            // this._facebook.genderCountChanged.subscribe(
            //   (genderDemograpic) => {
            //     this.gender.femalePercentage = genderDemograpic.femalePercentage;
            //     this.gender.malePercentage = genderDemograpic.malePercentage;
        
            //     this.genderAudienceChartData = [this.gender.malePercentage, this.gender.femalePercentage];
            //   }   
            // );
          }
        
    
    segmentChanged(event){
        console.log("Event",event._value)
        this.segment = event._value;
        if (this.segment == 'gender') {

          if (this.genderdemographics[0] != undefined) {
            if (this.genderdemographics[0].percentage != undefined) {
              console.log("this doughnut canvas", this.doughnutCanvas, this.barCanvas);
              this.gender.femalePercentage = this.genderdemographics[1].percentage;
              this.gender.malePercentage = this.genderdemographics[0].percentage;
              setTimeout(()=> {
                  // this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
                      
                  //                type: 'doughnut',
                  //                data: {
                  //                    labels: ["Male", "Female"],
                  //                    datasets: [{
                  //                        label: '# of Votes',
                  //                        data: [this.genderdemographics[0].percentage, this.genderdemographics[1].percentage],
                  //                        backgroundColor: [
                  //                            'rgba(139, 199, 243, 1)',
                  //                            'rgba(255, 161, 181, 1)'
                  //                        ],
                  //                        hoverBackgroundColor: [
                  //                            "rgba(139, 199, 243, 1)",
                  //                            "rgba(255, 161, 181, 1)"
                  //                        ]
                  //                    }]
                  //                }
                      
                  //            });
              })

          }
          }

    
        }
       else  if (this.segment == 'age' ) {
        setTimeout(()=>{
            if (this.influencer.audienceAgeGroup.length > 0 ){
                for (let i of this.influencer.audienceAgeGroup) {
                    this.barData.push(i.percentageCount);
                }
            }
            // this.barChart = new Chart(this.barCanvas.nativeElement, {
                
            //                type: 'bar',
            //                data: {
            //                    labels: this.barChartLabels,
            //                    datasets: [{
            //                        label: 'Age',
            //                        data: this.barData,
            //                        backgroundColor: [
            //                            'rgba(255, 99, 132, 0.2)',
            //                            'rgba(54, 162, 235, 0.2)',
            //                            'rgba(255, 206, 86, 0.2)',
            //                            'rgba(75, 192, 192, 0.2)',
            //                            'rgba(153, 102, 255, 0.2)',
            //                            'rgba(255, 159, 64, 0.2)'
            //                        ],
            //                        borderColor: [
            //                            'rgba(255,99,132,1)',
            //                            'rgba(54, 162, 235, 1)',
            //                            'rgba(255, 206, 86, 1)',
            //                            'rgba(75, 192, 192, 1)',
            //                            'rgba(153, 102, 255, 1)',
            //                            'rgba(255, 159, 64, 1)'
            //                        ],
            //                        borderWidth: 1
            //                    }]
            //                },
            //                options: {
            //                    scales: {
            //                        yAxes: [{
            //                            ticks: {
            //                                beginAtZero:true
            //                            }
            //                        }]
            //                    }
            //                }
                
            //            });         
        })

        }
    }

    loadAgeData() {
        if (this.savedAgeGrups && this.savedAgeGrups.length) {
          this.savedAgeGrups.forEach(a => {
            let f = this.ageGroups.filter(ag => ag.id === a.ageGroupId);
            if (f.length > 0) {
              f[0].percentageCount = a.percentageCount;
            }
          });
          // this.barChartData = [];
          //console.log("Age Groups",this.ageGroups);
    
          this.barChartData = [];
          this.savedAgeGrups.forEach(age => {
            this.barChartData.push(age.percentageCount);
          });
        }
      }
    
      onFemalePercentageOut() {
        // this.gender.femalePercentage;
        let per = +this.gender.femalePercentage;
        if (per == 0) {
          this.gender.femalePercentage = 0;
          this.gender.malePercentage = 100 - this.gender.femalePercentage;
          //return;
        }
        if (!per) {
          this.gender.femalePercentage = 100 - this.gender.malePercentage;
          //return;
        }
    
        this.gender.malePercentage = 100 - per;
        this.gender.femalePercentage = per;
        this.genderAudienceChartData = [];
        this.genderAudienceChartData.push(this.gender.femalePercentage);
        this.genderAudienceChartData.push(this.gender.malePercentage);
      }
    
      onMalePercentageOut() {
    
        let per = +this.gender.malePercentage;
        if (per == 0) {
          this.gender.malePercentage = 0;
          this.gender.femalePercentage = 100 - this.gender.malePercentage;
          //return;
        }
        if (!per) {
          this.gender.malePercentage = 100 - this.gender.femalePercentage;
          //return;
        }
        this.gender.femalePercentage = 100 - per;
        this.gender.malePercentage = per;
        this.genderAudienceChartData = [];
        this.genderAudienceChartData.push(this.gender.femalePercentage);
        this.genderAudienceChartData.push(this.gender.malePercentage);
      }
    
    showPieChart() {
        this.influencer = this._influencerSharedData.getInfluencer();
        this.genderdemographics = this.influencer["audienceGender"];
        if (this.genderdemographics[0].percentage != undefined) {
            console.log("this doughnut canvas", this.doughnutCanvas, this.barCanvas);
            this.gender.femalePercentage = this.genderdemographics[1].percentage;
            this.gender.malePercentage = this.genderdemographics[0].percentage;
            setTimeout(()=> {
                // this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
                    
                //                type: 'doughnut',
                //                data: {
                //                    labels: ["Male", "Female"],
                //                    datasets: [{
                //                        label: '# of Votes',
                //                        data: [this.genderdemographics[0].percentage, this.genderdemographics[1].percentage],
                //                        backgroundColor: [
                //                            'rgba(139, 199, 243, 1)',
                //                            'rgba(255, 161, 181, 1)'
                //                        ],
                //                        hoverBackgroundColor: [
                //                            "rgba(139, 199, 243, 1)",
                //                            "rgba(255, 161, 181, 1)"
                //                        ]
                //                    }]
                //                }
                    
                //            });
            })

        }
    }
    onSumbitGenderPercentage() {
        this._audienceDemographicsService.postAudienceGender(this.gender.malePercentage, this.gender.femalePercentage).subscribe(
          (res) => {
              console.log("Res",res);
            let msg = new Message();
            msg.msg = "Your gender demographics has saved successfully";
            msg.msgType = MessageTypes.Information;
            msg.autoCloseAfter = 400;
            this.influencer['audienceGender'] = res.json().genericResponse.genericBody.data.audienceGender;
            this._influencerSharedData.setInfluencer(this.influencer);
            this.showPieChart();
            this._uiService.presentToast(msg.msg);
          },
          (err) => {
            console.log(err);
            let msg = err.json().genericResponse.genericBody.message;
            msg.msg = this.errMsg;
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.presentToast(msg.msg);
          }
        );
      }
    
      pop() {
        this._navCtrl.pop();
    }
    
      loadInfluencerAgeGroups() {
        this._audienceDemographicsService.getAgeGroups().subscribe(
          (res) => {
            this.ageGroups = res.json().genericResponse.genericBody.data.ageGroups;
    
            for (var i = 0; i < this.ageGroups.length; i++) {
              this.barChartLabels[i] = this.ageGroups[i].displayName;
            }
    
            this.loadAgeData();
          },
          (err) => { console.log(err); }
        );
      }
    
      onSubmitAge() {
        console.log("submit", this.ageGroups);
        this.totalSum = 0;
        
        this.ageGroups.forEach(element => {
          console.log(element.percentageCount);
          //this.influencer.audienceAgeGroup[count].percentageCount = element.percentageCount;
          this.totalSum += parseInt(element.percentageCount)
        });
        console.log("submit", this.ageGroups, this.totalSum);
    if (this.totalSum !== 100 || !this.totalSum) {
      let msg = new Message();
      msg.msg = "The percentage sum of all age groups should be exactly 100";
      msg.msgType = MessageTypes.Error;
      msg.autoCloseAfter = 400;
      this._uiService.presentToast(msg.msg);
      return;
    }

    this._audienceDemographicsService.postAudienceAgeGroup(this.ageGroups).subscribe(
      (res) => {
        console.log(res);
        let count =0;
        this.ageGroups.forEach(element => {
          console.log(element.percentageCount);
          if (this.influencer.audienceAgeGroup[count] != undefined) {
            this.influencer.audienceAgeGroup[count].percentageCount = element.percentageCount;
          }
          
          count++;
        });
        let msg = new Message();
        msg.msg = "Your age demographics has saved successfully";
        msg.msgType = MessageTypes.Information;
        msg.autoCloseAfter = 400;
        this._uiService.presentToast(msg.msg);
      },
      (err) => {
        console.log(err);
        let msg = err.json().genericResponse.genericBody.message;
        msg.msg = this.errMsg;
        msg.msgType = MessageTypes.Error;
        msg.autoCloseAfter = 400;
        this._uiService.presentToast(msg.msg);
      }
    );
    }

      // events
  //   public chartClicked(e:any):void {
  //     console.log(e);
  //   }

  //   public chartHovered(e:any):void {
  //     console.log(e);
  //   }

  loadCountries() {
    this._countryService.getCountries().subscribe(
      (res) => {

        this.countries = res.json().genericResponse.genericBody.data.countries;
        this.secondCountries = res.json().genericResponse.genericBody.data.countries;
        this.thirdCountries = res.json().genericResponse.genericBody.data.countries;
        this.filterCountries('');
        this.secondFilterCountries('');
        this.thirdFilterCountries('');

        this.filteredCountries = this.firstCountryCtrl.valueChanges
          .startWith(null)
          .map(name => name ? this.filterCountries(name) : this.countries.slice());

        this.secondFilteredCountries = this.secondCountryCtrl.valueChanges
          .startWith(null)
          .map(name => name ? this.secondFilterCountries(name) : this.secondCountries.slice());

        this.thirdFilteredCountries = this.thirdCountryCtrl.valueChanges
          .startWith(null)
          .map(name => name ? this.thirdFilterCountries(name) : this.thirdCountries.slice());

          
        let firstCountry = this.countries.filter(c => c.name == this.firstCountryName);
        
                if (firstCountry.length === 0) {
                    this.isCountryValid = false;
                    return;
                  }
                  this.isCountryValid = true;
                  this.firstCountryId = firstCountry[0].id;
                  this._stateService.getStates(this.firstCountryId).subscribe(
                    (res) => {
                      this.states = res.json().genericResponse.genericBody.data.states;
                      this.filterStates('');
                      this.filteredStates = this.firstStateCtrl.valueChanges
                        .startWith(null)
                        .map(name => name ? this.filterStates(name) : this.states.slice());
                    },
                    (err) => {
                      console.log(err);
                    });
      },
      (err) => {
        console.log(err);
      }
    );
  }
  isCountryModalOpen = false;
  onCountryFocus() {
    this.isCountryValid = true;
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

            if (this.firstCountryId!= data.countryId) {
              this.firstCountryName = data.country;
              this.firstCountryId = data.countryId;
              this.firstCountryId = data.countryId ;
              this.firstStateId = null;
              this.firstStateName= null;
              this.firstCityId = null;
              this.firstCityName = null; 
            }
            

        let firstCountry = this.countries.filter(c => c.name == this.firstCountryName);

        if (firstCountry.length === 0) {
            this.isCountryValid = false;
            return;
          }
          this.isCountryValid = true;
          this.firstCountryId = firstCountry[0].id;
          this._stateService.getStates(this.firstCountryId).subscribe(
            (res) => {
              this.states = res.json().genericResponse.genericBody.data.states;
              this.filterStates('');
              this.filteredStates = this.firstStateCtrl.valueChanges
                .startWith(null)
                .map(name => name ? this.filterStates(name) : this.states.slice());
            },
            (err) => {
              console.log(err);
            });

        // if (country.length === 0) {
        //   if (this.oldCountry && this.oldCountry != '')
        //       //this.brand.country = this.oldCountry;
        //       //else
        //       this.isCountryValid = false;
        //   return;
        // }

      }
    })
}

  onCountryFocusOut() {
    if (!this.countries) return;
    let firstCountry = this.countries.filter(c => c.name == this.firstCountryName);
    if (firstCountry.length === 0) {
      this.isCountryValid = false;
      return;
    }
    this.isCountryValid = true;
    this.firstCountryId = firstCountry[0].id;
    this._stateService.getStates(this.firstCountryId).subscribe(
      (res) => {
        this.states = res.json().genericResponse.genericBody.data.states;
        this.filterStates('');
        this.filteredStates = this.firstStateCtrl.valueChanges
          .startWith(null)
          .map(name => name ? this.filterStates(name) : this.states.slice());
      },
      (err) => {
        console.log(err);
      });
  }
  onCountryChange() {
    if (this.isCountryValid) {
      this.firstStateName = null;
      this.firstCityName = null;
    }
  }

  isSecondCountryModalOpen = false;
  onSecondCountryFocus() {
    this.isSecondStateValid = true;
    this.isCountryValid = true;
    this.cities = null;

    let autocomplete = this.modalCtrl.create(CountryAutoCompletePage);
    if (!this.isSecondCountryModalOpen) {
        autocomplete.present();
        this.isSecondCountryModalOpen = true;
    }
    
    autocomplete.onDidDismiss(data=>{ //This is a listener which wil get the data passed from modal when the modal's view controller is dismissed
        console.log("Data",data)
        this.isSecondCountryModalOpen = false;
        
        if (data.country) {

            if (this.secondCountryId!= data.countryId) {
              this.secondCountryName = data.country;
              this.secondCountryId = data.countryId;
              this.secondCountryId = data.countryId ;
              this.secondStateId = null;
              this.secondStateName= null;
              this.secondCityId = null;
              this.secondCityName = null; 
            }
            

        let firstCountry = this.secondCountries.filter(c => c.name == this.secondCountryName);

        if (firstCountry.length === 0) {
            this.isCountryValid = false;
            return;
          }
          this.isCountryValid = true;
          this.secondCountryId = firstCountry[0].id;
          this._stateService.getStates(this.secondCountryId).subscribe(
            (res) => {
              this.secondStates = res.json().genericResponse.genericBody.data.states;
              this.filterStates('');
              this.filteredStates = this.secondStateCtrl.valueChanges
                .startWith(null)
                .map(name => name ? this.filterStates(name) : this.secondStates.slice());
            },
            (err) => {
              console.log(err);
            });

        // if (country.length === 0) {
        //   if (this.oldCountry && this.oldCountry != '')
        //       //this.brand.country = this.oldCountry;
        //       //else
        //       this.isCountryValid = false;
        //   return;
        // }

      }
    })
  }

  onSecondCountryFocusOut() {
    if (!this.secondCountries) return;
    let secondCountry = this.secondCountries.filter(c => c.name == this.secondCountryName);
    if (secondCountry.length === 0) {
      this.isSecondStateValid = false;
      return;
    }
    this.isSecondStateValid = true;
    console.log("secondCountry", secondCountry);
    this.secondCountryId = secondCountry[0].id;

    this._stateService.getStates(this.secondCountryId).subscribe(
      (res) => {
        this.secondStates = res.json().genericResponse.genericBody.data.states;
        this.secondFilterStates('');
        this.secondFilteredStates = this.secondStateCtrl.valueChanges
          .startWith(null)
          .map(name => name ? this.secondFilterStates(name) : this.secondStates.slice());
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSecondCountryChange() {
    if (this.isSecondStateValid) {
      this.secondStateName = null;
      this.secondCityName = null;
    }
  }

isThirdCountryModalOpen = false;
  onThirdCountryFocus() {
    this.isThirdCountryValid = true;
    this.isThirdStateValid = true;
    this.isThirdCountryValid = true;
    this.thirdCities = null;

    let autocomplete = this.modalCtrl.create(CountryAutoCompletePage);
    if (!this.isThirdCountryModalOpen) {
        autocomplete.present();
        this.isThirdCountryModalOpen = true;
    }
    
    autocomplete.onDidDismiss(data=>{ //This is a listener which wil get the data passed from modal when the modal's view controller is dismissed
        console.log("Data",data)
        this.isThirdCountryModalOpen = false;
        
        if (data.country) {

            if (this.thirdCountryId!= data.countryId) {
              this.thirdCountryName = data.country;
              this.thirdCountryId = data.countryId;
              this.thirdCountryId = data.countryId ;
              this.thirdStateId = null;
              this.thirdStateName= null;
              this.thirdCityId = null;
              this.thirdCityName = null; 
            }
            

        let firstCountry = this.thirdCountries.filter(c => c.name == this.thirdCountryName);

        if (firstCountry.length === 0) {
            this.isThirdCountryValid = false;
            return;
          }
          this.isThirdCountryValid = true;
          this.thirdCountryId = firstCountry[0].id;
          this._stateService.getStates(this.thirdCountryId).subscribe(
            (res) => {
              this.thirdStates = res.json().genericResponse.genericBody.data.states;
              this.filterStates('');
              this.filteredStates = this.thirdStateCtrl.valueChanges
                .startWith(null)
                .map(name => name ? this.filterStates(name) : this.thirdStates.slice());
            },
            (err) => {
              console.log(err);
            });

        // if (country.length === 0) {
        //   if (this.oldCountry && this.oldCountry != '')
        //       //this.brand.country = this.oldCountry;
        //       //else
        //       this.isCountryValid = false;
        //   return;
        // }

      }
    })
  }

  onThirdCountryFocusOut() {
    if (!this.thirdCountries) return;
    let thirdCountry = this.thirdCountries.filter(c => c.name == this.thirdCountryName);
    if (thirdCountry.length === 0) {
      this.isThirdCountryValid = false;
      return;
    }

    this.isThirdCountryValid = true;
    console.log("thirdCountry", thirdCountry);
    this.thirdCountryId = thirdCountry[0].id;

    this._stateService.getStates(this.thirdCountryId).subscribe(
      (res) => {
        this.thirdStates = res.json().genericResponse.genericBody.data.states;
        this.thirdFilterStates('');

        this.thirdFilteredStates = this.thirdStateCtrl.valueChanges
          .startWith(null)
          .map(name => name ? this.thirdFilterStates(name) : this.thirdStates.slice());
      },
      (err) => {
        console.log(err);
      });

  }

  onThirdCountryChange() {
    if (this.isThirdCountryValid) {
      this.thirdStateName = null;
      this.thirdCityName = null;
    }
  }
  isStateModalOpen = false;
  onStateFocus() {
  	if (!this.states) return;
    this.isStateValid = true;

    let autocomplete = this.modalCtrl.create(StateAutoCompletePage);
    this._countryId.set(this.firstCountryId);
    if (!this.isStateModalOpen) {
        autocomplete.present();
        this.isStateModalOpen = true;
    }

    autocomplete.onDidDismiss(data=>{
       this.isStateModalOpen = false;  
      if(data) {
          if (this.firstStateId != data.countryId) {
              this.firstStateName = data.country;
              this.firstStateId = data.countryId;
              this.firstCityId = null;
              this.firstCityName = null;
          }

          let state = this.states.filter(c => c.name == this.firstStateName);
          if (state.length === 0) {
            this.isStateValid = false;
            return;
          }
          this.isStateValid = true;
          this.firstStateId = state[0].id;
          // this.influencer.profile.city.id = 0;
      
          if (this.isStateValid) {
            this._cityService.getCities(this.firstStateId).subscribe(
              (res) => {
                this.cities = res.json().genericResponse.genericBody.data.cities;
                this.filterCities('');
                this.filteredCities = this.firstCityCtrl.valueChanges
                  .startWith(null)
                  .map(name => name ? this.filterCities(name) : this.cities.slice());
              },
              (err) => {
                console.log(err);
              });
          }
          

      }
  
  });
  }
  onStateFocusOut() {
    if (!this.states) return;
    let state = this.states.filter(c => c.name == this.firstStateName);
    if (state.length === 0) {
      this.isStateValid = false;
      return;
    }
    this.isStateValid = true;
    this.firstStateId = state[0].id;
    // this.influencer.profile.city.id = 0;

    if (this.isStateValid) {
      this._cityService.getCities(this.firstStateId).subscribe(
        (res) => {
          this.cities = res.json().genericResponse.genericBody.data.cities;
          this.filterCities('');
          this.filteredCities = this.firstCityCtrl.valueChanges
            .startWith(null)
            .map(name => name ? this.filterCities(name) : this.cities.slice());
        },
        (err) => {
          console.log(err);
        });
    }
  }
  onStateChange() {
    if (this.isStateValid) {
      this.firstCityName = null;
    }
  }

isSecondStateModalOpen = false;
  onSecondStateFocus() {
  	if (!this.secondStates) return;
    this.isSecondStateValid = true;
     

    let autocomplete = this.modalCtrl.create(StateAutoCompletePage);
    this._countryId.set(this.secondCountryId);
    if (!this.isSecondStateModalOpen) {
        autocomplete.present();
        this.isSecondStateModalOpen = true;
    }

    autocomplete.onDidDismiss(data=>{
       this.isSecondStateModalOpen = false;  
      if(data) {
          if (this.secondStateId != data.countryId) {
              this.secondStateName = data.country;
              this.secondStateId = data.countryId;
              this.secondCityId = null;
              this.secondCityName = null;
          }

          let state = this.secondStates.filter(c => c.name == this.secondStateName);
          if (state.length === 0) {
            this.isStateValid = false;
            return;
          }
          this.isStateValid = true;
          this.secondStateId = state[0].id;
          // this.influencer.profile.city.id = 0;
      
          if (this.isStateValid) {
            this._cityService.getCities(this.secondStateId).subscribe(
              (res) => {
                this.secondCities = res.json().genericResponse.genericBody.data.cities;
                this.filterCities('');
                this.filteredCities = this.secondCityCtrl.valueChanges
                  .startWith(null)
                  .map(name => name ? this.filterCities(name) : this.secondCities.slice());
              },
              (err) => {
                console.log(err);
              });
          }
          

      }
  
  });
  }
  onSecondStateFocusOut() {
    if (!this.secondStates) return;
    let secondState = this.secondStates.filter(c => c.name == this.secondStateName);
    if (secondState.length === 0) {
      this.isSecondStateValid = false;
      return;
    }
    this.isSecondStateValid = true;
    this.secondStateId = secondState[0].id;
    // this.influencer.profile.city.id = 0;

    if (this.isSecondStateValid) {
      this._cityService.getCities(this.secondStateId).subscribe(
        (res) => {
          this.secondCities = res.json().genericResponse.genericBody.data.cities;
          this.secondFilterCities('');
          this.secondFilteredCities = this.secondCityCtrl.valueChanges
            .startWith(null)
            .map(name => name ? this.secondFilterCities(name) : this.secondCities.slice());
        },
        (err) => {
          console.log(err);
        });
    }
  }

  onSecondStateChange() {
    if (this.isSecondStateValid) {
      this.secondCityName = null;
    }
  }

isThirdStateModalOpen = false;
  onThirdStateFocus() {
  	if (!this.thirdStates) return;
    this.isThirdStateValid = true;

    let autocomplete = this.modalCtrl.create(StateAutoCompletePage);
    this._countryId.set(this.thirdCountryId);
    if (!this.isThirdStateModalOpen) {
        autocomplete.present();
        this.isThirdStateModalOpen = true;
    }

    autocomplete.onDidDismiss(data=>{
       this.isThirdStateModalOpen = false;  
      if(data) {
          if (this.thirdStateId != data.countryId) {
              this.thirdStateName = data.country;
              this.thirdStateId = data.countryId;
              this.thirdCityId = null;
              this.thirdCityName = null;
          }

          let state = this.thirdStates.filter(c => c.name == this.thirdStateName);
          if (state.length === 0) {
            this.isStateValid = false;
            return;
          }
          this.isStateValid = true;
          this.thirdStateId = state[0].id;
          // this.influencer.profile.city.id = 0;
      
          if (this.isStateValid) {
            this._cityService.getCities(this.thirdStateId).subscribe(
              (res) => {
                this.thirdCities = res.json().genericResponse.genericBody.data.cities;
                this.filterCities('');
                this.filteredCities = this.thirdCityCtrl.valueChanges
                  .startWith(null)
                  .map(name => name ? this.filterCities(name) : this.thirdCities.slice());
              },
              (err) => {
                console.log(err);
              });
          }
          

      }
  
  });
  }
  onThirdStateFocusOut() {
    if (!this.thirdStates) return;
    let thirdState = this.thirdStates.filter(c => c.name == this.thirdStateName);
    if (thirdState.length === 0) {
      this.isThirdStateValid = false;
      return;
    }
    this.isThirdStateValid = true;
    this.thirdStateId = thirdState[0].id;

    if (this.isThirdStateValid) {
      this._cityService.getCities(this.thirdStateId).subscribe(
        (res) => {
          this.thirdCities = res.json().genericResponse.genericBody.data.cities;
          this.thirdFilterCities('');
          this.thirdFilteredCities = this.thirdCityCtrl.valueChanges
            .startWith(null)
            .map(name => name ? this.thirdFilterCities(name) : this.thirdCities.slice());
        },
        (err) => {
          console.log(err);
        });
    }
  }

  onThirdStateChange() {
    if (this.isThirdStateValid) {
      this.thirdCityName = null;
    }
  }

isCityModalOpen = false;
    onCityFocus() {
   	this.isCityValid = true;
    if (this.firstStateName) {
        let autocomplete = this.modalCtrl.create(CityAutoCompletePage);
        this._countryId.set(this.firstStateId);
        if (!this.isCityModalOpen) {
            autocomplete.present();
            this.isCityModalOpen = true;
        }
  
        autocomplete.onDidDismiss(data=>{
          if(data) {
              this.firstCityName = data.country;
              this.firstCityId = data.countryId;
  
          }
          this.isCityModalOpen = false;    
      });
    }
  }

  onCityFocusOut() {
    if (!this.cities) return;
    let city = this.cities.filter(c => c.name == this.firstCityName);
    console.log(city);

    if (city.length === 0) {
      this.isCityValid = false;
      return;
    }
    this.isCityValid = true;
    this.firstCityId = city[0].id;
  }

  isSecondCityModalOpen = false;
  onSecondCityFocus() {
    this.isSecondCityValid = true;
    if (this.secondStateName) {
        let autocomplete = this.modalCtrl.create(CityAutoCompletePage);
        this._countryId.set(this.secondStateId);
        if (!this.isSecondCityModalOpen) {
            autocomplete.present();
            this.isSecondCityModalOpen = true;
        }
  
        autocomplete.onDidDismiss(data=>{
          if(data) {
              this.secondCityName = data.country;
              this.secondCityId = data.countryId;
  
          }
          this.isSecondCityModalOpen = false;    
      });
    }
  }
  onSecondCityFocusOut() {
    if (!this.secondCities) return;
    let city = this.secondCities.filter(c => c.name == this.secondCityName);
    console.log(city);

    if (city.length === 0) {
      this.isSecondCityValid = false;
      return;
    }
    this.isCityValid = true;
    this.secondCityId = city[0].id;
  }

  isThirdCityModalOpen = false;
  onThirdCityFocus() {
    this.isThirdCityValid = true;
        if (this.thirdStateName) {
        let autocomplete = this.modalCtrl.create(CityAutoCompletePage);
        this._countryId.set(this.thirdStateId);
        if (!this.isThirdCityModalOpen) {
            autocomplete.present();
            this.isThirdCityModalOpen = true;
        }
  
        autocomplete.onDidDismiss(data=>{
          if(data) {
              this.thirdCityName = data.country;
              this.thirdCityId = data.countryId;
  
          }
          this.isThirdCityModalOpen = false;    
      });
    }
  }
  onThirdCityFocusOut() {
    if (!this.thirdCities) return;
    let city = this.thirdCities.filter(c => c.name == this.thirdCityName);
    console.log(city);

    if (city.length === 0) {
      this.isThirdCityValid = false;
      return;
    }
    this.isCityValid = true;
    this.thirdCityId = city[0].id;
  }

  onSubmitLocation() {
    let total;
    this.audienceLocation = [];

    if (this.firstCountryName) {

      this.locationObj1.country.id = this.firstCountryId;
      this.locationObj1.state.id = this.firstStateId;
      this.locationObj1.city.id = this.firstCityId;
      this.locationObj1.percentageCount = parseInt(this.firstLocationValue.toString());

      this.audienceLocation.push(this.locationObj1);
      total = parseInt(this.firstLocationValue.toString());
    }

    if (this.secondCountryName) {
      this.locationObj2.country.id = this.secondCountryId;
      this.locationObj2.state.id = this.secondStateId;
      this.locationObj2.city.id = this.secondCityId;
      this.locationObj2.percentageCount = parseInt(this.secondLocationValue.toString());

      this.audienceLocation.push(this.locationObj2);
      total += parseInt(this.secondLocationValue.toString());
    }

    if (this.thirdCountryName) {
      this.locationObj3.country.id = this.thirdCountryId;
      this.locationObj3.state.id = this.thirdStateId;
      this.locationObj3.city.id = this.thirdCityId;
      this.locationObj3.percentageCount = parseInt(this.thirdLocationValue.toString());

      this.audienceLocation.push(this.locationObj3);
      total += parseInt(this.thirdLocationValue.toString());
    }

    if (total !== 100) {
      console.log("total", total);

      let msg = new Message();
      msg.msg = "The sum of all country contributions should be exactly 100";
      msg.msgType = MessageTypes.Error;
      msg.autoCloseAfter = 400;
      this._uiService.presentToast(msg.msg);
      return;
    }

    console.log(this.audienceLocation);
    this._audienceDemographicsService.postAudienceLocation(this.audienceLocation).subscribe(
      (res) => {
      	this.influencer.audienceLocation = this.audienceLocation;
      	this._influencerSharedData.setInfluencer(this.influencer);
        let msg = new Message();
        msg.msg = "Audience location has updated successfully";
        msg.msgType = MessageTypes.Information;
        msg.autoCloseAfter = 400;
        this._uiService.presentToast(msg.msg);
      },
      (err) => { console.log(err); }
    );

  }
}