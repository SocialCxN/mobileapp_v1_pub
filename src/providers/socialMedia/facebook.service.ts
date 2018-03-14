
import { HttpService } from "../base/http.service";
import { Http, RequestOptionsArgs, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { FacebookPageInfo } from "../../models/social-media/fb.page.info"
import { GenderDemographics } from "../../models/influencer/audience-demographics/gender.demographics";

import { Facebook, FacebookLoginResponse     } from '@ionic-native/facebook';
import { Message, MessageTypes } from "../../models/message";
import { UIService } from "../../providers/ui/ui.service";
@Injectable()
export class FBService {

    onError = new Subject<any>();
    pageAdded = new Subject<FacebookPageInfo>();
    noPages = new Subject<any>();
    pagesLocation = new Subject<any>();
    pagesGender = new Subject<any>();
    pagesEngagement = new Subject<any>();
    postEngagement = new Subject<any>();
    checkStatus = new Subject<any>();
    facebookPages = new Array<any>();
    facebookPages2 = new Array<any>();
    facebookPages3 = new Array<any>();
    facebookPages4 = new Array<any>();
    userId = new Subject();

    //INTSGRAM 
    igAccountId = new Array();
    igFollowerCount: any;
    igImpressions: number = 0;
    igReach: number = 0;
    igLikes: number = 0;
    igComments: number = 0;
    igAverageEngagement: number;
    instagramFollower = new Subject<any>();
    instagramMedia = new Subject<any>();
    instagramReach = new Subject<any>();
    instagramImpressions = new Subject<any>();


    constructor(private _http: HttpService, private _fb: Facebook, public _uiService: UIService) {
        console.log('Initializing Facebook');
        // let initParams: InitParams = {
        //     appId: '521832558155507',
        //     xfbml: true,
        //     version: 'v2.8'
        // };
        _fb.browserInit(1515813858537075,'v2.8');
    }

    facebookLogin() {
        console.log("in facebook login");
        const loginOptions= ['public_profile','pages_show_list','read_insights','read_insights','read_audience_network_insights']
        // const loginOptions: LoginOptions = {
        //     enable_profile_selector: true,
        //     return_scopes: true,
        //     scope: 'public_profile,pages_show_list,read_insights,instagram_basic,instagram_manage_insights,read_insights,read_audience_network_insights'
        // };
        this._fb.getLoginStatus().then((res) => {
                console.log("Resss",res);
                if (res.status !=   "connected") {
                    this._fb.login(loginOptions)
                    .then((res: FacebookLoginResponse ) => {
                        console.log("Result is",res);
                        if (res.status === 'connected') {
                            console.log("in if")
                            let msg = new Message();
                            msg.msg = "Connected with facebook successfully. Fetching facebook pages data";
                            msg.msgType = MessageTypes.Error;
                            msg.autoCloseAfter = 400;
                            this._uiService.presentToast(msg.msg);
                            // Logged into your app and Facebook.
                            this.getPages();
                            //this.getInstagramBusinessUsersData();
                           // this.getUserDetail(res.authResponse.userID);
        
                        } else if (res.status === 'not_authorized') {
                            // The person is logged into Facebook, but not your app.
                            let msg = new Message();
                            msg.msg = "Access denied";
                            msg.msgType = MessageTypes.Error;
                            msg.autoCloseAfter = 400;
                            this._uiService.presentToast(msg.msg);
                        } else {
                            // The person is not logged into Facebook, so we're not sure if
                            // they are logged into this app or not.
                        }
                        //console.log('Logged in', res);
                    })
                    .catch(err => { 
                        let msg = new Message();
                        console.log( "error is", err)
                        msg.msg = "Error in connecting facebook. Please try later" + err;
                        msg.msgType = MessageTypes.Error;
                        msg.autoCloseAfter = 400;
                        this._uiService.presentToast(msg.msg);
        
        
                    });
                }
                else {
                    this.getPages();
                }
        })



    }

    getUserDetail(userid) {
        this._fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
          .then(res => {
            console.log("user detail",res);
           // this.users = res;
          })
          .catch(e => {
            console.log(e);
          });
      }
    
    getUsername() {
        console.log('enter in function');

        this._fb.api('/me',[])
            .then((res: any) => {
                if (res) {
                    console.log('getUsername', res);
                    if (res.id) {
                        this.userId.next(res.id);
                    }
                }
            })
            .catch((err) => {
                console.log('Error in facebook', err);
            });
    }

      facebookPageLength = 0;
    getPages() {
        console.log("in get pages")
        const loginOptions= ['manage_pages']
        this._fb.api('/me/accounts', loginOptions)
            .then(res => {
                console.log("pages data", res);
                if (res.data.length > 0) {
                    let len = res.data.length* 4;
                    this.facebookPageLength = res.data.length;
                    console.log("length is", len, res.data.length);
                    let count = 0;
                    for (var i =0; i< len; i++){
                        if (count <res.data.length) {
                            this.facebookPages.push(res.data[count]);
                            count++;
                        }
                        else {
                            count = 0;
                            this.facebookPages.push(res.data[count]);
                            count++;
                        }
                    }
                    console.log("after 4 times", this.facebookPages);
                    //this.facebookPages = res.data;
                    //this.facebookPages2 =res.data;
                    //console.log("fb data", this.facebookPages, this.facebookPages2);
                    this.loop(this.facebookPages.shift())
                    //console.log("pages list", res);
                    // res.data.forEach(element => {
                    //     //get Pages Followers List
                    //     this.getFollowers(element.id);
                    //     // this.getInsightsByGender(element.id);
                    //     // this.getInsightsByLocation(element.id);
                    //     // this.getPageEngagements(element.id);
                    // });
                } else {
                    this.noPages.next(false);
                }
                console.log("fb response", res);
            })
            .catch(e=> {
                console.log("Exception is",e)
            })
    }

    reqCount = 0;

    loop (pages)  {
        
        if (pages != undefined) {
            
            console.log('Pages followers List ', this.reqCount, this.facebookPageLength);
            if (this.reqCount < this.facebookPageLength) {
                
                console.log('Pages followers List ', this.reqCount, this.facebookPageLength);
                this.facebookPages2.push(pages);
                let url = pages.id + '/?fields=fan_count,name';
                this.reqCount++;
                this._fb.api(url,[])
                .then((res: any) => {
                     console.log('Pages followers List ', res);
                    this.pageAdded.next(res);
                    this.loop(this.facebookPages.shift());
                    //resolve(true);
                })
               
            }
            else {
                this.reqCount = 0;
                this.loopGetInsightByGender(pages);
            }

        }
        else {
            console.log("in else", this.facebookPages2);
        }

      }

    loopGetInsightByGender(pages) {
        console.log("in thisss function", pages);
        if (pages != undefined) {
            if (this.reqCount < this.facebookPageLength ) {
                let page_access_token = pages.access_token
                let url = pages.id + '/insights/page_fans_gender_age?access_token='+page_access_token;
                const loginOptions= ['public_profile','pages_show_list','read_insights','read_insights','read_audience_network_insights']
                console.log("in load get insight", url);
                this.reqCount++;
                this._fb.api(url, loginOptions)
                .then((res: any) => {
                    console.log("insight in gender",res)
                    if (res) {
                        this.pagesGender.next(res.data);
                        this.loopGetInsightByGender(this.facebookPages.shift());
                    }
                })
                .catch(e => {
                    console.log("Exception",e);
                }) 
            }
            else {
                this.reqCount = 0;
                this.loadGetInsightByLocation(pages);
            }

        }
    }

    loadGetInsightByLocation(pages) {
        if (pages!= undefined) {
            if (this.reqCount<this.facebookPageLength) {
                let page_access_token = pages.access_token
                let url = pages.id + '/insights/page_fans_country?access_token='+page_access_token;
                const loginOptions= ['public_profile','pages_show_list','read_insights','read_insights','read_audience_network_insights']
                console.log("in load get insight", url);
                this.reqCount++;
                this._fb.api(url, loginOptions)
                .then((res: any) => {
                    console.log("insight in gender",res)
                    if (res) {
                        this.pagesLocation.next(res.data);
                        this.loadGetInsightByLocation(this.facebookPages.shift());
                    }
                })
                .catch(e => {
                    console.log("Exception",e);
                }) 
            }
            else {
                this.reqCount = 0;
                this.loadGetPageInsights(pages);
            }
        }
    }

    loadGetPageInsights(pages) {
        if (pages!= undefined) {
            if (this.reqCount<this.facebookPageLength) {
                let page_access_token = pages.access_token
                let url = pages.id + '/insights/page_post_engagements,page_posts_impressions?access_token='+page_access_token;
                const loginOptions= ['public_profile','pages_show_list','read_insights','read_insights','read_audience_network_insights']
                console.log("in load get insight", url);
                this.reqCount++;
                this._fb.api(url, loginOptions)
                .then((res: any) => {
                    console.log("insight in gender",res)
                    if (res) {
                        this.pagesEngagement.next(res.data);
                        this.loadGetPageInsights(this.facebookPages.shift());
                    }
                })
                .catch(e => {
                    console.log("Exception",e);
                }) 
            }
            else {
               this.getInstagramBusinessUsersData();
            }
        }
    }
      
    getFollowers(pages) {
        let promises_array:Array<any> = [];
        let that = this;
        for (let channel of pages) {
            promises_array.push(new Promise(function(resolve,reject) {

                
                let url = channel.id + '/?fields=fan_count,name';
                console.log(" tisiss", channel.id, url);
                that._fb.api(url,[])
                .then((res: any) => {
                     console.log('Pages followers List ', res);
                    that.pageAdded.next(res);
                    //resolve(true);
                })
            }));
        }
        return Promise.all(promises_array);

 
        // console.log("in get followersss");
        // //Calling Pages Follwers count API
        // return this._fb.api(pageId + '/?fields=fan_count,name',[])
        //     .then((res: any) => {
        //          console.log('Pages followers List ', res);
        //         this.pageAdded.next(res);
        //     })
    }

    logout() {

        this._fb.logout().then(() => console.log('Logged out!'));
    }

    getInsightsByGender(id) {

        this._fb.api(id + '/insights/page_fans_gender_age', [])
            .then((res: any) => {
                if (res) {
                    this.pagesGender.next(res.data);
                }
            })
            .catch()

    }
    getInsightsByLocation(id) {

        this._fb.api(id + '/insights/page_fans_country', [])
            .then((res: any) => {
                this.pagesLocation.next(res.data);
            })
            .catch()


    }

    getPageEngagements(id) {
        this._fb.api(id + '/insights/page_post_engagements,page_posts_impressions', [])
            .then((res: any) => {
                this.pagesEngagement.next(res.data);
            })
            .catch()

    }

    getPostInsights(post) {

        let user_id = 0;
        this._fb.api('me',[])
            .then((res: any) => {
                if (res) {
                    console.log('getting user_id', res);
                    user_id = res.id;
                }

                if (post.type == "unknown") {
                    console.log('not found user data');
                    this.postEngagement.next({ data: [], type: 'unknown', link: post.link });
                }

                if (post.type == "post" && post.pageid == "") {
                    console.log('single post recieve', post.id, user_id);
                    this._fb.api(user_id + '_' + post.id + '/?fields=comments.summary(true),reactions.summary(true),shares.summary(true),likes.summary(true)', [])
                        .then((res: any) => {
                            console.log('post pulling data ', res);
                            this.postEngagement.next({ data: res, type: 'single_post', link: post.link });
                        }).catch(err => {
                            this.postEngagement.next(err);
                        })

                } if (post.type == "post" && post.pageid) {
                    console.log('single post recieve with pageee', post.id);
                    //this._fb.api(post.pageid + '_' + post.id + '/?fields=comments.summary(true),reactions.summary(true),shares.summary(true)')
                    this._fb.api(post.pageid + '_' + post.id + '/?fields=insights.metric(post_consumptions,post_impressions_unique),likes.summary(true),comments.summary(true),reactions.summary(true),shares.summary(true)', [])
                        .then((res: any) => {
                            console.log('post pulling data ', res);
                            this.postEngagement.next({ data: res, type: 'page_post', link: post.link });
                        }).catch(err => {
                            this.postEngagement.next(err);
                        })


                }
                else if (post.type == "videos") {
                    this._fb.api(post.id + '/video_insights', [])
                        .then((res: any) => {
                            console.log('video pulling data from server ', res);
                            this.postEngagement.next({ data: res, type: 'videos_post', link: post.link });
                        }).catch(err => {
                            this.postEngagement.next(err);
                        })
                }
            })
            .catch()
    }

    facebookStatus() {
        this._fb.getLoginStatus()
            .then((res: any) => {
                console.log('Facebook login status ', res);
                this.checkStatus.next(res);

            })

    }

    getInstagramBusinessUsersData() {
        this._fb.api('me/accounts?fields=instagram_business_account', [])
            .then((res: any) => {
                // console.log('instagram_business_account List ', res.data);
                let accounts = res.data;
                accounts.forEach((element, i) => {
                    if (element.instagram_business_account) {
                        this.igAccountId[i] = element.instagram_business_account.id;
                    }
                });
                console.log("IG business user accounts id:", this.igAccountId);
                this.getIgMetrics();
            }

            )
    }


    getIgMetrics() {
        //FOLLOWER COUNT
        this.igAccountId.forEach(element => {
            this._fb.api(element + '?fields=followers_count', [])
                .then((res: any) => {
                    let followCount = res.followers_count;
                    console.log("followCount", followCount);

                    //this.igFollowerCount += followCount.followers_count;
                    this.instagramFollower.next(followCount);
                })
                .
                then(() => {
                    this._fb.api(element + '/media?fields=like_count,comments_count', [])
                        .then((res: any) => {
                            let commentCount = res.data;
                            commentCount.forEach(element => {
                                this.igComments += element.comments_count;
                            });
                            console.log("Total instgram comments:", this.igComments);
                            let likeCount = res.data;
                            likeCount.forEach(element => {
                                this.igLikes += element.like_count;
                            });
                            console.log("Total instgram likes:", this.igLikes);

                            this._fb.api(element + '/insights?metric=impressions,reach&period=days_28', [])
                                .then((res: any) => {

                                    let impressionCount = res.data;
                                    impressionCount.forEach(element => {
                                        console.log("element.impressionCount", element);
                                        if (element.name === 'impressions') {
                                            element.values.forEach(element => {
                                                this.igImpressions += element.value;
                                                this.instagramImpressions.next(this.igImpressions);
                                            });
                                        }
                                        if (element.name === 'reach') {
                                            element.values.forEach(element => {
                                                this.igReach += element.value;
                                                console.log("this.igReach ", this.igReach);
                                            });
                                            this.instagramReach.next(this.igReach);
                                        }
                                    });
                                })
                            let media = this.igComments + this.igLikes ;
                            this.instagramMedia.next(media);
                        });
                })

            // .then(() => {

            //  MEDIA COUNT LIKES & COMMENTS
            //  IMPRESSIONS & REACH

            // this._fb.api(element + '/insights?metric=impressions,reach&period=days_28')
            //     .then((res: any) => {

            //         let impressionCount = res.data;
            //         impressionCount.forEach(element => {
            //             console.log("element.impressionCount", element);
            //             if (element.name === 'impressions') {
            //                 element.values.forEach(element => {
            //                     this.igImpressions += element.value
            //                 });
            //             }
            //             if (element.name === 'reach') {
            //                 element.values.forEach(element => {
            //                     this.igReach += element.value;
            //                 });
            //             }
            //         });
            //     })


            // })



        });

        // //AVERAGE ENGAGEMENT
        // console.log('final-------------------- res', this.igImpressions)
        // let avg = (this.igImpressions + this.igLikes + this.igComments) / this.igReach;
        // console.log("average engagement", avg);
        // this.igAverageEngagement = avg;
        // console.log('instagram Followers Count', this.igFollowerCount);

        // this.instagramMetrics.next({ followersCount: this.igFollowerCount, igEngagementRate: this.igAverageEngagement });
    }
}