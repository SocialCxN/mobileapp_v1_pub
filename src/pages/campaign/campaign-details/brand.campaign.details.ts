import { Component, OnInit, Inject, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { User } from "../../../models/user";
import { AuthProvider } from "../../../providers/auth/auth";
import { ModalController, AlertController, NavController, NavParams, App, Events } from 'ionic-angular';
import { Message, MessageTypes } from "../../../models/message";

import { LoaderComponent } from '../../../shared/loader/loader';
import { UIService } from "../../../providers/ui/ui.service";
import { CampaignService } from "../../../providers/campaign/campaign.service";
import { InfluencerCampaignListModel } from "../../../models/campaign/influencer.campaignlist";
import { AcceptDeclineOffer } from "./accept-decline.offer.modal"
import { InfluencerReportMain } from "../../campaign/campaign-report/influencer/report.main"
import { UtilityService } from "../../../providers/general/utility.service";
import { Subject } from 'rxjs/Subject';
import { BrandCampaignListModel } from "../../../models/campaign/brand.campaignlist";
import { CampaignAddInfluencerComponent } from "../campaign-select-influencer/campaign.add.influencer"
@Component({
    selector: 'page-brand-campaign-details',
    templateUrl: 'brand.campaign.details.html'
})
export class BrandCampaignDetailsPage {

    preload: string = 'auto';
    // api: VgAPI;

    isUser: User = new User();
    entityType: string;
    redirectUrl: string;
    isLogin: any;
    //brandDetails: BrandCampaignListModel;
    // brandDetails: BrandCampaignListModel = new BrandCampaignListModel();
    influencerStatus: any;
    descriptionPartOne: string = '';
    readMore: boolean = false;
    isPartTwo: boolean = false;
    descriptionPartTwo: string = '';
    isPayment = true;
    campaignId: number;
    user: User = new User();
    associated: boolean = false;
    _albums = new Array<any>();
    _documents = new Array<any>();
    videos = new Array<any>();
    audios = new Array<any>();
    brandDetails = new BrandCampaignListModel();
    mediaLinksUrl = new Array<any>();
    myVideo: string = "";
    currencySymbol: any;

    //Status for campaign details permissions for brand
    viewReportStatus: boolean = true;
    viewCampaignStatus: boolean = true;
    editCampaignStatus: boolean = true;
    addInfluencerStatus: boolean = true;
    dropInfluencerStatus: boolean = true;
    negotiateInfluencers = new Array<any>();

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(private _navParams: NavParams,
        private event: Events,
        private loader: LoaderComponent, private _navCtrl: NavController, private modalCtrl: ModalController,
        private _campaignService: CampaignService, private utilityService: UtilityService,
        private alertCtrl: AlertController,
        private _uiService: UIService, private _authService: AuthProvider) {

        //this.event.publish('influencer:added');
        event.subscribe('influencer:added', () => {
            // user and time are the same arguments passed in `events.publish(user, time)`
            //console.log('Welcome', user, 'at', time);
            this.campaignId = this._navParams.get("campaignId");
            this.loadBrandCampaignDetails(this.campaignId);
        });
    }

    ngOnInit(): void {
        console.log("brand campaign details");
        this._authService.getUser().then((res) => {
            this.user = res;
            this.currencySymbol = this.user.currency.symbol || null;

            this.campaignId = this._navParams.get("campaignId");
            //this.campaignId = this._navParams.get("campaignId");

            this.loadBrandCampaignDetails(this.campaignId);
            if (this.user.entityType === 'brand') {
                this.viewReportStatus = this.utilityService.checkUserPermission(this.user, "view_campaign_report");
                this.viewCampaignStatus = this.utilityService.checkUserPermission(this.user, "view_campaign_details");
                if (!this.viewCampaignStatus) {
                    //this._router.navigate(['/permission']);
                }
                this.addInfluencerStatus = this.utilityService.checkUserPermission(this.user, "add_campaign_influencer");
                this.dropInfluencerStatus = this.utilityService.checkUserPermission(this.user, "drop_campaign_influencer");
                this.editCampaignStatus = this.utilityService.checkUserPermission(this.user, "edit_campaign_basic_info");
            }
        })

    }

    pop() {
        this._navCtrl.pop();
    }

    loadBrandCampaignDetails(id) {
        console.log("id", id);

        this.loader.show("Please wait");
        this._albums = [];
        this._documents = [];
        this.videos = [];
        this.audios = [];
        this.mediaLinksUrl = [];
        this.negotiateInfluencers = [];
        this._campaignService.getBrandCampaignDetails(id, this.user.entityType).subscribe(
            (res) => {
                this.loader.hide();
                let attachmentFilter = res.campaign.attachments;
                attachmentFilter.filter((element, index) => {
                    if (element.meta.type == "image") {
                        const album = { src: element.thumbnails.large.url, thumb: element.thumbnails.square.url };
                        this._albums.push(album)
                    }
                    if (element.meta.type == "document") {
                        this._documents.push({ extension: element.original.extension, link: element.original.url })
                    }

                    if (element.meta.type == "video") {
                        this.videos.push({ extension: element.encodings.hd.extension, link: element.encodings.hd.url })
                    }
                    if (element.meta.type == "audio") {
                        this.audios.push({ extension: element.original.extension, link: element.original.url })
                    }
                    // this.myVideo = "http://static.videogular.com/assets/videos/videogular.mp4";
                    console.log('videos', this.videos);
                })


                console.log('respnse message', res.campaign.attachments);
                this.brandDetails = res.campaign;
                console.log("this.brandDetails", this.brandDetails);
                this.brandDetails.mediaUrls.forEach(element => {
                    this.mediaLinksUrl.push(element.mediaUrl);
                });

                let brand = this.brandDetails.associated.name.trim();
                if (brand.length < 1) {
                    this.associated = false;
                } else if (brand.length > 0) {
                    this.associated = true;
                }

                //Campaign Description
                if (this.brandDetails.description && this.brandDetails.description.length > 450) {
                    this.readMore = true;
                    this.descriptionPartOne = this.brandDetails.description.substr(0, 450) + '...';
                    this.descriptionPartTwo = this.brandDetails.description;
                } else {
                    this.descriptionPartOne = this.brandDetails.description;
                }

                //Inlfuencer PaymentButtons
                if (this.brandDetails.offeredInfluencers.length > 0) {
                    this.brandDetails.offeredInfluencers.forEach((inf, i) => {
                        console.log('negotiated------', inf);
                        if (inf.paymentDetails.paymentStatus != "-" || inf.paymentDetails.paymentStatus != null) {
                            inf.isPayment = false;
                        }
                        if (inf.hasOwnProperty('negotiationRequests') && inf.negotiationRequests != null) {
                            if (inf.negotiationRequests.negotiationStatus === 'pending') {
                                this.negotiateInfluencers.push(inf);
                            }
                        }
                        if (inf.paymentDetails.paymentPlan.codeName == 'advance' || inf.paymentDetails.paymentPlan.codeName == '30_days' || inf.paymentDetails.paymentPlan.codeName == '60_days' || inf.paymentDetails.paymentPlan.codeName == '90_days') {
                            if (inf.offeredStatus == 'accepted') {
                                inf.paymentBtnText = 'Escrow';
                                inf.isPayment = false;

                            } else if (inf.offeredStatus == 'negotiating') {

                                inf.paymentBtnText = 'Escrow';
                                inf.isPayment = true;


                            } else if (inf.offeredStatus == 'rejected' || inf.offeredStatus == 'cancelled') {

                                inf.paymentBtnText = 'No Payment';
                                inf.isPayment = true;



                            } else if (inf.paymentDetails.paymentPlan.codeName == 'advance' && inf.paymentDetails.paymentPlan.codeName == 'completed') {

                                inf.paymentBtnText = 'Release Payment';
                                inf.isPayment = false;



                            } else if (inf.paymentDetails.paymentPlan.codeName == '30_days' || '60_days' || '90_days' && inf.paymentDetails.paymentPlan.codeName == 'completed') {

                                inf.paymentBtnText = 'Make Payment';
                                inf.isPayment = false;


                            }

                        }
                        else if (inf.paymentDetails.paymentPlan.codeName == 'offline') {


                            inf.paymentBtnText = 'No Payment';
                            inf.isPayment = true;

                        }
                    });

                }
                console.log('neeeeeeeee', this.negotiateInfluencers);
            },
            (err) => {
                console.log("error", err);
                this.loader.hide();
            }
        )


    }

    dropInfluencer(name, index) {
        let alert = this.alertCtrl.create({
            title: 'Drop Influencer',
            message: 'Are you sure you want to drop ' + name + '  from the campaign test campaign',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        let obj = {
                            id: this.brandDetails.id,
                            influencerId: this.brandDetails.offeredInfluencers[index].userDetails.id
                        }

                        this._campaignService.dropInfluencer(obj).subscribe(
                            (res) => {

                                let msg = new Message();
                                msg.msg = "Influencer has been drop successfully";
                                msg.msgType = MessageTypes.Information;
                                msg.autoCloseAfter = 400;
                                this._uiService.presentToast(msg.msg);
                                this.brandDetails.offeredInfluencers.splice(index, 1);
                            },
                            (err) => {
                                console.log(err);
                                let msg = new Message();
                                msg.msg = "Sorry, an error has occured";
                                msg.msgType = MessageTypes.Error;
                                msg.autoCloseAfter = 400;
                                this._uiService.showToast(msg, "");
                            });
                    }
                }
            ]
        });
        alert.present();
    }



    addMoreInfluencers() {
        this._navCtrl.push(CampaignAddInfluencerComponent, {
            campaignId: this.brandDetails.id
        })
    }


}