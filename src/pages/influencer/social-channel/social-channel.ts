import { Component, OnInit, Inject, Output, EventEmitter, OnChanges, SimpleChanges, Input } from '@angular/core';

import { NavController, NavParams, App, Platform } from 'ionic-angular';
import { AuthProvider } from "../../../providers/auth/auth";
import { SocialMediaService } from "../../../providers/socialMedia/social.media.service";
import { FBService } from "../../../providers/socialMedia/facebook.service";
import { SocialMedia } from "../../../models/social-media/social.media";
import { FacebookPageInfo } from "../../../models/social-media/fb.page.info";
import { SocialStats } from "../../../models/social-media/social.stats";
import { FacebookPagekeys } from "../../../models/social-media/fb.page.keys";
import { Message, MessageTypes } from "../../../models/message";
import { UIService } from "../../../providers/ui/ui.service";
import { LoaderComponent } from '../../../shared/loader/loader';
import { InfluencerSharedData } from "../../../shared/influencer.profile"
import { Influencer } from "../../../models/influencer/influencer";
import { EngagementList } from "../../../models/influencer/engagement.list"
import { InfluencerService } from "../../../providers/influencer/influencer.service";

@Component({
    selector: 'page-socialchannel',
    templateUrl: 'social-channel.html'
})
export class SocialChannelPage implements OnInit, OnChanges {

    showMore: boolean = false;
    @Input() socialStats: Array<SocialStats>;
    isSelected: boolean;
    allChannels: Array<SocialMedia> = new Array<SocialMedia>();
    selectedChannel: Array<string>;
    step: number = 0;
    channels: Array<SocialMedia> = new Array<SocialMedia>();
    public LoginResponse: String;
    public PagesList: any;
    private followersCount: number;
    public facebookPages: any;
    private notSelectedChannel: boolean;
    showFb: boolean = false;
    dataUnavailble: boolean = false;
    totalFBFollowers: number;
    fbAvgEngagementValue: string;
    fbEngagementLabel: number;
    showPagesData: boolean = false;
    codeStatus: boolean = false;
    facebookPageInfo: Array<FacebookPageInfo>;
    pagesLocation: Array<any>;
    socialMediaDetails = new Array<any>();
    fbSocialHandler: any;
    twitterTableId: number = null;
    twitterFollowersCount: number = null;
    twAvgEngagementValue: string;
    twEngagementLabel: number;
    twSocialHandler: string = null;

    snapchatTableId: number = null;
    snapchatFollowersCount: number = null;
    scAvgEngagementValue: string;
    scEngagementLabel: string;
    scSocialHandler: string = null;

    instagramTableId: number = null;
    instagramFollowersCount: number = null;
    igAvgEngagementValue: string;
    igEngagementLabel: string;
    igSocialHandler: string = null;

    youtubeTableId: number = null;
    youtubeFollowersCount: number = null;
    ytAvgEngagementValue: string;
    ytEngagementLabel: string;
    ytSocialHandler: string = null;

    pinterestTableId: number = null;
    pinterestFollowersCount: number = null;
    piAvgEngagementValue: string;
    piEngagementLabel: string;
    piSocialHandler: string = null;

    tumblrTableId: number = null;
    tumblrFollowersCount: number = null;
    tlAvgEngagementValue: string;
    tlEngagementLabel: string;
    tlSocialHandler: string = null;

    linkedinTableId: number = null;
    linkedinFollowersCount: number;
    lnAvgEngagementValue: string;
    lnEngagementLabel: string;
    lnSocialHandler: string = null;

    blogTableId: number = null;
    blogFollowersCount: number = null;
    blogAvgEngagementValue: string;
    blogEngagementLabel: string;
    blogSocialHandler: string = null;

    influencer: Influencer = new Influencer();
    engagementList: EngagementList[];

    constructor(private _navCtrl: NavController, private _socialMediaService: SocialMediaService,
        private _facebook: FBService, private _uiService: UIService, private _influencerSharedData: InfluencerSharedData,
        private _influencerService: InfluencerService,
        private _authService: AuthProvider, public loader: LoaderComponent) {

    }

    pop() {
        this._navCtrl.pop();
    }

    loadCountData(element) {
        console.log("in loaaaddddd data", element);

        if (element.socialMediaChannel.codeName === 'twitter') {
            this.twitterTableId = element.pageDetails[0].id;
            this.twitterFollowersCount = element.totalFanCount;
            // console.log('this.twitterFollowersCount', this.twitterFollowersCount);
            this.twAvgEngagementValue = element.avgEngagementValue;
            this.twEngagementLabel = element.engagementLevel.id;
            this.twSocialHandler = element.socialmediaProfileName;
        }
        else if (element.socialMediaChannel.codeName === 'instagram') {
            console.log('instagram', element);
            this.instagramTableId = element.pageDetails[0].id;
            this.instagramFollowersCount = element.totalFanCount;
            this.igAvgEngagementValue = element.avgEngagementValue;
            this.igEngagementLabel = element.engagementLevel.id;
            this.igSocialHandler = element.socialmediaProfileName;
        }
        if (element.socialMediaChannel.codeName === 'youtube') {
            this.youtubeTableId = element.pageDetails[0].id;
            this.youtubeFollowersCount = element.totalFanCount || element.pageDetails[0].fanCount;
            this.ytAvgEngagementValue = element.avgEngagementValue;
            this.ytEngagementLabel = element.engagementLevel.id;
            this.ytSocialHandler = element.socialmediaProfileName;

        }
        else if (element.socialMediaChannel.codeName === 'snapchat') {
            this.snapchatTableId = element.pageDetails[0].id;
            this.snapchatFollowersCount = element.totalFanCount || element.pageDetails[0].fanCount;
            this.scAvgEngagementValue = element.avgEngagementValue;
            this.scEngagementLabel = element.engagementLevel.id;
            this.scSocialHandler = element.socialmediaProfileName;
        }
        else if (element.socialMediaChannel.codeName === 'pinterest') {
            this.pinterestTableId = element.pageDetails[0].id;
            this.pinterestFollowersCount = element.totalFanCount || element.pageDetails[0].fanCount;
            this.piAvgEngagementValue = element.avgEngagementValue;
            this.piEngagementLabel = element.engagementLevel.id;

            this.piSocialHandler = element.socialmediaProfileName;
        }
        else if (element.socialMediaChannel.codeName === 'tumblr') {
            this.tumblrTableId = element.pageDetails[0].id;
            this.tumblrFollowersCount = element.totalFanCount || element.pageDetails[0].fanCount;
            this.tlAvgEngagementValue = element.avgEngagementValue;
            this.tlEngagementLabel = element.engagementLevel.id;
            this.tlSocialHandler = element.socialmediaProfileName;
        }
        else if (element.socialMediaChannel.codeName === 'linkedin') {
            this.linkedinTableId = element.pageDetails[0].id;
            this.linkedinFollowersCount = element.totalFanCount || element.pageDetails[0].fanCount;
            this.lnAvgEngagementValue = element.avgEngagementValue;
            this.lnEngagementLabel = element.engagementLevel.id;
            this.lnSocialHandler = element.socialmediaProfileName;
        }
        else if (element.socialMediaChannel.codeName === 'blog') {
            this.blogTableId = element.pageDetails[0].id;
            this.blogFollowersCount = element.totalFanCount || element.pageDetails[0].fanCount;
            this.blogAvgEngagementValue = element.avgEngagementValue;
            this.blogEngagementLabel = element.engagementLevel.id;
            this.blogSocialHandler = element.socialmediaProfileName;
        }
    }

    /* Initialize Values */
    ngOnInit(): void {


        // Token Approach Failed
        // let token = this._route.snapshot.fragment
        // console.log("tokeeeen" , token);
        // this._route.fragment.subscribe((fragment: string) => {
        //     console.log("My hash fragment is here => ", typeof(fragment))
        //     this._instagram.getFollowers(fragment).subscribe(res=>{
        //         console.log("followers list ", res);
        //     })
        // })

        // this._route.queryParams
        //     .subscribe(params => {
        //         // Defaults to 0 if no query param provided.
        //         console.log('insta params', params);
        //         const code = params['code'];
        //         const error = params['error'];

        //         if (code) {
        //             this.codeStatus = true;
        //             this._instagram.getNewFollowers(code);
        //         }
        //     })

        this.influencer = this._influencerSharedData.getInfluencer();
        let facebook = this.influencer.socialStats.filter(c => c.socialMediaChannel.codeName === 'facebook')
        console.log('facebook', facebook);

        if (facebook != undefined) {
            this.totalFBFollowers = facebook[0].totalFanCount;
            this.fbAvgEngagementValue = facebook[0].avgEngagementValue;
            this.fbEngagementLabel = facebook[0].engagementLevel.id;
            if (facebook[0].pageDetails.length > 0) {
                for (let i of facebook[0].pageDetails) {
                    let f = new FacebookPageInfo();
                    f.name = i.pageName;
                    f.fan_count = i.fanCount;
                    // this.facebookPageInfo.push(f);
                }
            }

            this.fbSocialHandler = facebook[0].socialmediaProfileName;
        }

        console.log(this.influencer.socialStats);
        this.influencer.socialStats.forEach(element => {
            this.loadCountData(element);
        });



        // if (this.influencer.socialStats[6] != undefined) {
        //     this.loadCountData(this.influencer.socialStats[7]);
        // }


        // if (this.influencer.socialStats[7] != undefined) {
        //     this.loadCountData(this.influencer.socialStats[8]);
        // }


        // if (this.influencer.socialStats[8] != undefined) {
        //     this.loadCountData(this.influencer.socialStats[9]);
        // }


        // if (this.influencer.socialStats[9] != undefined) {
        //     this.loadCountData(this.influencer.socialStats[10]);
        // }


        this.loadSocialMediaChannels();
        this.loadSocialEngagementList();

        // Get facebook user id from facebook service
        this._facebook.userId.subscribe(
            (userId) => {
                this.fbSocialHandler = userId;
                console.log('user id: ', this.fbSocialHandler);
            }
        );

        //FB Page Auto-populate Pages List
        this._facebook.pageAdded.subscribe(
            (pageInfo) => {
                //console.log("page data", pageInfo);
                let totalFBCount = 0;
                //console.log("sss", pageInfo)
                this.facebookPageInfo.push(pageInfo);
                if (this.facebookPageInfo.length > 4) {
                    //if pages more than 5 sort by fan count desc and restrict to 5
                    this.facebookPageInfo.sort(this.sortPages)
                    this.facebookPageInfo = this.facebookPageInfo.slice(0, 5)
                    this.facebookPageInfo.forEach(page => {
                        totalFBCount = totalFBCount + page.fan_count;
                        this.totalFBFollowers = totalFBCount;
                    });
                    this.showPagesData = true;

                    this._facebook.pagesEngagement.subscribe(
                        (pageEngagement) => {

                            console.log('data', pageEngagement);
                        })



                } else if (this.facebookPageInfo.length <= 5) {

                    this.facebookPageInfo.sort(this.sortPages)
                    this.facebookPageInfo.forEach(page => {
                        totalFBCount = totalFBCount + page.fan_count;
                        this.totalFBFollowers = totalFBCount;

                    });
                    this.showPagesData = true;
                }

            }

        );

        //If FB User has no Pages Available
        this._facebook.noPages.subscribe(
            (pageInfo) => {
                if (pageInfo == false) {
                    console.log("no pages info", pageInfo);
                    this.dataUnavailble = true;
                }

            }
        );
        let totalPagesEngagement = [];
        let totalPagesImpressions = [];
        let facebookPageKeys = new FacebookPagekeys();

        this._facebook.pagesEngagement.subscribe(
            (engamentDetails) => {
                if (engamentDetails.length > 0) {
                    engamentDetails.forEach((element, index) => {
                        if (element.name == facebookPageKeys.engagement[0] && element.period == facebookPageKeys.period[0]) {
                            totalPagesEngagement.push(element);
                        } else if (element.name == facebookPageKeys.engagement[1] && element.period == facebookPageKeys.period[0])
                            totalPagesImpressions.push(element);
                    })
                }

                totalPagesEngagement.forEach(element => {
                    let totalEngagementRate = 0;
                    let pageId = element.id.split('/')[0];
                    let fbPage = this.facebookPageInfo.filter(f => f.id == pageId);
                    if (fbPage.length && fbPage.length > 0) {
                        fbPage[0].totalEngagement = element.values[0].value;

                        let impression = totalPagesImpressions.filter(i => i.id.split('/')[0] === pageId);
                        if (impression.length) {
                            fbPage[0].totalImpression = impression[0].values[0].value;
                            // fbPage[0].avgEngagement = ( (fbPage[0].totalEngagement / fbPage[0].totalImpression) == 0  ? 0 : (fbPage[0].totalEngagement / fbPage[0].totalImpression));
                            let temp = (fbPage[0].totalEngagement / fbPage[0].totalImpression)
                            fbPage[0].avgEngagement = (typeof temp == "number" && temp >= 0) ? temp * 100 : 0
                        }
                    }
                });

                Number(this.fbAvgEngagementValue);

                this.facebookPageInfo.forEach(element => {
                    console.log("")
                    if (element.avgEngagement != undefined) {
                        this.fbAvgEngagementValue += element.avgEngagement;
                    }

                });

                String(this.fbAvgEngagementValue);

                console.log('total pages engamgent', totalPagesEngagement);
                console.log('total pages Imprssions', totalPagesImpressions);
                console.log('final pages for display with sorted', this.facebookPageInfo);
            });

        //Calling Instagram Metrics

        //FOLLOWERS COUNT
        let count = 0;
        this._facebook.instagramFollower.subscribe(
            (insta) => {
                count = count + parseInt(insta);
                this.instagramFollowersCount = count;
                console.log("insta final response", this.instagramFollowersCount);
            }
        );

        //MEDIA COUNT
        let media = 0, impressions = 0, total_reach = 0;
        this._facebook.instagramMedia.subscribe(
            (insta) => {
                this._facebook.instagramImpressions.subscribe(
                    (imp) => {
                        impressions += imp;
                        console.log("insta impressions  response", impressions);
                        media = insta + media + impressions;
                    });
                console.log("insta media  response", media);
            }
        );
        this._facebook.instagramReach.subscribe(
            (reach) => {
                total_reach += reach;
                console.log("insta total reach response", total_reach);
                this.instaAverageEngagement(media, total_reach);
            })

    }

    loadSocialMediaChannels() {
        console.log("this influencer stats", this.influencer.socialStats)
        this._socialMediaService.getChannels().subscribe(
            (res) => {
                let channels = res.json().genericResponse.genericBody.data.socialMediaChannels;
                this.channels = [];

                channels.forEach(c => {
                    let newChannel = new SocialMedia();
                    newChannel.codeName = c.codeName;
                    newChannel.displayName = c.displayName;
                    newChannel.icon = c.icon;
                    newChannel.id = c.id;
                    newChannel.selected = false;
                    for (let i of this.influencer.socialStats) {
                        if (i.socialMediaChannel.id == newChannel.id) {
                            newChannel.selected = true;
                        }
                    }

                    this.channels.push(newChannel);
                });
            },
            (err) => { console.log(err); }
        );
    }


    sortPages(a, b) {
        if (a.fan_count > b.fan_count)
            return -1;
        if (a.fan_count < b.fan_count)
            return 1;
        return 0;
    }
    instaAverageEngagement(m, r) {
        let total = m / r;
        console.log("total", total);

        this.igAvgEngagementValue = total.toFixed(2).toString();
        console.log("instaAverageEngagement", this.igAvgEngagementValue);
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (this.socialStats && this.socialStats.length > 0) {
            this.socialStats.forEach(element => {

                let fchannels = this.channels.filter(c => c.codeName === element.socialMediaChannel.codeName);
                console.log('fchannels', fchannels);

                if (fchannels.length > 0) {
                    fchannels[0].selected = true;
                    this.isSelected = true;
                }

                if (element.socialMediaChannel.codeName === 'twitter') {

                    this.twitterTableId = element.pageDetails[0].id;
                    this.twitterFollowersCount = element.pageDetails[0].fanCount;
                    this.twAvgEngagementValue = element.avgEngagementValue;
                    console.log('element twitter', element);

                    // this.twEngagementLabel = element.engagementLevel.displayValue;
                }
                else if (element.socialMediaChannel.codeName === 'youtube') {
                    this.youtubeTableId = element.pageDetails[0].id;
                    this.youtubeFollowersCount = element.pageDetails[0].fanCount;
                    this.ytAvgEngagementValue = element.avgEngagementValue;
                    this.ytEngagementLabel = element.engagementLevel.displayValue;
                }
                else if (element.socialMediaChannel.codeName === 'snapchat') {
                    this.snapchatTableId = element.pageDetails[0].id;
                    this.snapchatFollowersCount = element.pageDetails[0].fanCount;
                    this.scAvgEngagementValue = element.avgEngagementValue;
                    this.scEngagementLabel = element.engagementLevel.displayValue;
                }
                else if (element.socialMediaChannel.codeName === 'instagram') {
                    this.instagramTableId = element.pageDetails[0].id;
                    this.instagramFollowersCount = element.pageDetails[0].fanCount;
                    this.igAvgEngagementValue = element.avgEngagementValue;
                    this.igEngagementLabel = element.engagementLevel.displayValue;
                }
                else if (element.socialMediaChannel.codeName === 'pinterest') {
                    this.pinterestTableId = element.pageDetails[0].id;
                    this.pinterestFollowersCount = element.pageDetails[0].fanCount;
                    this.piAvgEngagementValue = element.avgEngagementValue;
                    this.piEngagementLabel = element.engagementLevel.displayValue;
                }
                else if (element.socialMediaChannel.codeName === 'tumblr') {
                    this.tumblrTableId = element.pageDetails[0].id;
                    this.tumblrFollowersCount = element.pageDetails[0].fanCount;
                    this.tlAvgEngagementValue = element.avgEngagementValue;
                    this.tlEngagementLabel = element.engagementLevel.displayValue;
                }
                else if (element.socialMediaChannel.codeName === 'linkedin') {
                    this.linkedinTableId = element.pageDetails[0].id;
                    this.linkedinFollowersCount = element.pageDetails[0].fanCount;
                    this.lnAvgEngagementValue = element.avgEngagementValue;
                    this.lnEngagementLabel = element.engagementLevel.displayValue;
                }
                else if (element.socialMediaChannel.codeName === 'blog') {
                    this.blogTableId = element.pageDetails[0].id;
                    this.blogFollowersCount = element.pageDetails[0].fanCount;
                    this.blogAvgEngagementValue = element.avgEngagementValue;
                    this.blogEngagementLabel = element.engagementLevel.displayValue;
                }

                else if (element.socialMediaChannel.codeName === 'facebook') {
                    let index = 0;
                    this.facebookPageInfo = [];
                    this.showPagesData = true;
                    this.isSelected = true;

                    this.totalFBFollowers = element.totalFanCount;
                    this.fbAvgEngagementValue = element.avgEngagementValue;
                    this.fbEngagementLabel = element.engagementLevel.id;
                    element.pageDetails.forEach(page => {
                        let newPage = new FacebookPageInfo();
                        newPage.id = page.id;
                        newPage.fan_count = page.fanCount;
                        newPage.name = page.pageUrl;
                        this.facebookPageInfo.push(newPage);
                    });
                }

            });


        }

    }

    changeStep(stepNumber: number) {
        this.allChannels = this.channels.filter(channel => channel.selected);
        console.log("this all changes", this.allChannels)
        this.step = stepNumber;
    }

    backStep(stepNumber: number) {
        this.step = stepNumber;
    }

    onChangeChannel(channel: SocialMedia) {
        console.log("channels", channel);
        //channel.selected = !channel.selected;
        let channels = this.channels.filter(channel => channel.selected);
        if (channels.length > 0) {
            this.isSelected = true;
        } else this.isSelected = false;
        console.log("channels", channel);
    }


    callFacebook() {
        this.facebookPageInfo = new Array<FacebookPageInfo>();
        let followersCount = this._facebook.facebookLogin()

    }

    saveSocialConnections() {
        console.log("in save", this.allChannels, this.tumblrFollowersCount, this.twitterFollowersCount)
        this.allChannels.forEach(channel => {
            if (channel.codeName === 'facebook' && this.facebookPageInfo) {
                this.socialMediaDetails = [];

                this.facebookPageInfo.forEach(channel => {
                    this.socialMediaDetails.push({ "pageName": channel.name, "followersCount": channel.fan_count, "pageUrl": channel.name, "engagementValue": this.fbAvgEngagementValue })
                    console.log('facebook', this.socialMediaDetails);
                });
                let count = 0;
                for (let i of this.influencer.socialStats) {
                    if (i.socialMediaChannel.codeName == channel.codeName) {
                        this.influencer.socialStats[count].pageDetails = this.socialMediaDetails;
                        this.influencer.socialStats[count].engagementLevel.id = +this.fbEngagementLabel;
                    }
                    count++;
                }
                this._influencerSharedData.setInfluencer(this.influencer);
                this.socialMediaFollowers(channel.id, this.fbAvgEngagementValue, this.socialMediaDetails, this.fbEngagementLabel, this.fbSocialHandler);

            } else if (channel.codeName === 'twitter' && (this.twitterFollowersCount || this.twSocialHandler)) {

                this.socialMediaDetails = [];
                this.socialMediaDetails.push({ "id": this.twitterTableId, "pageName": "null", "followersCount": this.twitterFollowersCount, "pageUrl": "twitter", "engagementValue": this.twAvgEngagementValue })
                console.log('twitter', this.socialMediaDetails);

                let count = 0;
                for (let i of this.influencer.socialStats) {
                    if (i.socialMediaChannel.codeName == channel.codeName) {
                        this.influencer.socialStats[count].totalFanCount = this.twitterFollowersCount;
                        this.influencer.socialStats[count].engagementLevel.id = +this.twEngagementLabel;
                    }
                    count++;
                }
                this._influencerSharedData.setInfluencer(this.influencer);

                this.socialMediaFollowers(channel.id, this.twAvgEngagementValue, this.socialMediaDetails, this.twEngagementLabel, this.twSocialHandler);

            } else if (channel.codeName === 'snapchat' && (this.snapchatFollowersCount || this.scSocialHandler)) {

                this.socialMediaDetails = [];
                this.socialMediaDetails.push({ "id": this.snapchatTableId, "pageName": "null", "followersCount": this.snapchatFollowersCount, "pageUrl": "snapchat", "engagementValue": this.scAvgEngagementValue })
                console.log('snapchat', this.socialMediaDetails);


                let count = 0;
                for (let i of this.influencer.socialStats) {
                    if (i.socialMediaChannel.codeName == channel.codeName) {
                        this.influencer.socialStats[count].totalFanCount = this.snapchatFollowersCount;
                        this.influencer.socialStats[count].engagementLevel.id = +this.scEngagementLabel;
                    }
                    count++;
                }
                this._influencerSharedData.setInfluencer(this.influencer);

                this.socialMediaFollowers(channel.id, this.scAvgEngagementValue, this.socialMediaDetails, this.scEngagementLabel, this.scSocialHandler);

            } else if (channel.codeName === 'instagram' && (this.instagramFollowersCount || this.igSocialHandler)) {

                this.socialMediaDetails = [];
                this.socialMediaDetails.push({ "id": this.instagramTableId, "pageName": "null", "followersCount": this.instagramFollowersCount, "pageUrl": "instagram", "engagementValue": this.igAvgEngagementValue })
                console.log('instagram', this.socialMediaDetails);

                let count = 0;
                for (let i of this.influencer.socialStats) {
                    if (i.socialMediaChannel.codeName == channel.codeName) {
                        this.influencer.socialStats[count].totalFanCount = this.instagramFollowersCount;
                        this.influencer.socialStats[count].engagementLevel.id = +this.igEngagementLabel;
                    }
                    count++;
                }
                this._influencerSharedData.setInfluencer(this.influencer);

                this.socialMediaFollowers(channel.id, this.igAvgEngagementValue, this.socialMediaDetails, this.igEngagementLabel, this.igSocialHandler);

            } else if (channel.codeName === 'youtube' && (this.youtubeFollowersCount || this.ytSocialHandler)) {

                this.socialMediaDetails = [];
                this.socialMediaDetails.push({ "id": this.youtubeTableId, "pageName": "null", "followersCount": this.youtubeFollowersCount, "pageUrl": "youtube", "engagementValue": this.ytAvgEngagementValue })
                console.log('youtube', this.socialMediaDetails);

                let count = 0;
                for (let i of this.influencer.socialStats) {
                    if (i.socialMediaChannel.codeName == channel.codeName) {
                        this.influencer.socialStats[count].totalFanCount = this.youtubeFollowersCount;
                        this.influencer.socialStats[count].engagementLevel.id = +this.ytEngagementLabel;
                    }
                    count++;
                }
                this._influencerSharedData.setInfluencer(this.influencer);

                this.socialMediaFollowers(channel.id, this.ytAvgEngagementValue, this.socialMediaDetails, this.ytEngagementLabel, this.ytSocialHandler);

            } else if (channel.codeName === 'pinterest' && (this.pinterestFollowersCount || this.piSocialHandler)) {

                this.socialMediaDetails = [];
                this.socialMediaDetails.push({ "id": this.pinterestTableId, "pageName": "null", "followersCount": this.pinterestFollowersCount, "pageUrl": "pinterest", "engagementValue": this.piAvgEngagementValue })
                console.log("pinterest", this.socialMediaDetails);

                let count = 0;
                for (let i of this.influencer.socialStats) {
                    if (i.socialMediaChannel.codeName == channel.codeName) {
                        this.influencer.socialStats[count].totalFanCount = this.pinterestFollowersCount;
                        this.influencer.socialStats[count].engagementLevel.id = +this.piEngagementLabel;
                    }
                    count++;
                }
                this._influencerSharedData.setInfluencer(this.influencer);

                this.socialMediaFollowers(channel.id, this.piAvgEngagementValue, this.socialMediaDetails, this.piEngagementLabel, this.piSocialHandler);

            } else if (channel.codeName === 'tumblr' && (this.tumblrFollowersCount || this.tlSocialHandler)) {

                this.socialMediaDetails = [];
                this.socialMediaDetails.push({ "id": this.tumblrTableId, "pageName": "null", "followersCount": this.tumblrFollowersCount, "pageUrl": "tumblr", "engagementValue": this.tlAvgEngagementValue })
                console.log('tumblr', this.socialMediaDetails);


                let count = 0;
                for (let i of this.influencer.socialStats) {
                    if (i.socialMediaChannel.codeName == channel.codeName) {
                        this.influencer.socialStats[count].totalFanCount = this.tumblrFollowersCount;
                        this.influencer.socialStats[count].engagementLevel.id = +this.tlEngagementLabel;
                    }
                    count++;
                }
                this._influencerSharedData.setInfluencer(this.influencer);

                this.socialMediaFollowers(channel.id, this.tlAvgEngagementValue, this.socialMediaDetails, this.tlEngagementLabel, this.tlSocialHandler);

            } else if (channel.codeName === 'linkedin' && (this.linkedinFollowersCount || this.lnSocialHandler)) {

                this.socialMediaDetails = [];
                this.socialMediaDetails.push({ "id": this.linkedinTableId, "pageName": "null", "followersCount": this.linkedinFollowersCount, "pageUrl": "linkedin", "engagementValue": this.lnAvgEngagementValue })
                console.log('linkedin', this.socialMediaDetails);

                let count = 0;
                for (let i of this.influencer.socialStats) {
                    if (i.socialMediaChannel.codeName == channel.codeName) {
                        this.influencer.socialStats[count].totalFanCount = this.linkedinFollowersCount;
                        this.influencer.socialStats[count].engagementLevel.id = +this.lnEngagementLabel;
                    }
                    count++;
                }
                this._influencerSharedData.setInfluencer(this.influencer);

                this.socialMediaFollowers(channel.id, this.lnAvgEngagementValue, this.socialMediaDetails, this.lnEngagementLabel, this.lnSocialHandler);

            } else if (channel.codeName === 'blog' && (this.blogFollowersCount || this.blogSocialHandler)) {

                this.socialMediaDetails = [];
                this.socialMediaDetails.push({ "id": this.blogTableId, "pageName": "null", "followersCount": this.blogFollowersCount, "pageUrl": "blog", "engagementValue": this.blogAvgEngagementValue })
                console.log('blog', this.socialMediaDetails);
                let count = 0;
                for (let i of this.influencer.socialStats) {
                    if (i.socialMediaChannel.codeName == channel.codeName) {
                        this.influencer.socialStats[count].totalFanCount = this.blogFollowersCount;
                        this.influencer.socialStats[count].engagementLevel.id = +this.blogEngagementLabel;
                    }
                    count++;
                }
                this._influencerSharedData.setInfluencer(this.influencer);

                this.socialMediaFollowers(channel.id, this.blogAvgEngagementValue, this.socialMediaDetails, this.blogEngagementLabel, this.blogSocialHandler);
            }


        });


    }

    isMessageShown = false;
    isErrorMessageShown = false;

    socialMediaFollowers(channelId: number, avgEngagementValue: any, socialMediaDetails: Array<any>, engagementLevelId, socialmediaProfileName) {
        this._socialMediaService.postSocialChannelsFollowers(channelId, avgEngagementValue, socialMediaDetails, engagementLevelId, socialmediaProfileName).subscribe(
            (res) => {
                const msg = new Message();
                msg.msg = 'Your social media details have been saved successfully';
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, 'info');
            },
            (err) => {
                console.log(err);
                const msg = new Message();
                msg.msg = 'Sorry, an error has occured';
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.showToast(msg, '');
            }
        );



    }

    // socialMediaFollowers(channelId: number, avgEngagementValue: any, socialMediaDetails: Array<any>, engagementLevelId) {

    //     this._socialMediaService.postSocialChannelsFollowers(channelId, avgEngagementValue, socialMediaDetails, engagementLevelId).subscribe(
    //         (res) => {
    //             if (!this.isMessageShown) {
    //                 let msg = new Message();
    //                 msg.msg = "Your social media details has saved successfully";
    //                 msg.msgType = MessageTypes.Information;
    //                 msg.autoCloseAfter = 400;

    //                 this._uiService.presentToast(msg.msg);
    //                 this.isMessageShown = true;
    //             }

    //         },
    //         (err) => {
    //             console.log(err);
    //             if (!this.isErrorMessageShown) {
    //                 let msg = new Message();
    //                 msg.msg = "Sorry, an error has occured";
    //                 msg.msgType = MessageTypes.Error;
    //                 msg.autoCloseAfter = 400;
    //                 this._uiService.presentToast(msg.msg);
    //                 this.isErrorMessageShown = true;
    //             }

    //         }
    //     );



    // }

    loadSocialEngagementList() {
        this._socialMediaService.getSocialEngagementList().subscribe(
            (res) => {
                this.engagementList = res.json().genericResponse.genericBody.data.engagementList;
                console.log("this.engagementList", this.engagementList);
            },
            (err) => { console.log(err); }
        );
    }
}