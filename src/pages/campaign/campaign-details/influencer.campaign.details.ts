import { Component, OnInit, Inject, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { User } from "../../../models/user";
import { AuthProvider } from "../../../providers/auth/auth";
import { ModalController, AlertController, NavController , NavParams, App } from 'ionic-angular';
import { Message, MessageTypes } from "../../../models/message";

import { LoaderComponent} from '../../../shared/loader/loader';
import { UIService } from "../../../providers/ui/ui.service";
import { CampaignService } from "../../../providers/campaign/campaign.service";
import { InfluencerCampaignListModel } from "../../../models/campaign/influencer.campaignlist";
import {AcceptDeclineOffer } from "./accept-decline.offer.modal"
import { InfluencerReportMain } from "../../campaign/campaign-report/influencer/report.main"
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
    selector: 'page-influencer-campaign-details',
    templateUrl: 'influencer.campaign.details.html'
  })
export class InfluencerCampaignDetailsPage {

    isUser: User = new User();
    isLogin: any;
    campaign: InfluencerCampaignListModel = new InfluencerCampaignListModel();
    campaignId: number;
    mediaLinksUrl = new Array<any>();


    descriptionPartOne: string = '';
    readMore: boolean = false;
    isPartTwo: boolean = false;
    descriptionPartTwo: string = '';
    videos = new Array<any>();

    isReject: boolean = false;
    isPending: boolean = false;
    isAccept: boolean = false;
    isNeg: boolean = false;
    _albums = new Array<any>();
    _documents = new Array<any>();

    constructor(private _navParams: NavParams, 
        private loader: LoaderComponent, private _navCtrl: NavController, private modalCtrl: ModalController,
        private photoViewer: PhotoViewer, private _campaignService: CampaignService, 
        private _uiService: UIService, private _authService: AuthProvider) {
        this.campaignId = this._navParams.get("campaignId");
    }

    ngOnInit(): void {
        console.log("influencer campaign details");

        // if (!this.isLogin) {
        //     this._router.navigateByUrl('ib-login');
        // }
        // let id = this.route.snapshot.params['id'];
        // if (id) {
        //     this.campaignId = id;
        //     console.log('id', id);
        //     this.loadInfluencerCampaignDetails();
        // }
        this.campaignId = this._navParams.get("campaignId");
        this.loadInfluencerCampaignDetails();
        console.log('id', this.campaignId);
    }

    pop() {
        this._navCtrl.pop();
    }

    submitReport() {
        this._navCtrl.push(InfluencerReportMain, {
            campaignId : this.campaign.id
        });
    }

    decline() {
        console.log("hellooo")
        let profileModal = this.modalCtrl.create(AcceptDeclineOffer,  {
            action: 'decline',
            campaignId: this.campaign.id,
            brandName: this.campaign.owner.name,
            gCurrency: this.campaign.paymentDetails.currency.symbol,
            grossOffer: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.finalOfferedAmount : '',
            serviceSymbol: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.serviceCharge.serviceChargeType : '',
            serviceCharges: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.serviceCharge.serviceChargeValue : '',
            netOffer: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.earnAmount : '',
            nCurrency: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.currency.symbol : '',
        });
        profileModal.present();

        profileModal.onDidDismiss(data=>{
            this.ngOnInit();
        });
    }

    negotiate() {
        console.log("hellooo")
        let profileModal = this.modalCtrl.create(AcceptDeclineOffer,  {
            action: 'negotiate',
            campaignId: this.campaign.id,
            brandName: this.campaign.owner.name,
            gCurrency: this.campaign.paymentDetails.currency.symbol,
            grossOffer: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.finalOfferedAmount : '',
            serviceSymbol: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.serviceCharge.serviceChargeType : '',
            serviceCharges: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.serviceCharge.serviceChargeValue : '',
            netOffer: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.earnAmount : '',
            nCurrency: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.currency.symbol : '',
        });
        profileModal.present();

        profileModal.onDidDismiss(data=>{
            this.ngOnInit();
        });
    }

    accept() {
        console.log("hellooo")
        let profileModal = this.modalCtrl.create(AcceptDeclineOffer,  {
            action: 'accept',
            campaignId: this.campaign.id,
            brandName: this.campaign.owner.name,
            gCurrency: this.campaign.paymentDetails.currency.symbol,
            grossOffer: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.finalOfferedAmount : '',
            serviceSymbol: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.serviceCharge.serviceChargeType : '',
            serviceCharges: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.serviceCharge.serviceChargeValue : '',
            netOffer: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.earnAmount : '',
            nCurrency: this.campaign.offeredInfluencers[0] ? this.campaign.offeredInfluencers[0].paymentDetails.currency.symbol : '',
        });
        profileModal.present();

        profileModal.onDidDismiss(data=>{
            this.ngOnInit();
        });
      }

    loadInfluencerCampaignDetails() {
        this.loader.show("Please wait..");
        this._campaignService.loadInfluencerCampaignDetails(this.campaignId).subscribe(
            (res) => {
                this.campaign = res;
                console.log("getInfluencerCampaignDetails:", res);
                console.log('campaign details offer', res);
                this.campaign.mediaUrls.forEach(element => {
                    this.mediaLinksUrl.push(element.mediaUrl);
                });

                let attachmentFilter = res.attachments;
                attachmentFilter.filter((element, index) => {
                    if (element.meta.type == "image") {
                        const album = { src: element.thumbnails.large.url, thumb: element.thumbnails.square.url };
                        this._albums.push(album)

                    }
                    if (element.meta.type == "document") {
                        console.log('extension', element.original.url);
                        this._documents.push({ extension: element.original.extension, link: element.original.url })
                    }
                    if (element.meta.type == "video") {
                        this.videos.push({ extension: element.encodings.hd.extension, link: element.encodings.hd.url })
                    }
                })
                if (this.campaign.description && this.campaign.description.length > 450) {
                    this.readMore = true;
                    this.descriptionPartOne = this.campaign.description.substr(0, 450) + '...';
                    console.log("this.descriptionPartOne", this.descriptionPartOne);

                    this.descriptionPartTwo = this.campaign.description;
                } else {
                    this.descriptionPartOne = this.campaign.description;
                }

                this.loader.hide();

                //Disable buttons
                if (this.campaign.offeredInfluencers[0]) {
                    // campaign.status==='rejected' || campaign.status==='completed'
                    if (this.campaign.offeredInfluencers[0].offeredStatus === 'rejected' || this.campaign.offeredInfluencers[0].offeredStatus === 'completed') {
                        this.isReject = true;
                        console.log("The reject button should be disabled");
                    }

                    if (this.campaign.offeredInfluencers[0].offeredStatus === 'rejected' || this.campaign.offeredInfluencers[0].offeredStatus === 'completed') {
                        this.isNeg = true;
                        console.log("The nego button should be disabled");
                    }
                    if (this.campaign.offeredInfluencers[0].offeredStatus === 'rejected' || this.campaign.offeredInfluencers[0].offeredStatus === 'completed') {
                        this.isAccept = true;
                        console.log("The accept button should be disabled");
                    }
                }
            });


    }

    openPicture(url) {
        this.photoViewer.show(url);
    }

}