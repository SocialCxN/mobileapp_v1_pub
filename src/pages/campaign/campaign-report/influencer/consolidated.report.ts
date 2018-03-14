import { Component, OnInit, Inject , Input} from '@angular/core';
import { UIService } from "../../../../providers/ui/ui.service";
import { CampaignService } from "../../../../providers/campaign/campaign.service";
import { CampaignReport } from "../../../../models/campaign/campaign.report";
import { InfluencerCampaignListModel } from "../../../../models/campaign/influencer.campaignlist";
import { ReportAttributes } from "../../../../models/campaign/attribute";

import { Message, MessageTypes } from "../../../../models/message";
import { AuthProvider } from "../../../../providers/auth/auth";
import { User } from "../../../../models/user";
import { InfluencerCampaignSharedData } from "../../../../shared/campaign.influencer.shared";
import { InfluencerReport} from "./report";
import { LoaderComponent} from '../../../../shared/loader/loader';
import { ChannelReport } from "../../../../models/influencer/channel.report";
import { AllInfluencersReports } from "../../../../models/campaign/allInfluencersReports";
import { Sentiments } from "../../../../models/sentiments";
import { ModalController, AlertController, NavController ,Platform, NavParams, App } from 'ionic-angular';
@Component({
    selector: 'page-consolidated-report',
    templateUrl: 'consolidated.report.html'
  })


export class ConsolidatedReportInfluencer implements OnInit {


    currentURL: string;
    
        campId : number;
        isUser: User = new User();
        redirectUrl: string;
        isLogin: any;
        componentIndex = 4;
        campaign: any;
        currencySymbol: string;
        expandedIndex = -1;
        reports: AllInfluencersReports = new AllInfluencersReports();
        sentiments = new Array<Sentiments>();
        display: string;
        checkSentiments: string;
        selectedSentiments: any;
        obj: any;
        consolidateReportStatus:string;

        isIos =false;

        model: any;
    constructor(private _authService: AuthProvider,private alertCtrl: AlertController, private _influencerCampaignSharedData : InfluencerCampaignSharedData, public platform: Platform,private _navParams: NavParams,
        public _uiService: UIService, private _loader: LoaderComponent,  private _campaignService: CampaignService, private _navCtrl: NavController ) { 
            //this.campaignId = this._navParams.get("campaignId");
    
            this.isIos = this.platform.is('ios') ? true : false;
    
        }

        ngOnInit(): void {
            this.model = this._navParams.get("model");
            this.campId = this._navParams.get("campaignId");
            this.loadReport();
            this.loadSentiments();
            this.obj = { id: '', sentimentsId: '' };
            this.obj.id = this.campId;
    
        }


    pop() {
        this._navCtrl.pop();
    }

    loadReport() {
        console.log("load reporttt")
        this._campaignService.getCampaignConsolidatedReport(this.campId).subscribe(
            (res) => {
                console.log("consolidated response", res);
                this.campaign = res.data.campaignReports.campaign;
                this.reports = res.data.campaignReports.allInfluencersReports[0];
                this.consolidateReportStatus = this.reports.overAllStatus.replace(/_/g, " ");
                this.checkSentiments = res.data.campaignReports.allInfluencersReports[0].allowSentiment;
                console.log("this.checkSentiments",this.checkSentiments);
                
                this.display = res.data.campaignReports.allInfluencersReports[0].influencerCampaignSentiments.displayName;
            });




    }
            
    showDetails(index: number): void {
        this.expandedIndex = index === this.expandedIndex ? -1 : index;
    }
            
    loadSentiments() {

        this._campaignService.getCampaignSentiments().subscribe(
            (res) => {
                this.sentiments = res;
            });




    }

    presentConfirm() {
        let alert = this.alertCtrl.create({
          title: 'Confirm submit report',
          message: 'Are you sure you want to submit this report? Once submitted, report cant be modified.',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                this.onSubmit();
              }
            }
          ]
        });
        alert.present();
      }
            
            
    checkSentiment(obj) {
        console.log("in check sentimentl")
        this.display = obj.displayName;
        this.obj.sentimentsId = obj.id;
        this.selectedSentiments = obj

    }

    onSubmit() {

        console.log("this obj", this.obj);
        
        this._campaignService.saveCampaignSentiments(this.obj).subscribe(
            (res) => {
                console.log("Consolidate report status", res);

               // this.sentiments = res;
                this.checkSentiments = 'no';
                this.reports.allowSentiment = 'no';
                let msg = new Message();
                msg.msg = "Your complete report has been submitted successfully.";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                
                //this._router.navigateByUrl('influencer/campaign/details/' + this.campaign.id);
            },
            (err) => {
                console.log(err);
                let msg = new Message();
                msg.msg = "Sorry, you can't submit your report right now. Please try later.";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
            }
        );




    }
            
}