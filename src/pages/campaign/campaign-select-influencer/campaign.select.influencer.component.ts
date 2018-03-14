import { Component, Input, OnInit, Inject, OnChanges, Output, EventEmitter, SimpleChanges, OnDestroy, } from '@angular/core';
//import { FormControl } from "@angular/forms";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { LoaderComponent} from '../../../shared/loader/loader';
import { UIService } from "../../../providers/ui/ui.service";
import { Message, MessageTypes } from "../../../models/message";
//import { BankDetails } from "../../core/models/payment/bank.details";
import { InfluencerProfile } from "../../../models/influencer/influencer.profile";
import { InfluencerService } from "../../../providers/influencer/influencer.service";
import { Influencer } from "../../../models/influencer/influencer";
import { User } from "../../../models/user";
import { AuthProvider } from "../../../providers/auth/auth";
//import { Router } from "@angular/router";
import { CountryInfo } from "../../../models/location/country.info";
import { Country } from "../../../models/country";
import { SocialMedia } from "../../../models/social-media/social.media";
import { CountryService } from "../../../providers/country/country.service";
import { SocialMediaService } from "../../../providers/socialMedia/social.media.service";
import { AdvanceSearchService } from "../../../providers/influencer/advance.search.service";
import { RatingsList } from "../../../models/influencer/ratings";
import { FollowersCount } from "../../../models/influencer/followers.count";
//import { BrandProfile } from "../../core/models/brand.profile";
import { EngagementList } from "../../../models/influencer/engagement.list";
import { InfluencerSearch } from "../../../models/influencer/influencer.search";
import { CampaignCategory } from "../../../models/campaign/campaign.category";
//import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { City } from "../../../models/city";
//import { WizardService } from "../../../providers/ui/wizard.service";
import { Subject } from "rxjs/Subject";


@Component({
    selector: 'campaign-select-influencer',
    templateUrl: 'campaign.select.influencer.component.html',
})
export class CampaignSelectInfluencerComponent implements OnInit, OnChanges, OnDestroy {

    componentIndex = 5;
    //MultiInput Selection Configuration

    // mySettings: IMultiSelectSettings = {
    //     enableSearch: true,
    //     dynamicTitleMaxItems: 3,
    //     displayAllSelectedText: true
    // };

    mySettings: any;
    // iCountryPlaceholder: IMultiSelectTexts = {
    //     defaultTitle: 'Influencer country',
    // };
    iCountryPlaceholder: any;
    // iCityPlaceholder: IMultiSelectTexts = {
    //     defaultTitle: 'Influencer city',
    // };
    iCityPlaceholder: any;
    // aCountryPlaceholder: IMultiSelectTexts = {
    //     defaultTitle: 'Audience country',
    // };

    aCountryPlaceholder: any;

    @Input() channels: SocialMedia[];
    @Input() influencertype: Array<number>;
    @Input() campaigncategory: Array<CampaignCategory>;
    @Output() offeredInfluencers = new EventEmitter<Array<Influencer>>();


    //Pagination 
    entityId: number = 0;
    length = 100; // total searched records
    pageSize = 25; // by default
    pageSizeOptions = [25, 50, 100];
    upperLimit = 0;

    influencerProfile = new Influencer();
    user: User;
    country = new CountryInfo();
    isLogin: boolean;
    showSearch: boolean = false;

    isEmailAvailable = true;
    isSubmitStarted = false;
    isSubmitted = false;

    countryName: string;
    isCountryValid = true;
    filteredCountries: any;

    influencers = new Array<Influencer>();

    searchObj: InfluencerSearch = new InfluencerSearch();
    resSearchObj: InfluencerSearch = new InfluencerSearch();
    defaultCalled: boolean = false;

    countries: Country[];
    influencerCountries: Country[];

    audienceCountries: Country[];

    influencerCountry = new Array<Country>();
    influencerSelectedCountry = new Array();
    countryNames = new Array<string>();
    audienceCountry = new Array<Country>();

    influencerCity = new Array();
    cityAndState = [];
    cityNames = new Array<string>();

    selectedChannel = new Array<SocialMedia>();
    ratingsList: RatingsList[];
    ratings: RatingsList = new RatingsList();

    followersList: FollowersCount[];
    followers: FollowersCount = new FollowersCount();

    engagementList: EngagementList[];
    selectedEngagementList: EngagementList = new EngagementList();

    //campaignCategory: CampaignCategory[];
    selectedCampaignCategory = new Array<CampaignCategory>();

    moreInterests: any = "Loading";
    isMore: boolean = false;
    sortBy: string;
    orderByName = false;
    orderByFanCount = true;
    orderByRank = true;
    private ngUnsubscribe: Subject<any> = new Subject();



    constructor(
        private _uiService: UIService,
        private _authService: AuthProvider,
        private _countryService: CountryService,
        private _socialMediaService: SocialMediaService,
        private _searchOptionsService: AdvanceSearchService,

        private _loader: LoaderComponent,
         ) {

    }

    ngOnInit(): void {
        console.log("this channels", this.channels);
        this.selectedCampaignCategory = this.campaigncategory;
        this.selectedChannel = this.channels;


        //check if a user is logged in
        // if (!this._authService.isLoggedIn())
        //     this._router.navigateByUrl('ib-login');

        this._authService.getUser().then((res)=>{
            this.user = res;
                    // //check if the user is an influencer
                // if (this.user.entityType === 'brand' || this.user.entityType === 'digital_agency') {

                // } else 
                // this._router.navigateByUrl('home');

                console.log("this is influencer search page");
                
                        this.loadCountries();
                        this.loadSocialMediaChannels();
                        this.loadRatings();
                        this.loadFollowersCount();
                        this.loadSocialEngagementList();
                
                
                        this.searchObj.limitValue = this.pageSize;
                        this.searchObj.offsetValue = 0;
                        this.onSearch();
        });


    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {

        this.moreInterests = '';
    }


    callPaginator(page) {
        console.log("Pagination Object:", page)
        if (page.pageSize) {
            this.pageSize = page.pageSize;
        }
        this.onPageChange(page.pageIndex);
    }

    onPageChange(pageNumber) {
        let offset = 0;
        let limit = this.pageSize

        if (pageNumber) {
            offset = pageNumber * this.pageSize;
            this.upperLimit = pageNumber * this.pageSize + 1;
        }

        offset = pageNumber * this.pageSize;
        offset++;
        console.log('offset', offset, "limit", limit);
        this.searchObj.limitValue = limit;
        this.searchObj.offsetValue = offset;
        this.onSearch();
    }


    onReset() {
        this.influencerCountry = [];
        this.audienceCountry = [];
        this.selectedChannel = [];
        this.followers.displayRange = null;
        this.ratings.codeValue = null;
        this.selectedEngagementList.displayValue = null;
        this.influencerCity = [];
        this.onSearch();
    }

    onInput(){
        this.onSearch();
    }


    isLoading= false;
    onSearch() {
        //this._uiService.showSpinner();
      //  this._loader.show("Please wait");
        this.isLoading =true;
        this.searchObj.fansCountRange = this.followers.codeRange;
        this.searchObj.engagementLevel = this.selectedEngagementList.codeValue;
        this.searchObj.audienceCountry = this.audienceCountry;
        this.searchObj.influencerCountry = this.influencerSelectedCountry;
        this.searchObj.influencerCity = this.influencerCity;
        this.searchObj.influencerRating = this.ratings.codeValue;
        this.searchObj.socialMediaChannel = this.selectedChannel;
        this.searchObj.campaignCategory = this.selectedCampaignCategory;
        this.searchObj.influencerType = this.influencertype;

        console.log('final sending object', this.searchObj);

        this._searchOptionsService.postInfluencerSearch(this.searchObj).takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
               // this._loader.hide();
               this.isLoading =false; 
               this.influencers = res.influencers;
                if (!this.influencers || this.influencers.length < 1) {
                    console.log("no results found");
                    this.onDefaultSearch();
                    return;
                }
                this.defaultCalled = false;
                this.resSearchObj.totalSearchedRows = res.totalSearchedRows;
                this.resSearchObj.offsetValue = res.offsetValue;
                this.resSearchObj.limitValue = res.limitValue;
                this.length = this.resSearchObj.totalSearchedRows;
                console.log("Search Response", this.influencers);
            },
            (err) => {
                console.log(err);

               this.isLoading =false; 
               // this._loader.hide();
                let msg = new Message();
                msg.msg = "Sorry, an error has occured";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
            });


        this.selectedCampaignCategory = [];
        this.searchObj.influencerType = [];
    }

    onDefaultSearch() {
        this.isLoading =true;
        this.searchObj.searchKeyword = "";
        this.searchObj.fansCountRange = null;
        this.searchObj.engagementLevel = null;
        this.searchObj.audienceCountry = [];
        this.searchObj.influencerCountry = [];
        this.searchObj.influencerCity = [];
        this.searchObj.influencerRating = null;
        this.searchObj.socialMediaChannel = [];
        this.searchObj.campaignCategory = [];
        this.searchObj.influencerType = [];

        this.defaultCalled = true;
        console.log('final sending object', this.searchObj);

        this._searchOptionsService.postInfluencerSearch(this.searchObj).takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                this.isLoading =false;
                this.influencers = res.influencers;
                this.resSearchObj.totalSearchedRows = res.totalSearchedRows;
                this.resSearchObj.offsetValue = res.offsetValue;
                this.resSearchObj.limitValue = res.limitValue;
                this.length = this.resSearchObj.totalSearchedRows;
                console.log("Search Response", this.influencers);
            },
            (err) => {
                console.log(err);
                
                this.isLoading =false;
                // this._uiService.hideSpinner();
                let msg = new Message();
                msg.msg = "Sorry, an error has occured";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, "");
            });

    }
    onSearchFocusOut() {

    }

    loadSocialMediaChannels() {
        this._socialMediaService.getChannels().takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                this.channels = res.json().genericResponse.genericBody.data.socialMediaChannels;
                console.log("Available Channels", this.channels);
            },
            (err) => { console.log(err); }
        );
    }

    loadCountries() {
        this._countryService.getCountries().subscribe(
            (res) => {
                this.countries = res.json().genericResponse.genericBody.data.countries;
                this.influencerCountries = res.json().genericResponse.genericBody.data.countries;
                this.audienceCountries = res.json().genericResponse.genericBody.data.countries;
            },
            (err) => { console.log(err); }
        );
    }

    loadCities() {
        this.cityAndState = [];
        this._searchOptionsService.postCountryGetCities(this.influencerSelectedCountry).takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                let cities = res;
                let test = [];
                for (var i = 0; i < cities.length; i++) {
                    test[i] = {
                        id: cities[i].id,
                        name: cities[i].name + ' - ' + cities[i].state.name,
                    }
                }
                this.cityAndState = test;
                console.log("this.cityAndState", this.cityAndState);

            },
            (err) => { console.log(err); }
        );
    }

    loadRatings() {
        this._searchOptionsService.getRatings().subscribe(
            (res) => {
                this.ratingsList = res.json().genericResponse.genericBody.data.ratingsList;
                console.log("this.ratingsList", this.ratingsList);

            },
            (err) => { console.log(err); }
        );
    }

    loadFollowersCount() {
        this._searchOptionsService.getFollowersCount().subscribe(
            (res) => {
                this.followersList = res.json().genericResponse.genericBody.data.followersCountRange;
                console.log("this.followersList", this.followersList);
            },
            (err) => { console.log(err); }
        );
    }

    loadSocialEngagementList() {
        this._searchOptionsService.getSocialEngagementList().subscribe(
            (res) => {
                this.engagementList = res.json().genericResponse.genericBody.data.engagementList;
                console.log("this.engagementList", this.engagementList);
            },
            (err) => { console.log(err); }
        );
    }

    onCountryFocus() {
        this.isCountryValid = true;
    }

    onCountryFocusOut() {
        if (!this.countries) return;
        this.isCountryValid = true;
    }


    onAudienceCountrySelected(audienceCountry) {
        audienceCountry.selected = !audienceCountry.selected;
        let country = this.audienceCountries.filter(p => p.selected);
        this.onSearch();
    }

    onChannelSelected(selectedChannel) {
        selectedChannel.selected = !selectedChannel.selected;
        let channel = this.channels.filter(p => p.selected);

        this.onSearch();
    }

    onFollowerCountSelected(event) {
        let follower = this.followersList.filter(f => f.displayRange === this.followers.displayRange);
        console.log(follower);

        this.followers.id = follower[0].id;
        this.followers.codeRange = follower[0].codeRange;
        console.log("Selected follower is:", follower, " and id is:", this.followers.id);
        this.onSearch();
    }

    onRatingSelected(event) {
        console.log("event", event);
        let rating = this.ratingsList.filter(r => r.codeValue === this.ratings.codeValue);
        this.ratings.id = rating[0].id;
        console.log("Selected rating is:", rating, " and id is:", this.ratings.id);
        this.onSearch();
    }

    onEngagementListSelected(event) {
        let eng = this.engagementList.filter(e => e.displayValue === this.selectedEngagementList.displayValue);
        this.selectedEngagementList.id = eng[0].id;
        console.log("Selected rating is:", eng, " and id is:", this.selectedEngagementList.id);
        this.onSearch();
    }

    onInfluencerCountryChange() {
        console.log(this.influencerSelectedCountry);
        this.countryNames = [];
        for (var i = 0; i < this.influencerSelectedCountry.length; i++) {
            this.influencerCountries.forEach((element) => {
                if (element.id == this.influencerSelectedCountry[i]) {
                    this.countryNames.push(element.name);
                }
            });
        }

        console.log('final names', this.countryNames)
        this.loadCities();
        this.onSearch();
    }

    onInfluencerCityChange() {
        console.log(this.influencerCity);
        this.cityNames = [];
        for (var i = 0; i < this.influencerSelectedCountry.length; i++) {
            this.cityAndState.forEach((element) => {
                if (element.id == this.influencerCity[i]) {
                    this.cityNames.push(element.name);
                }
            });
        }

        console.log('final names', this.cityNames)
        this.onSearch();
    }

    onAudienceCountryChange() {
        console.log(this.audienceCountry);
        this.onSearch();
    }

    onMoreMouseOver(interest) {
        console.log(interest);
        let index = 3;
        let value = {
            names: interest.name
        };

        let finalInterest = [];
        interest.forEach((element, i) => {
            if (i > 3) {
                finalInterest.push(element.name);
            }
        });
        this.moreInterests = finalInterest;
    }

    onSorting(name, order) {
        console.log(order);

        if (name === 'social_name') {
            this.orderByName = !order;
            this.searchObj.sortOrder = order ? 'asc' : 'desc';
        }

        if (name === 't_fans') {
            this.orderByFanCount = !order;
            this.searchObj.sortOrder = order ? 'asc' : 'desc';
        }


        if (name === 'rating') {
            this.orderByRank = !order;
            this.searchObj.sortOrder = order ? 'asc' : 'desc';
        }

        this.searchObj.sortParam = name;
        console.log("this.searchObj", this.searchObj);

        this.onSearch();
    }

    onChangeInfluencer(influencer) {
        let offeredInfluencers = this.influencers.filter(i => i.selected);
        console.log("data selected", offeredInfluencers);
        this.offeredInfluencers.emit(offeredInfluencers);

    }

    checkAll(ev) {
        if (ev.checked) {
            this.influencers.forEach(x => x.selected = true);
            this.offeredInfluencers.emit(this.influencers);
        } else {
            this.influencers.forEach(x => x.selected = false);
            let offeredInfluencers = this.influencers.filter(i => i.selected);
            this.offeredInfluencers.emit(offeredInfluencers);
        }
        // console.log('check All',ev);
        // this.influencers.forEach(x => x.selected = true);
        // this.offeredInfluencers.emit(this.influencers);
    }



}