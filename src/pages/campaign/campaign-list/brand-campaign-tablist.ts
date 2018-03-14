import { Component, OnInit, Inject, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { NavController , NavParams, App } from 'ionic-angular';
import { AuthProvider } from "../../../providers/auth/auth";
import { LoaderComponent} from '../../../shared/loader/loader';
import { User } from "../../../models/user";
import { BrandCampaignListModel } from "../../../models/campaign/brand.campaignlist";
import { CampaignStatus } from "../../../models/campaign/campaign.status";
import { CampaignService } from "../../../providers/campaign/campaign.service";
import { UtilityService } from "../../../providers/general/utility.service"
import {InfluencerCampaignDetailsPage } from "../campaign-details/influencer.campaign.details";
import { Subject } from "rxjs/Subject";
import { CampaignCreate} from "../campaign-create/campaign.create";
import { BrandCampaignDetailsPage} from "../campaign-details/brand.campaign.details";
import { MessagingComponent} from "../../messaging/messaging.component"
import { NotificationService} from "../../../providers/general/notification.service";
@Component({
  selector: 'page-brand-campaignlist',
  templateUrl: 'brand-campaign-tablist.html'
})
export class BrandCampaignTabListPage {
  role: string;
  currentURL: string;
  start: Boolean = true;
  isUser: User = new User();
  entityType: string;
  redirectUrl: string;
  isLogin: any;
  meta: any;
  length = 100; // total searched records
  pageSize = 5; // by default
  pageSizeOptions = [25, 50, 100];
  campaignStatus: any;
  influencerCampaignStatus = new Array<CampaignStatus>();
  objectToExport = new Array<any>();

  isLoading =false;
  @Output() onStarted = new EventEmitter();

  upperLimit = 0;
  user: User = new User();
  statusSelected: any;
  expandedIndex = -1;
  showInfluencers: false;
  brandCampignsList = new Array<BrandCampaignListModel>();
  brandCampaignStatus = new Array<CampaignStatus>();
  totalBudgetSpent : string = "0";
  private ngUnsubscribe: Subject<any> = new Subject();

  //allBrandCampaignStatus = new Array <CampaignStatus>();

  //Status for campaign status permission
  countStatus : boolean;

  constructor(private _authService: AuthProvider,private _campaign: CampaignService,
     private app : App, public navParams:  NavParams, public navCtrl: NavController, 
     private _utilityService: UtilityService, private _notificationService: NotificationService,
     public loader: LoaderComponent) {
      this._authService.getUser().then((res) =>
      {
        this.role = res.entityType;
      })
  }

  navigateToChat() {
    this.app.getRootNav().push(MessagingComponent);
  }

  navigateToDetail(id: any, status) {
      if (status == 'drafted' ) {
        this.navCtrl.push(CampaignCreate, {
            campaignId: id
        })
      }
      else {
        this.navCtrl.push(BrandCampaignDetailsPage, {
            campaignId: id
        })
      }
  }

  pop() {
    this.navCtrl.pop();
    }

    // ngOnInit(): void {
        
    //     // this.isLogin = this._authService.isLoggedIn();

    //     // if (!this.isLogin) {
    //     //     this._router.navigateByUrl('ib-login');
    //     // }


    //     this.campaignStatus = {
    //         offsetValue: 0,
    //         limitValue: this.pageSize,
    //         campaignStatus: []
    //     };
    //     this.meta = {
    //         totalCampaigns: 0
    //     }
    //     this.loadCampaignList();
    //     this.loadCampaignStatus();

    // }
    overAllUnreadStatus : boolean = false;
    getChatMessagesStatus(){

        this._notificationService.getChatMessagesStatus().subscribe(
            (res) => {
                this.overAllUnreadStatus = res.overAllUnreadStatus;
                console.log("overAllUnreadStatus", this.overAllUnreadStatus)
               // this.event.publish('overAllUnreadStatus', this.overAllUnreadStatus);
                // console.log('data-------' ,res.overAllUnreadStatus);
            },
            (error) => console.error(error)
        );
    
    }

    doRefresh(refresher) {
        this._authService.getUser().then((res) => {
            this.user = res;
                    //Check status of view campaign list and view status count permissions
                    let viewListStatus = this._utilityService.checkUserPermission(this.user, "campaign_list");
                    this.countStatus = this._utilityService.checkUserPermission(this.user, "campaign_status_count");
                    console.log("thi.viewListStatus", viewListStatus);
                     
                    this.isLoading = true;
                    this.campaignStatus = {
                        offsetValue: 0,
                        limitValue: this.pageSize,
                        campaignStatus: []
                    };
                    this.meta = {
                        totalCampaigns: 0
                    }
                    refresher.complete();
                    //if (!viewListStatus){
                      //  this._router.navigate(['/permission']);
                   // }else {
                        this.loadCampaignList();
                        this.loadCampaignStatus();
                    //}
        });
    }


    ionViewDidEnter() {
        this._authService.getUser().then((res) => {
            this.user = res;
                    //Check status of view campaign list and view status count permissions
                    let viewListStatus = this._utilityService.checkUserPermission(this.user, "campaign_list");
                    this.countStatus = this._utilityService.checkUserPermission(this.user, "campaign_status_count");
                    console.log("thi.viewListStatus", viewListStatus);
                     this.isLoading = true;
            
                    this.campaignStatus = {
                        offsetValue: 0,
                        limitValue: this.pageSize,
                        campaignStatus: []
                    };
                    this.meta = {
                        totalCampaigns: 0
                    }
            
                    //if (!viewListStatus){
                      //  this._router.navigate(['/permission']);
                   // }else {
                        this.loadCampaignList();
                        this.loadCampaignStatus();
                    //}
        });
    }
    ngOnInit(): void {
        this._authService.getUser().then((res)=>{
            this.user = res; 
            //
            this.getChatMessagesStatus();
      
          });
    }
    
    ngOnChanges(changes: SimpleChanges): void {

    }

    // onStart() {
    //     this.start = false;
    //     this.onStarted.emit();
    // }


    loadCampaignStatus() {
       // this.loader.show("Please wait");;
        this._campaign.getBrandCampaignStatus().takeUntil(this.ngUnsubscribe).subscribe(
            (brandCampaignStatus) => {
                this.brandCampaignStatus = brandCampaignStatus;
                // console.log("campaign status", this.brandCampaignStatus);
                //this.loader = false;
               // this.loader.hide();
            })
    }

    limitValue = 5;
    offsetValue = 0;
    // loadCampaignList() {

    //     this._campaign.getInfluencerCampaignList(this.campaignStatus).subscribe(
    //         (influencerCampaignList) => {
    //             this.meta = influencerCampaignList.meta;
    //             this.influencerCampignsList = influencerCampaignList.campaignsList;
    //             this.length  = this.meta.totalCampaigns;
    //             console.log("final campaign list ", this.influencerCampignsList);
    //             this.storeToExport();
    //             this.campaignStatus.offsetValue+= this.campaignStatus.limitValue;

    //         })

    // }

    loadCampaignList() {
       // this.loader.show("Please wait..");
        this._campaign.getBrandCampaignList(this.campaignStatus).takeUntil(this.ngUnsubscribe).subscribe(
            (brandCampaignList) => {
                this.meta = brandCampaignList.meta;
                this.length = this.meta.totalCampaigns;
                this.isLoading = false;
                this.brandCampignsList = brandCampaignList.campaignsList;
                this.totalBudgetSpent = brandCampaignList.totalBudgetSpent;
                //this.loader.hide();
                // console.log("final campaign list ", this.brandCampignsList);
                this.storeToExport();
            });

    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            this._campaign.getBrandCampaignList(this.campaignStatus).subscribe(
                (influencerCampaignList) => {
                   // this.meta = influencerCampaignList.meta;
                //    if (influencerCampaignList.campaignlist) {
                //     for (let i of influencerCampaignList.campaignlist) {
                //         this.influencerCampignsList.push(i);
                //     }
                //    }
                   this.brandCampignsList= this.brandCampignsList.concat(influencerCampaignList.campaignsList);
                    //this.influencerCampignsList.push(influencerCampaignList.campaignsList);
                   // this.length  = this.meta.totalCampaigns;
                    console.log("final campaign list ", this.brandCampignsList);
                    this.storeToExport();
                    this.campaignStatus.offsetValue+= this.campaignStatus.limitValue;
    
                })

                console.log('Async operation has ended');
                infiniteScroll.complete();
        },1000);


    }


    storeToExport() {
        console.log("listObject", this.brandCampignsList);
        this.brandCampignsList.forEach(element => {

            this.objectToExport.push({
                uniqueId: element.uniqueId,
                campaignName: element.name,
                campaignBudgetwas: element.paymentDetails.totalBudget,
                startDate: element.startDate,
                endDate: element.endDate,
                noOfInfluencer: element.noOfInfluencers,
                campaignStatus: element.status,
                paymentStatus: element.paymentStatus,
            });
        });

    }
}
