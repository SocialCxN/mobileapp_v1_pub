import { Component, OnInit, Inject, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { NavController , NavParams, App } from 'ionic-angular';
import { AuthProvider } from "../../../providers/auth/auth";
import { LoaderComponent} from '../../../shared/loader/loader';
import { User } from "../../../models/user";
import { InfluencerCampaignListModel } from "../../../models/campaign/influencer.campaignlist";
import { CampaignStatus } from "../../../models/campaign/campaign.status";
import { CampaignService } from "../../../providers/campaign/campaign.service";
import {InfluencerCampaignDetailsPage } from "../campaign-details/influencer.campaign.details";
@Component({
  selector: 'page-influencer-campaignlist',
  templateUrl: 'influencer-campaignlist.html'
})
export class InfluencerCampaignListPage {
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
  influencerCampignsList = new Array<InfluencerCampaignListModel>();
  objectToExport = new Array<any>();

  constructor(private _authService: AuthProvider,private _campaign: CampaignService,
     private app : App, public navParams:  NavParams, public navCtrl: NavController, public loader: LoaderComponent) {
      this._authService.getUser().then((res) =>
      {
        this.role = res.entityType;
      })
  }

  navigateToDetail(id: any) {
      this.navCtrl.push(InfluencerCampaignDetailsPage, {
          campaignId: id
      })
  }

  pop() {
    this.navCtrl.pop();
    }

    ionViewDidEnter() {
        this.campaignStatus = {
            offsetValue: 0,
            limitValue: this.pageSize,
            campaignStatus: []
        };
        this.meta = {
            totalCampaigns: 0
        }
        this.loadCampaignList();
        this.loadCampaignStatus();
    }

    ngOnInit(): void {
        
        // this.isLogin = this._authService.isLoggedIn();

        // if (!this.isLogin) {
        //     this._router.navigateByUrl('ib-login');
        // }




    }
    ngOnChanges(changes: SimpleChanges): void {

    }

    // onStart() {
    //     this.start = false;
    //     this.onStarted.emit();
    // }


    loadCampaignStatus() {
        this.loader.show("Please wait..");
        this._campaign.getInfluncerCampaignStatus().subscribe(
            (influencerCampaignStatus) => {
                this.influencerCampaignStatus = influencerCampaignStatus;
                console.log("campaign status", this.influencerCampaignStatus);
                this.loader.hide();
            })
    }

    limitValue = 5;
    offsetValue = 0;
    loadCampaignList() {

        this._campaign.getInfluencerCampaignList(this.campaignStatus).subscribe(
            (influencerCampaignList) => {
                this.meta = influencerCampaignList.meta;
                this.influencerCampignsList = influencerCampaignList.campaignsList;
                this.length  = this.meta.totalCampaigns;
                console.log("final campaign list ", this.influencerCampignsList);
                this.storeToExport();
                this.campaignStatus.offsetValue+= this.campaignStatus.limitValue;

            })

    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            this._campaign.getInfluencerCampaignList(this.campaignStatus).subscribe(
                (influencerCampaignList) => {
                   // this.meta = influencerCampaignList.meta;
                //    if (influencerCampaignList.campaignlist) {
                //     for (let i of influencerCampaignList.campaignlist) {
                //         this.influencerCampignsList.push(i);
                //     }
                //    }
                   this.influencerCampignsList= this.influencerCampignsList.concat(influencerCampaignList.campaignsList);
                    //this.influencerCampignsList.push(influencerCampaignList.campaignsList);
                   // this.length  = this.meta.totalCampaigns;
                    console.log("final campaign list ", this.influencerCampignsList);
                    this.storeToExport();
                    this.campaignStatus.offsetValue+= this.campaignStatus.limitValue;
    
                })

                console.log('Async operation has ended');
                infiniteScroll.complete();
        },1000);


    }


    storeToExport() {
        console.log("listObject", this.influencerCampignsList);
        this.influencerCampignsList.forEach(element => {

            
            this.objectToExport.push({
                uniqueId: element.uniqueId,
                campaignName: element.name,
                campaignBrandName: element.owner.name,
                earnAmount : element.offeredInfluencers[0].paymentDetails.earnAmount,
                startDate: element.startDate,
                endDate: element.endDate,
                campaignStatus: element.status,
                paymentStatus: element.paymentStatus,
            });
        });

    }
}
