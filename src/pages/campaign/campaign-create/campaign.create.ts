import { Component, OnInit, Inject, OnDestroy, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NavController, LoadingController, ModalController, AlertController, ActionSheetController, NavParams, App } from 'ionic-angular';
import { AuthProvider } from "../../../providers/auth/auth";
import { LoaderComponent } from '../../../shared/loader/loader';
import { User } from "../../../models/user";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { InfluencerObjective } from "../../../models/influencer/influencer.objective";
import { SocialMedia } from "../../../models/social-media/social.media";
import { PaymentPlans } from "../../../models/payment/payment.plans";
import { Campaign } from "../../../models/campaign/campaign";
import { CampaignCategory } from "../../../models/campaign/campaign.category";
import { Influencer } from "../../../models/influencer/influencer";
import { OfferedInfluencer } from "../../../models/influencer/offered.influencer";
import { Subject } from "rxjs/Subject";
import { UTM } from "../../../models/utm";
import { BrandService } from "../../../providers/brand/brand";
import { Country } from "../../../models/country";
import { RatingsList } from "../../../models/influencer/ratings";
import { FollowersCount } from "../../../models/influencer/followers.count";
import { EngagementList } from "../../../models/influencer/engagement.list";
import { Message, MessageTypes } from "../../../models/message";
import { CountryService } from "../../../providers/country/country.service";
import { AdvanceSearchService } from "../../../providers/influencer/advance.search.service";
import { CampaignTask } from "../../../models/campaign/campaign.task";
import { PriceCalculator } from "../../../models/price.calculator";
import { UtilityService } from "../../../providers/general/utility.service";
import { UIService } from "../../../providers/ui/ui.service";
import { CampaignService } from "../../../providers/campaign/campaign.service";
import { SocialMediaService } from "../../../providers/socialMedia/social.media.service";
import { DateRangeModal } from "./date-range";
import { UtmModal } from "./utm.modal";
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { environment } from '../../../environments/environment';
import { FileModel } from "../../../models/file.model";
import { FilePath } from '@ionic-native/file-path';
import { FileUploadService } from "../../../providers/file/file.upload";
import { EventData } from "../../../providers/file/event.data";
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { Clipboard } from '@ionic-native/clipboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { BrandCampaignListPage } from "../campaign-list/brand-campaignlist"
@Component({
    selector: 'page-campaign-create',
    templateUrl: 'campaign.create.html'
})
export class CampaignCreate {

    page1Color = 'black';
    firstForm: FormGroup;
    thirdForm: FormGroup;

    campaignStartDate: any;
    campaignEndDate: any;
    private campaignDateRange: any = {
        beginDate: { year: 0, month: 0, day: 0 },
        endDate: { year: 0, month: 0, day: 0 }
    };

    dateRange: any;
    currentURL: string;

    brandList: any;
    selectedBrand: any;
    isUser: User = new User();
    entityType: string;
    redirectUrl: string;
    isLogin: any;
    isOther = false;
    stepProcess: Array<number> = [1, 2, 3, 4, 5, 6];
    allObjectives: Array<InfluencerObjective>;
    selectedObjective = [];
    influencerTypes: Array<InfluencerObjective>;

    channels: Array<SocialMedia> = new Array<SocialMedia>();
    counter: number = 0;
    currentStep: number = 0;
    totalSteps: number = 6;
    brandUser: any;
    currencySymbol: string;
    showBounty = false;

    paymentPlans = new Array<PaymentPlans>();
    selectPaymentPlans = new Array<PaymentPlans>();
    paymentName: string;
    selectedPaymentPlan: string;
    campaignCategories = new Array<CampaignCategory>();
    campaignObjectiveIds = new Array<number>();
    campaignInfluencerTypeIds = new Array<number>();
    associatedId: number = 0;
    campaignSocialMediaChannelIds = new Array<number>();
    campaignCategoryIds = new Array<number>();
    selectedCategory = [];
    influencers = new Array<Influencer>();
    finalInfluencers: any;
    offerAmount: string;
    checkOfferAmount: boolean = true;
    offeredInfluencers = new Array<OfferedInfluencer>();
    minCampaignPaymentOffer: number;

    startCampaign: Boolean = true;
    hideMore: Boolean = false;
    campaign = new Campaign();
    referenceUrl = new Array<any>();
    offerInfluencer = new OfferedInfluencer();
    totalBudget: number = 0;
    url1: string;
    url2: string;
    url3: string;
    url4: string;
    url5: string;
    attachCampaign: any;
    mediaLinks = new Array<any>();
    attachmentIds = new Array<any>();
    checkDraft: Boolean = false;
    attachments = new Array<any>();
    files = new Array<any>();
    status: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject();
    disableCreateBtn: boolean = false;
    //Status for campaign operation permissions
    discardStatus: boolean = true;
    isCampaignObjectiveDescriptionError = false;
    model: any;

    constructor(public formBuilder: FormBuilder, private _authService: AuthProvider, private modalCtrl: ModalController,
        private loader: LoaderComponent,
        public eventsdata: EventData,
        private imagePicker: ImagePicker, private clipboard: Clipboard, private iab: InAppBrowser,
        private FilePath: FilePath, private _fileUploadService: FileUploadService,
        private transfer: FileTransfer, private file: File, private camera: Camera, private fileChooser: FileChooser, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController,
        private _utilityService: UtilityService, private _brandService: BrandService, private navCtrl: NavController,
        private navParams: NavParams,
        private _uiService: UIService, private _campaignService: CampaignService, private _socialMediaService: SocialMediaService) {
        this.firstForm = formBuilder.group({
            campaignName: ['', Validators.compose([Validators.required])],
            selectedObjective: [],
            influencerType: [],
            campaignObjectiveDescription: ['', Validators.compose([Validators.required])]
        });

        this.thirdForm = formBuilder.group({
            campaignName: [],
            category: [],
            campaignDateRange: [],
            campaignDescription: ['', Validators.compose([Validators.required])],
            url1: [],
            url2: [],
            url3: [],
            url4: [],
            url5: []
        });
    }

    onCampaignNameFocusIn() {

    }

    onCampaignNameFocusOut() {

    }

    isCampaignDescriptionError = false;
    onCampaignDescriptionFocusIn() {
        this.isCampaignDescriptionError = false;
    }

    onCampaignDescriptionFocusOut() {
        if (!this.thirdForm.controls.campaignDescription.valid) {
            this.isCampaignDescriptionError = true;
        }
    }
    isModalOpen = false;
    onCampaignDateRangeFocusIn() {
        let autocomplete = this.modalCtrl.create(DateRangeModal);
        if (!this.isModalOpen) {
            autocomplete.present();
            this.isModalOpen = true;
        }

        autocomplete.onDidDismiss(data => {

            console.log("Data", data)
            if (data.startDate != undefined && data.endDate != undefined) {
                this.dateRange = data.startDate + " - " + data.endDate;
                this.campaign.campaignStartDate = data.startDate;
                this.campaign.campaignEndDate = data.endDate;
            }

            this.isModalOpen = false;
        })
    }

    isUtmModalOpen = false;
    utmModal(beforeUrl, url) {
        // if (beforeUrl && (beforeUrl.toLocaleLowerCase().indexOf('http') >= 0 ||
        // beforeUrl.toLocaleLowerCase().indexOf('https') >= 0)) {
        if (beforeUrl && (beforeUrl.indexOf('http') >= 0 ||
            beforeUrl.indexOf('https') >= 0)) {
            // beforeUrl = beforeUrl.toLowerCase();
        }
        else if (beforeUrl) {
            // beforeUrl = beforeUrl.toLowerCase();
            beforeUrl = 'http://' + beforeUrl;
        }

        let modal = this.modalCtrl.create(UtmModal, { beforeUrl: beforeUrl })
        if (!this.isUtmModalOpen) {
            modal.present();
            this.isUtmModalOpen = true;
        }
        modal.onDidDismiss(result => {
            this.isUtmModalOpen = false;
            if (url == 'url1') {
                this.url1 = result;
            }
            if (url == 'url2') {
                this.url2 = result;
            }
            if (url == 'url3') {
                this.url3 = result;
            }
            if (url == 'url4') {
                this.url4 = result;
            }
            if (url == 'url5') {
                this.url5 = result;
            }
        })

    }



    onCampaignObjectiveDescriptionErrorFocusIn() {
        this.isCampaignObjectiveDescriptionError = false;
    }

    onCampaignObjectiveDescriptionErrorFocusOut() {
        if (!this.firstForm.controls.campaignObjectiveDescription.valid) {
            this.isCampaignObjectiveDescriptionError = true;
        }
    }

    onUrlFocusOut(url, name) {

        // if (url && (url.toLocaleLowerCase().indexOf('http') >= 0 ||
        //     url.toLocaleLowerCase().indexOf('https') >= 0)) {
        //     url = url.toLowerCase();
        if (url && (url.indexOf('http') >= 0 ||
            url.indexOf('https') >= 0)) {
            // url = url.toLowerCase();
            return;
        }
        else if (url) {
            // url = url.toLowerCase();
            url = 'http://' + url;
        }
        if (name === 'url1') {
            this.url1 = url;
        }
        if (name === 'url2') {
            this.url2 = url;
        }
        if (name === 'url3') {
            this.url3 = url;
        }
        if (name === 'url4') {
            this.url4 = url;
        }
        if (name === 'url5') {
            this.url5 = url;
        }
    }

    ngOnInit(): void {


        // this.isLogin = this._authService.isLoggedIn();
        this._authService.getUser().then((res) => {
            this.brandUser = res;
            //this.model.entityId = this.brandUser.entityId;
            //Check discard campaign status
            if (this.brandUser.entityType === 'brand') {
                this.discardStatus = this._utilityService.checkUserPermission(this.brandUser, "discard_campaign");
            }

            console.log('user on this page', this.brandUser);

            if (this.brandUser.currency) {
                this.currencySymbol = this.brandUser.currency.symbol || null;
            }
            else {
                this.currencySymbol = null;
            }
            this.minCampaignPaymentOffer = this.brandUser.minCampaignPaymentOffer;
            this.entityType = this.brandUser.entityType;

            //checking business user entity
            if (this.entityType === 'digital_agency') {
                this.loadBrandList();
            }

            let status = this._utilityService.checkUserCountSubscription(this.brandUser, 'campaign_create', 'create_campaign')
            // this.status = (status ? ;
            console.log('user status----------', status);

            if (status == "yearly_limit_over") {
                this.disableCreateBtn = true;
                let msg = new Message();
                msg.msg = "Your Yearly limit is over please upgrade your plan.";
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
            }
            else if (status == "monthly_limit_over") {
                this.disableCreateBtn = true;
                let msg = new Message();
                msg.msg = "Your Monthly limit is over.";
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
            }

            // else if (status == "permission_denied") {
            //     this._router.navigateByUrl('permission');
            // }
            // if (status == "show_payment_message") {
            //     this._router.navigateByUrl('brand/subscription');
            // }

            else if (status == "feature_not_avaialble") {
                this.disableCreateBtn = true;
                console.log()
                this.status = true;
                let msg = new Message();
                msg.msg = "Feature Not Available upgrade your plan";
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, "");
            }
            else if (status == "expired_paid_message") {
                this.disableCreateBtn = true;
                let msg = new Message();
                msg.msg = "Your Plan has been expired please upgrade ";
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, "");

                // this._router.navigateByUrl('brand/subscription');
            }
            else if (status == "associated_brand_user") {
                this.status = true;
            }
            else {
                //Initialize a campaign singleton object
                this.campaign = new Campaign();
                this.campaign.id = null;
                this.campaign.associatedId = null;
                this.campaign.campaignObjectiveIds = []
                this.campaign.campaignInfluencerTypeIds = []
                this.campaign.campaignCategoryIds = [];
                this.campaign.campaignStartDate = null;
                this.campaign.campaignEndDate = null;
                this.campaign.campaignName = "";
                this.campaign.campaignDescription = "";
                this.campaign.campaignObjectiveDescription = "";
                this.campaign.campaignReferenceUrls = [];
                this.campaign.offeredInfluencers = [];
                this.campaign.campaignSocialMediaChannelIds = [];
                if (this.brandUser.currency) {
                    this.campaign.currencyId = this.brandUser.currency.id || null;
                }
                else {
                    this.campaign.currencyId = null;
                }

                this.referenceUrl = [{ id: '', link: '' }];
                this.campaign.attachmentIds = [];
                this.campaign.attachments = [];
                this.campaign.campaignMediaLinks = [];

                //Loadbasic configuration  APIs
                this.loadInfluecerTypes();
                this.loadInfluencerObjectives();
                this.loadCampaignCategoryList();
                this.loadSocialMediaChannels();
                this.loadPaymentPlans();
            }
            //getting campaign id if its present in route
            // let id = this.route.snapshot.params['id'];

            let id = this.navParams.get("campaignId");
            if (id) {
                this.currentStep = -1;
                this.loader.show("Please wait");
                this._campaignService.getBrandCampaignDetails(id, this.brandUser.entityType).takeUntil(this.ngUnsubscribe).subscribe(
                    (res) => {

                        console.log('draft respnse message', res.campaign);
                        let draft = res.campaign;
                        //this.attachCampaign = res.campaign;
                        this.loader.hide();

                        this.campaign.id = id;
                        this.campaign.attachmentIds = draft.attachments;
                        this.campaign.attachments = draft.attachments;

                        console.log("this.campaign.attachments", this.campaign.attachments);

                        this.checkDraft = true;
                        this.campaign.associatedId = draft.associated.id;


                        draft.mediaUrls.forEach(e => {
                            this.mediaLinks.push(e.mediaUrl);
                        });


                        this.campaign.campaignMediaLinks = this.mediaLinks



                        if (this.brandList && draft.associated.id) {
                            this.selectedBrand = draft.associated.id;
                        }
                        this.startCampaign = false;
                        this.currentStep = (draft.draftState != null) ? draft.draftState : 5;
                        this.campaign.campaignName = draft.name;
                        if (this.allObjectives && draft.campaignObjectives) {
                            draft.campaignObjectives.forEach(e => {
                                if (e.id === 6) {
                                    this.showBounty = true;
                                    this.loadPaymentPlans();
                                } else {
                                    this.showBounty = false;
                                }
                                this.campaign.campaignObjectiveIds.push(e.id);
                                this.selectedObjective.push(e.id);
                            });
                        }
                        this.campaign.campaignObjectiveDescription = draft.campaignObjectives.otherDescription;
                        if (this.influencerTypes && draft.campaignInfluencerTypes) {
                            draft.campaignInfluencerTypes.forEach(e => {
                                this.campaign.campaignInfluencerTypeIds.push(e.id);
                            });
                            this.influencerTypes.forEach(obj => {
                                let selObj = draft.campaignInfluencerTypes.filter(o => o.id == obj.id);
                                if (selObj.length != 0)
                                    obj.selected = true;
                                else
                                    obj.selected = false;
                            });
                        }
                        if (this.channels && draft.socialMediaChannels) {
                            draft.socialMediaChannels.forEach(e => {
                                this.campaign.campaignSocialMediaChannelIds.push(e.id);
                            });
                            this.channels.forEach(obj => {
                                let selObj = draft.socialMediaChannels.filter(o => o.id == obj.id);
                                if (selObj.length != 0)
                                    obj.selected = true;
                                else
                                    obj.selected = false;
                            });
                        }
                        if (this.campaignCategories && draft.campaignCategories) {
                            let ob = draft.campaignCategories.forEach(e => {
                                this.campaign.campaignCategoryIds.push(e.id);
                                this.selectedCategory.push(e.id);
                            });
                        }
                        //10/21/2017
                        this.campaign.campaignStartDate = draft.startDate;
                        this.campaignDateRange.beginDate.month = draft.startDate.substr(0, 2);
                        this.campaignDateRange.beginDate.day = draft.startDate.substr(3, 2);
                        this.campaignDateRange.beginDate.year = draft.startDate.substr(6, 4);

                        this.campaign.campaignEndDate = draft.endDate;
                        this.campaignDateRange.endDate.month = draft.endDate.substr(0, 2);
                        this.campaignDateRange.endDate.day = draft.endDate.substr(3, 2);
                        this.campaignDateRange.endDate.year = draft.endDate.substr(6, 4);

                        console.log("startDate:", this.campaignDateRange.beginDate);
                        console.log("endDate:", this.campaignDateRange.endDate);

                        this.campaign.campaignDescription = draft.description;
                        draft.referenceUrls.forEach((element, i) => {
                            this.campaign.campaignReferenceUrls.push(element.referenceUrl)
                            if (i == 0) this.url1 = element.referenceUrl;
                            if (i == 1) this.url2 = element.referenceUrl;
                            if (i == 2) this.url3 = element.referenceUrl;
                            if (i == 3) this.url4 = element.referenceUrl;
                            if (i == 4) this.url5 = element.referenceUrl;
                        });
                        let finalUsers = new Array<any>();
                        let offeredInfluencers;
                        draft.offeredInfluencers.forEach((element, i) => {
                            offeredInfluencers = {
                                selected: true,
                                profile: { name: element.socialName, rating: { displayValue: element.ratingId }, profilePic: { thumbnails: { small: { url: element.profilePic.thumbnails.small.url } } } },
                                paymentPlan: element.paymentDetails.paymentPlan.id,
                                initialOfferAmount: element.paymentDetails.initialOfferedAmount,
                                users: { id: element.userDetails.id }
                            }
                            finalUsers.push(offeredInfluencers);
                        });
                        this.influencers = finalUsers;
                        this.onTotalAmount(1, 1);
                    }
                )
            }
        });



    }


    loadBrandList() {
        this._brandService.getDigitalAgencyBrands().subscribe(
            (res) => {
                this.brandList = res.brands;
                console.log("brand list:", this.brandList);
            },
            (err) => { console.log(err); }
        );
    }

    loadInfluecerTypes() {
        this._campaignService.getInfluencerTypes().takeUntil(this.ngUnsubscribe).subscribe(res => {
            this.influencerTypes = res
        });
    }


    loadInfluencerObjectives() {
        this._campaignService.getCampaignObjectives().takeUntil(this.ngUnsubscribe).subscribe(res => {
            this.allObjectives = res
        });
    }

    loadCampaignCategoryList() {

        this._campaignService.getCampaignCategoryList().takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                this.campaignCategories = res.json().genericResponse.genericBody.data.campaignCategories;
            },
            (err) => { console.log(err); }
        );

    }

    loadPaymentPlans() {
        // this._campaignService.getPaymentPlans().takeUntil(this.ngUnsubscribe).subscribe(res => {
        //     this.paymentPlans = res.paymentPlans;
        //     this.selectPaymentPlans = res.paymentPlans;
        // });

        this.paymentPlans = [];
        console.log('payment plans array ', this.paymentPlans);
        if (this.showBounty === false) {

            this._campaignService.getPaymentPlans().takeUntil(this.ngUnsubscribe).subscribe(res => {
                res.paymentPlans.forEach(element => {
                    if (element.codeName !== 'bounty') {
                        this.paymentPlans.push(element);
                        this.selectPaymentPlans = element;
                    }
                });

            });
        }
        else {
            this._campaignService.getPaymentPlans().takeUntil(this.ngUnsubscribe).subscribe(res => {
                res.paymentPlans.forEach(element => {
                    if (element.codeName === 'bounty') {
                        this.paymentPlans.push(element);
                        this.selectPaymentPlans = element;
                    }
                });

            });
        }
    }

    loadSocialMediaChannels() {

        this._socialMediaService.getChannels().takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                let allchannels;
                this.channels = [];
                allchannels = res.json().genericResponse.genericBody.data.socialMediaChannels;
                allchannels.forEach(obj => {
                    let channel = new SocialMedia();
                    channel.codeName = obj.codeName;
                    channel.displayName = obj.displayName;
                    channel.id = obj.id;
                    channel.selected = false;
                    this.channels.push(channel);
                })
            },
            (err) => { console.log(err); }
        );

    }

    onChangeObjective(obj) {
        console.log("on changessss", obj);
        this.campaign.campaignObjectiveIds = obj;

        // // to check value of bounty exists in an array or not

        const check = obj.indexOf(6);
        if (check === 1 || check === 0 || obj === 6) {
            this.campaign.campaignObjectiveIds = [6];
            this.selectedObjective = [6];
            this.paymentPlans = new Array<PaymentPlans>();
            this._campaignService.getPaymentPlans().takeUntil(this.ngUnsubscribe).subscribe(res => {
                res.paymentPlans.forEach(element => {
                    if (element.codeName === 'bounty') {
                        this.paymentPlans = [];
                        this.paymentPlans.push(element);
                        this.selectPaymentPlans = element;
                        console.log('in bounty ', this.paymentPlans);
                    }
                });
            });

            // Campaign minimum offer amount has been changed here by Ramsha on 08/02/2018
            this.minCampaignPaymentOffer = 1;
            this.showBounty = true;
        } else {
            this.minCampaignPaymentOffer = this.brandUser.minCampaignPaymentOffer;
            this.showBounty = false;
            this.loadPaymentPlans();
        }

        this.isOther = false;
        this.campaign.campaignObjectiveIds.forEach(element => {
            if (element == 5) {
                this.isOther = true;
                // if (this.campaign.campaignObjectiveDescription) return;
            }
        });
    }


    onChangeType(type) {
        console.log("typess are", type);
        let influencerTypes = type;
        let influencerTypeIds = [];
        influencerTypeIds = influencerTypes.map(o => o.id)
            .filter((e, i, a) => a.indexOf(e) === i);
        this.campaign.campaignInfluencerTypeIds = influencerTypeIds;
        console.log("influencerTypeIds are", influencerTypeIds);
    }

    onCategorySelected(selectedCategory) {
        this.campaign.campaignCategoryIds = selectedCategory;
    }
    
    back() {
        if (this.currentStep > 1) {
            --this.currentStep;
        }
    }

    next() {
        this.loader.show("Please wait..")
        if (this.currentStep == 1) {
            console.log(this.campaign.campaignInfluencerTypeIds.length);
            let cname = "";
            if (this.campaign.campaignName)
                cname = this.campaign.campaignName.trim();

            if (this.isOther) {
                console.log("this.isOther", this.isOther);

                let obj = "";
                console.log("this.campaign.campaignObjectiveDescription", this.campaign.campaignObjectiveDescription);
                if (this.campaign.campaignObjectiveDescription.length < 1) {
                    // this.validationError("Please add objective description");
                    let msg = new Message();
                    msg.msg = "Please add objective description";
                    msg.msgType = MessageTypes.Error;
                    msg.autoCloseAfter = 400;
                    this._uiService.presentToast(msg.msg);
                    this.loader.hide();
                    return;
                }
                if (this.campaign.campaignObjectiveDescription) {
                    obj = this.campaign.campaignObjectiveDescription.trim();
                    if (obj.length < 1) {
                        // this.validationError("Please select objective description");
                        let msg = new Message();
                        msg.msg = "Please select objective description";
                        msg.msgType = MessageTypes.Error;
                        msg.autoCloseAfter = 400;
                        this._uiService.presentToast(msg.msg);
                        this.loader.hide();
                        return;
                    }
                }
            }
            if (cname.length < 1 || this.campaign.campaignName == "" || this.campaign.campaignObjectiveIds.length < 1 || this.campaign.campaignInfluencerTypeIds.length < 1) {
                //this.validationError("Please fill the required fields");
                let msg = new Message();
                msg.msg = "Please fill the required fields";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                this.loader.hide();
                return;
            }
        }
        if (this.currentStep == 2) {
            console.log(this.campaign.campaignSocialMediaChannelIds.length);

            if (this.campaign.campaignSocialMediaChannelIds.length < 1) {
                // this.validationError("Please select any one social channel ");
                let msg = new Message();
                msg.msg = "Please select any one social channel";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                this.loader.hide();
                return;
            }
        }
        if (this.currentStep == 3) {

            let description = this.campaign.campaignDescription.trim();
            console.log("campaign categories id", this.campaign.campaignCategoryIds, this.campaign.campaignCategoryIds.length);
            console.log("this.campaign.startdate", this.campaign.campaignStartDate)
            console.log("this.campaign.enddate", this.campaign.campaignEndDate)
            console.log("Description", description, description.length);
            if (this.campaign.campaignCategoryIds.length < 1 || this.campaign.campaignStartDate == null || this.campaign.campaignEndDate == null || description.length < 1) {
                let msg = new Message();
                msg.msg = "Please fill the required fields";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                this.loader.hide();
                return;
            }
        }
        if (this.currentStep == 5) {

            if (this.influencers.length < 1) {
                let msg = new Message();
                msg.msg = "Please select atleast one influencer";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                this.loader.hide();
                return;
            }
            if (this.showBounty) {
                const autoSelectPayment = {
                    value: 6
                };
                this.onTopPaymentSelected(autoSelectPayment);
            }
        }
        if (this.currentStep == 6) {

            if (this.influencers.length < 1) {
                let msg = new Message();
                msg.msg = "Please select atleast one influencer";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                this.loader.hide();
                return;
            }
        }

        if (this.currentStep < this.totalSteps) {
            let oldIndex = this.currentStep++;

        }

        this.saveDraft(0);
        console.log('next....', this.currentStep);

    }

    // On 6th step of campaign, getting selected payment plan from the top right
    onTopPaymentSelected(event) {
        this.influencers.forEach(i => {
            if (!i.paymentPlan || i.paymentPlan === '') {
                i.paymentPlan = event.value;
            } else if (i.paymentPlan === this.paymentName) {
                i.paymentPlan = event.value;
            }
        });

        this.paymentName = event.value;
    }

    discard() {


        let alert = this.alertCtrl.create({
            title: 'Discard Campaign',
            message: 'Do you want to discard this campaign?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Discard',
                    handler: () => {
                        this._campaignService.discardCampaign(this.campaign.id).subscribe(
                            (res) => {
                                let msg = new Message();
                                msg.msg = "Campaign has been discarded successfully";
                                msg.msgType = MessageTypes.Information;
                                msg.autoCloseAfter = 400;
                                this._uiService.presentToast(msg.msg);
                                this.navCtrl.pop();
                            },
                            (err) => {
                                console.log(err);
                                let msg = new Message();
                                msg.msg = "Sorry, Its a Start of Campaign, it cannot be Discarded right now";
                                msg.msgType = MessageTypes.Error;
                                msg.autoCloseAfter = 400;
                                this._uiService.presentToast(msg.msg);
                            })
                    }
                }
            ]
        });
        alert.present();


    }


    saveDraft(flag) {
        console.log("in xcodeeee testinnggg")
        if (this.checkDraft == true) {
            console.log('draft', this.campaign.attachmentIds);
        }

        // let _tempAttachment = new Array<any>();
        // if (this.campaign.attachmentIds.length > 0) {
        //     this.campaign.attachmentIds.forEach(element => {

        //         if (element.hasOwnProperty("fileId")) {
        //             console.log('eeeeee ----', element.fileId);
        //             _tempAttachment.push(element.fileId);
        //             this.campaign.attachmentIds = _tempAttachment;

        //         }
        //     })


        // }


        if (!this.campaign.id) {
            this.campaign.id = null;
        }
        this.campaign.campaignReferenceUrls = [];
        this.campaign.draftState = this.currentStep.toString();

        if (this.url1) {
            this.campaign.campaignReferenceUrls.push(this.url1);
        }
        if (this.url2) {
            this.campaign.campaignReferenceUrls.push(this.url2);
        }
        if (this.url3) {
            this.campaign.campaignReferenceUrls.push(this.url3);
        }
        if (this.url4) {
            this.campaign.campaignReferenceUrls.push(this.url4);
        }
        if (this.url5) {
            this.campaign.campaignReferenceUrls.push(this.url5);
        }


        let finalUsers = this.influencers.filter(i => i.selected);
        let temp = new Array<any>();
        finalUsers.forEach(element => {

            let tempInfluencer = { id: null, currencyId: null, initialOfferAmount: 0, paymentPlanId: null }
            if (element.initialOfferAmount && element.initialOfferAmount != null) {
                tempInfluencer.initialOfferAmount = +element.initialOfferAmount;
            }
            console.log("element.........", element);

            tempInfluencer.id = element.users[0].id; //it requires influencer user_id not entity_id
            tempInfluencer.currencyId = this.brandUser.currency.id;
            tempInfluencer.paymentPlanId = element.paymentPlan;
            temp.push(tempInfluencer);
        });
        this.campaign.offeredInfluencers = temp;
        console.log('final users for sending', this.campaign.offeredInfluencers);

        this._campaignService.postCampaignDraft(this.campaign, this.entityType).takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                console.log("in success campaign post draft before load");
                //this._uiService.hideSpinner();
                let msg = new Message();
                this.loader.hide();
                console.log("in success campaign post draft be load");
                msg.msg = "Your work has been saved";
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                this.campaign.id = res.json().genericResponse.genericBody.data.id;
                // this.model.id = this.campaign.id;
                if (flag == 1 && this.entityType === 'brand') {
                    //this._router.navigateByUrl('brand/campaign/list');
                }
                //if (flag == 1 && this.entityType === 'digital_agency') this._router.navigateByUrl('home');
            },
            (err) => {
                console.log(err);
                this.loader.hide();
                this._uiService.hideSpinner();
                let msg = new Message();
                msg.msg = "Sorry, an error has occured";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
            })
        // // this.allObjectives = this.allObjectives.filter(obj => obj.selected);
        // console.log("selected objectives", this.campaignObjectiveIds);
        // console.log("campaign object", this.campaign);
    }

    create() {
        this.currentStep = 1;
    }

    allChannels: Array<SocialMedia> = new Array<SocialMedia>();
    onChangeChannel(channel: SocialMedia) {
        this.allChannels = this.channels.filter(channel => channel.selected);
        console.log("data selected", channel);
        let socialChannelsList = [];
        socialChannelsList = this.allChannels.map(o => o.id)
            .filter((e, i, a) => a.indexOf(e) === i);
        this.campaign.campaignSocialMediaChannelIds = socialChannelsList;

        console.log("data selected", this.campaign.campaignSocialMediaChannelIds);
        //this.onSocialChannelChanged.emit(this.allChannels);
    }


    fileIds = new Array<number>();

    displayFiles = new Array<FileModel>();
    uploadFiles() {
        this.loader.show("Please wait while files are uploading");
        this._fileUploadService.uploadCampaignAttachment(this.files, { campaignName: this.campaign.campaignName, id: this.campaign.id, entityId: this.brandUser.entityId }).then((res) => {

            let uploadedFiles = res;
            //  res.json().genericResponse.genericBody.data.userData;
            console.log("uploaded files", uploadedFiles);
            let count = 0;
            for (let i of uploadedFiles) {
                let res = JSON.parse(i.response);
                this.displayFiles.push(this.files[0]);
                this.files.splice(count, 1);
                //.json().genericResponse.genericBody.data.attachment;
                this.fileIds.push(res.genericResponse.genericBody.data.attachment.fileId);
            }
            this.campaign.attachmentIds = this.fileIds;
            let msg = new Message();
            msg.msg = "Files have been uploaded successfully";
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.presentToast(msg.msg);
            console.log("file ids", this.fileIds)

            this.loader.hide();
        }, (err) => {
            console.log("err", err);
            this.loader.hide();
        });
    }
    openActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Take action',
            buttons: [
                {
                    text: 'Camera',
                    role: 'Camera',
                    handler: () => {
                        const options: CameraOptions = {
                            quality: 100,
                            destinationType: this.camera.DestinationType.DATA_URL,
                            encodingType: this.camera.EncodingType.JPEG,
                            mediaType: this.camera.MediaType.PICTURE,
                            sourceType: this.camera.PictureSourceType.CAMERA
                        }
                        this.camera.getPicture(options).then((imageData) => {
                            // imageData is either a base64 encoded string or a file URI
                            // If it's base64:
                            let base64Image = 'data:image/jpeg;base64,' + imageData;
                            let file: FileModel = new FileModel();
                            file.data = base64Image;
                            file.type = 'image';
                            file.mimeType = 'image/jpeg';
                            this.files.push(file);
                            //this._fileUploadService.uploadCampaignReportFiles(this.files, this.model);

                        }, (err) => {
                            // Handle error
                        });
                    }
                },
                {
                    text: 'Gallery',
                    handler: () => {
                        const options: ImagePickerOptions = {
                            quality: 100,
                            maximumImagesCount: 10,
                            outputType: 0
                        }
                        this.imagePicker.getPictures(options).then((results) => {
                            for (var i = 0; i < results.length; i++) {
                                console.log('Image URI: ' + results[i]);
                                this.eventsdata.makeFileIntoBlob(results[i], 'jpeg', "image/jpeg").then((fileblob) => {
                                    //console.log("blob", fileblob);
                                    let file: FileModel = new FileModel();
                                    file.data = fileblob;
                                    file.type = 'image';
                                    file.mimeType = 'image/jpeg';
                                    this.files.push(file);
                                })
                                // let base64Image = 'data:image/jpeg;base64,' + results[i];
                                // let file : FileModel = new FileModel();
                                // file.data = results[i];
                                // file.type = 'image';
                                // this.files.push(file);
                            }
                        }, (err) => {
                            console.log("err in picking images", err);
                        });
                    }
                },
                {
                    text: 'Document',
                    role: 'Document',
                    handler: () => {
                        console.log('Cancel clicked');
                        this.fileChooser.open()
                            .then((uri) => {
                                console.log(uri)
                                // let file : FileModel = new FileModel();
                                // file.data = uri;
                                // file.type = 'pdf';
                                // this.files.push(file);

                                this.FilePath.resolveNativePath(uri).then((fileentry) => {
                                    let filename = this.eventsdata.getfilename(fileentry);
                                    let fileext = this.eventsdata.getfileext(fileentry);

                                    if (fileext == "pdf") {
                                        this.eventsdata.makeFileIntoBlob(fileentry, fileext, "application/pdf").then((fileblob) => {
                                            console.log("blob", fileblob);
                                            let file: FileModel = new FileModel();
                                            file.data = fileblob;
                                            file.type = 'pdf';
                                            file.mimeType = 'application/pdf';
                                            this.files.push(file);
                                        })
                                    }

                                    if (fileext == "docx") {
                                        this.eventsdata.makeFileIntoBlob(fileentry, fileext, "application/vnd.openxmlformats-officedocument.wordprocessingml.document").then((fileblob) => {
                                            console.log("blob", fileblob);
                                            let file: FileModel = new FileModel();
                                            file.data = fileblob;
                                            file.type = 'doc';
                                            file.mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                                            this.files.push(file);
                                        })
                                    }


                                    if (fileext == "doc") {
                                        this.eventsdata.makeFileIntoBlob(fileentry, fileext, "application/msword").then((fileblob) => {
                                            console.log("blob", fileblob);
                                            let file: FileModel = new FileModel();
                                            file.data = fileblob;
                                            file.type = 'doc';
                                            file.mimeType = "application/msword";
                                            this.files.push(file);
                                        })
                                    }

                                    if (fileext == "xlsx") {
                                        this.eventsdata.makeFileIntoBlob(fileentry, fileext, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").then((fileblob) => {
                                            console.log("blob", fileblob);
                                            let file: FileModel = new FileModel();
                                            file.data = fileblob;
                                            file.type = 'xls';
                                            file.mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                                            this.files.push(file);
                                        })
                                    }


                                    if (fileext == "mp4") {
                                        this.eventsdata.makeFileIntoBlob(fileentry, fileext, "video/mp4").then((fileblob) => {
                                            console.log("blob", fileblob);
                                            let file: FileModel = new FileModel();
                                            file.data = fileblob;
                                            file.type = 'video';
                                            file.mimeType = "video/mp4";
                                            this.files.push(file);
                                        })
                                    }

                                })
                            })
                            .catch(e => console.log(e));
                    }
                }
            ]
        });

        actionSheet.present();
    }


    medialink: string;
    medialinksUrl = new Array<string>();
    addItem() {
        // if (this.medialink && (this.medialink.toLocaleLowerCase().indexOf('http') >= 0 ||
        // this.medialink.toLocaleLowerCase().indexOf('https') >= 0)) { 
        if (this.medialink && (this.medialink.indexOf('http') >= 0 ||
            this.medialink.indexOf('https') >= 0)) {
            // this.medialink = this.medialink.toLowerCase();
            this.medialinksUrl.push(this.medialink);
            this.medialink = "";
            return;
        }
        else if (this.medialink) {
            // this.medialink = this.medialink.toLowerCase();
            this.medialink = 'http://' + this.medialink;
            this.medialinksUrl.push(this.medialink);
            this.medialink = "";
        }
        //this.mediaLinks.emit(this.medialinksUrl);
        this.recieveMediaLinks(this.medialinksUrl);
        console.log("final url", this.medialinksUrl);
    }


    removeLink(index) {
        if (index !== -1) {
            this.medialinksUrl.splice(index, 1);
        }
    }

    recieveMediaLinks(mediaLinks) {
        console.log('final links for upload', mediaLinks);
        this.campaign.campaignMediaLinks = mediaLinks;
        //console.log('final upload ids ', fileIds);

    }



    finalOfferedInfluencers(selectedInfluencer) {
        this.influencers = selectedInfluencer;
        console.log('final offered influencers from parent', this.influencers);
    }


    onPaymentSelected(paymentSelected) {
        console.log('payment selected', paymentSelected);

        this.influencers.forEach(i => {
            if (!i.paymentPlan || i.paymentPlan === '')
                i.paymentPlan = paymentSelected.id;
        });
        console.log('total influencers', this.influencers);

    }

    onTotalAmount(initialAmount, minAmount) {


        if (this.showBounty === true) {
            minAmount = 1;
        }

        if (initialAmount < minAmount) {
            this.checkOfferAmount = false;
            return;
        }

        this.checkOfferAmount = true;
        let finalInfluencer = this.influencers.filter(i => i.selected);

        this.totalBudget = 0;
        finalInfluencer.forEach(i => {

            if (i.initialOfferAmount && i.initialOfferAmount !== '' && i.hasOwnProperty('initialOfferAmount')) {
                this.totalBudget += +i.initialOfferAmount;
                console.log('budget', this.totalBudget);
                return;
            } else {
                this.totalBudget = 0;
            }
        })

    }

    createCampaign() {
        let finalUsers = this.influencers.filter(i => i.selected);
        if (finalUsers.length < 1) {
            let msg = new Message();
            msg.msg = "Oops! You haven't selected any influencer";
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.presentToast(msg.msg);
            return;
        }

        let temp = new Array<any>();

        try {

            finalUsers.forEach(element => {
                if (!element.initialOfferAmount || element.initialOfferAmount == null || !element.paymentPlan) {
                    let msg = new Message();
                    msg.msg = "Please fill the required fields";
                    msg.msgType = MessageTypes.Error;
                    msg.autoCloseAfter = 400;
                    this._uiService.presentToast(msg.msg);
                    throw new Error('invalid');
                }

                if (element.initialOfferAmount && +element.initialOfferAmount < this.minCampaignPaymentOffer) {
                    console.log("element.initialOfferAmount", element.initialOfferAmount);
                    let msg = new Message();
                    msg.msg = "Your offer amount should not be less than minimum offer";
                    msg.msgType = MessageTypes.Error;
                    msg.autoCloseAfter = 400;
                    this._uiService.presentToast(msg.msg);
                    throw new Error('invalid');
                }

                let tempInfluencer = { id: null, currencyId: null, initialOfferAmount: 0, paymentPlanId: null }
                if (element.initialOfferAmount && element.initialOfferAmount != null) {
                    tempInfluencer.initialOfferAmount = +element.initialOfferAmount;
                }
                // tempInfluencer.id = element.profile.id;
                //CHANGE BY RAMSHA
                tempInfluencer.id = element.users[0].id;
                tempInfluencer.currencyId = this.brandUser.currency.id;
                // tempInfluencer.initialOfferAmount = element.initialOfferAmount;
                tempInfluencer.paymentPlanId = element.paymentPlan;
                temp.push(tempInfluencer);
            });


            this.campaign.offeredInfluencers = temp;
            console.log('final users for sending', this.campaign.offeredInfluencers);
            this.saveCampaign();

        } catch (e) {
            if (e == 'invalid') {
                console.log('validation error');
            }

        }

    }


    saveCampaign() {
        this.loader.show("Please wait..")
        this._campaignService.createCampaign(this.campaign, this.entityType).takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                let msg = new Message();
                msg.msg = "Your campaign has been created successfully";
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, "info");
                console.log("res", res);
                this.loader.hide();
                if (res.feature) {
                    let feature = res.feature;
                    this.brandUser.subscription.plan.features.forEach(element => {
                        if (element.codeName === 'campaign_create') {
                            element.allowedValue = feature.allowedValue;
                            element.availableValue = feature.availableValue;
                            element.monthWiseAllowedValue = feature.monthWiseAllowedValue;
                            element.monthWiseAvailableValue = feature.monthWiseAvailableValue;
                            console.log("feature found", element);
                        }
                    });
                    this._authService.storeUser(this.brandUser);
                    console.log("after creating camapaign", this._authService.getUser());

                }

                if (this.entityType === 'brand') {
                    this.navCtrl.push(BrandCampaignListPage)
                } else if (this.entityType === 'digital_agency') {
                    // this._router.navigateByUrl('da/campaign/list');
                }
            },
            (err) => {
                this.loader.hide();
                console.log(err);
                let msg = new Message();
                msg.msg = "Sorry, an error has occured";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, "");
            })


    }
}