
import { Component, OnInit, Inject } from '@angular/core';
import { UIService } from "../../../../providers/ui/ui.service";
import { CampaignService } from "../../../../providers/campaign/campaign.service";
import { CampaignReport } from "../../../../models/campaign/campaign.report";
import { InfluencerCampaignListModel } from "../../../../models/campaign/influencer.campaignlist";
import { ReportAttributes } from "../../../../models/campaign/attribute";
import { AuthProvider } from "../../../../providers/auth/auth";
import { User } from "../../../../models/user";
import { InfluencerCampaignSharedData } from "../../../../shared/campaign.influencer.shared";
import { InfluencerReport} from "./report";
import { ConsolidatedReportInfluencer} from "./consolidated.report";
import { LoaderComponent} from '../../../../shared/loader/loader';
import { ChannelReport } from "../../../../models/influencer/channel.report";
import { ModalController, AlertController, NavController ,Platform, NavParams, App } from 'ionic-angular';
@Component({
    selector: 'page-report-main',
    templateUrl: 'report.main.html'
  })


export class InfluencerReportMain implements OnInit {
    isSubmitted = false;
    campaign: InfluencerCampaignListModel = new InfluencerCampaignListModel();

    fb: CampaignReport = new CampaignReport();
    modelReport = new Array<ReportAttributes>();
    insta: CampaignReport = new CampaignReport();
    twitter: CampaignReport = new CampaignReport();
    snapchat: CampaignReport = new CampaignReport();
    linkedin: CampaignReport = new CampaignReport();
    tumblr: CampaignReport = new CampaignReport();
    pinterest: CampaignReport = new CampaignReport();
    utube: CampaignReport = new CampaignReport();
    postUrl = new Array<string>();
    campId: number;
    user: User = new User();


    campaignId : number;
    isIos = false;

    constructor(private _authService: AuthProvider, private _influencerCampaignSharedData : InfluencerCampaignSharedData, public platform: Platform,private _navParams: NavParams,
    public uiService: UIService, private _loader: LoaderComponent,  private _campaignService: CampaignService, private _navCtrl: NavController ) { 
        //this.campaignId = this._navParams.get("campaignId");

        this.isIos = this.platform.is('ios') ? true : false;

    }

    navigateToFbReport() {
        this._influencerCampaignSharedData.set(this.campaign);
        this._navCtrl.push(InfluencerReport, {
            model: this.fb
        })
    }

    navigateToTwitterReport() {
        this._influencerCampaignSharedData.set(this.campaign);
        this._navCtrl.push(InfluencerReport, {
            model: this.twitter
        })
    }

    navigateToInstagramReport() {
        this._influencerCampaignSharedData.set(this.campaign);
        this._navCtrl.push(InfluencerReport, {
            model: this.insta
        })
    }

    navigateToTumblrReport() {
        this._influencerCampaignSharedData.set(this.campaign);
        this._navCtrl.push(InfluencerReport, {
            model: this.tumblr
        })
    }

    navigateToSnapchatReport() {
        this._influencerCampaignSharedData.set(this.campaign);
        this._navCtrl.push(InfluencerReport, {
            model: this.snapchat
        })
    }

    navigateToPinterestReport() {
        this._influencerCampaignSharedData.set(this.campaign);
        this._navCtrl.push(InfluencerReport, {
            model: this.pinterest
        })
    }

    navigateToLinkedInReport() {
        this._influencerCampaignSharedData.set(this.campaign);
        this._navCtrl.push(InfluencerReport, {
            model: this.linkedin
        })
    }

    navigateToYoutubeReport() {
        this._influencerCampaignSharedData.set(this.campaign);
        this._navCtrl.push(InfluencerReport, {
            model: this.utube
        })
    }

    navigateToConsolidated() {
        this._influencerCampaignSharedData.set(this.campaign);
        this._navCtrl.push(ConsolidatedReportInfluencer, {
            campaignId: this.campaignId,
            model: this.campaign
        })
    }


    ionViewDidEnter() {
        this._loader.show("Please wait..")
        this._authService.getUser().then((res)=>{
            this.user = res;
            this.campaignId = this._navParams.get("campaignId");
            let cid = this.campaignId;
            if (cid) {
                this.campId = cid;
                this._campaignService.loadInfluencerCampaignDetails(cid).subscribe(
                    (res) => {
                        this.campaign = res;
                        let channelIds = [];
                        this.getAllCampaigns(this.campaign.socialMediaChannels, cid).then(()=> {
                            this._loader.hide();
                        })
                        console.log("channelIds", channelIds);
                    });
            }
        });
    }

    ngOnInit(): void {

    }

    getAllCampaigns(socialMediaChannels,cid):Promise<any> {
        let promises_array:Array<any> = [];
        let that = this;
        for (let channel of socialMediaChannels) {
            promises_array.push(new Promise(function(resolve,reject) {

                console.log(" tisiss", this)
                that.loadGetCampaignReport(cid, channel.id ).then((data)=> {
                    resolve(true);
                })
            }));
        }
        return Promise.all(promises_array);
    }


    pop() {
        this._navCtrl.pop();
    }

    loadGetCampaignReport(campaignId, channelId):Promise<any> {
        
        let promise = new Promise((resolve, reject)=> {
            this._campaignService.getCampaignReportChannelWise(campaignId, channelId).subscribe(
                (res) => {
    
                    if (res.data.campaignChannelReport.socialMediaChannel.codeName === 'facebook') {
                        this.fb = res.data.campaignChannelReport;
                        this.modelReport = res.data.campaignChannelReport.attributes;
                        console.log("response facebook", this.modelReport);
                    }
                    if (res.data.campaignChannelReport.socialMediaChannel.codeName === 'twitter') {
                        this.twitter = res.data.campaignChannelReport;
                        console.log("response twitter", this.twitter);
                    }
                    if (res.data.campaignChannelReport.socialMediaChannel.codeName === 'instagram') {
                        this.insta = res.data.campaignChannelReport;
                        // console.log("response insta", this.insta);
                        // console.log("response insta direct", res.data);
                        console.log('final ------- ', res.data);
                    }
                    if (res.data.campaignChannelReport.socialMediaChannel.codeName === 'linkedin') {
                        this.linkedin = res.data.campaignChannelReport;
                        console.log("response linkedin", this.linkedin);
                    }
                    if (res.data.campaignChannelReport.socialMediaChannel.codeName === 'pinterest') {
                        this.pinterest = res.data.campaignChannelReport;
                        console.log("response pinterest", this.pinterest);
                    }
                    if (res.data.campaignChannelReport.socialMediaChannel.codeName === 'youtube') {
                        this.utube = res.data.campaignChannelReport;
                        console.log("response utube", this.utube);
                    }
                    if (res.data.campaignChannelReport.socialMediaChannel.codeName === 'tumblr') {
                        this.tumblr = res.data.campaignChannelReport;
                        console.log("response tumblr", this.tumblr);
                    }
                    if (res.data.campaignChannelReport.socialMediaChannel.codeName === 'snapchat') {
                        this.snapchat = res.data.campaignChannelReport;
                        console.log("response snapchat", this.snapchat);
                    }
                    resolve(res);
                });
            // this._campaignService.getCampaignReportChannelWise(449, 2).subscribe(
            //     (res) => {
            //         this.twitter = res.data.campaignChannelReport;
            //         console.log("response facebook", this.twitter);
            //     });
        })
              return promise;
            }
}