import { HttpService } from "../base/http.service";
import { Http, RequestOptionsArgs, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { User } from "../../models/user";
import { Campaign } from "../../models/campaign/campaign";
import { CampaignReport } from "../../models/campaign/campaign.report";
//import { BankDetails } from "../../models/payment/bank.details";

@Injectable()
export class CampaignService {

    getUrl: string;
    constructor(private _http: HttpService) { }

    public getServiceProviders(): Observable<any> {
        this.getUrl = "credticard/serviceprovider";

        return this._http.getRequest(this.getUrl)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getInfluencerTypes() {
        let url = "influencer/types";
        return this._http.getRequest(url)
            .map(res => { return res.json().genericResponse.genericBody.data.influencerTypes });
    }

    public getCampaignObjectives() {
        let url = "campaign/objectives";
        return this._http.getRequest(url)
            .map(res => { return res.json().genericResponse.genericBody.data.campaignObjectives });
    }

    public postCampaignDraft(campaign: Campaign, entityType): Observable<any> {
        let getUrl = "";
        if (entityType === 'brand') {
            getUrl = "campaign/draft";
        } else
            if (entityType === 'digital_agency') {
                getUrl = "digitalagency/campaign/draft";
            }

        let body = {
            id: campaign.id,
            associatedId: campaign.associatedId,
            campaignObjectiveIds: campaign.campaignObjectiveIds,
            campaignObjectiveDescription: campaign.campaignObjectiveDescription || null,
            campaignSocialMediaChannelIds: campaign.campaignSocialMediaChannelIds,
            campaignInfluencerTypeIds: campaign.campaignInfluencerTypeIds,
            campaignName: campaign.campaignName,
            campaignCategoryIds: campaign.campaignCategoryIds,
            campaignStartDate: campaign.campaignStartDate,
            campaignEndDate: campaign.campaignEndDate,
            campaignDescription: campaign.campaignDescription,
            campaignReferenceUrls: campaign.campaignReferenceUrls,
            offeredInfluencers: campaign.offeredInfluencers,
            draftState: campaign.draftState,
            currencyId: campaign.currencyId,
            attachmentIds: campaign.attachmentIds || [],
            campaignMediaLinks: campaign.campaignMediaLinks || []
        };
        return this._http.postRequest(getUrl, body).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    public getCampaignCategoryList(): Observable<any> {
        this.getUrl = "campaigncategories";

        return this._http.getRequest(this.getUrl)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getBrandCampaignList(campaignStatus): Observable<any> {
        console.log('final body for campaignlist', campaignStatus);
        this.getUrl = "brand/campaigns/list"
        // let body = {
        //     campaignStatus:campaignStatus.status,
        //     offsetValue:campaignStatus.offsetValue,
        //     limitvalue
        // }
        return this._http.postRequest(this.getUrl, campaignStatus)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getBrandCampaignStatus(): Observable<any> {
        this.getUrl = "brand/campaigns/status/details";

        return this._http.getRequest(this.getUrl)
            .map(res => { return res.json().genericResponse.genericBody.data.campaignStatusDetails });
    }


    public getInfluencerCampaignList(campaignStatus): Observable<any> {
        console.log('final body for campaignlist', campaignStatus);
        this.getUrl = "influencer/campaigns/list"
        let body = {
            campaignStatus:campaignStatus.status,
            offsetValue:campaignStatus.offsetValue,
            limitvalue: campaignStatus.limitvalue
        }
        return this._http.postRequest(this.getUrl, campaignStatus)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getInfluncerCampaignStatus(): Observable<any> {
        this.getUrl = "influencer/campaigns/status/details";

        return this._http.getRequest(this.getUrl)
            .map(res => { return res.json().genericResponse.genericBody.data.campaignStatusDetails });
    }

    public discardCampaign(id) {
        this.getUrl = "campaign/discard";
        let body = {
            campaignId: id
        }
        return this._http.postRequest(this.getUrl, body).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }

    public dropInfluencer(obj) {
        this.getUrl = "/drop/campaign/influencer";
        let body = {
            campaignId: obj.id,
            influencerId: obj.influencerId
        }
        return this._http.postRequest(this.getUrl, body).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }

    public addMoreInfluncer(post) {

        this.getUrl = "campaign/influencer/add";
        let body = {
            campaignId: post.campid,
            offeredInfluencers: post.offeredInf
        }
        return this._http.postRequest(this.getUrl, body).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));



    }

    public getPaymentPlans(): Observable<any> {
        this.getUrl = "payment/plans";

        return this._http.getRequest(this.getUrl)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    public createCampaign(campaign: Campaign, entityType): Observable<any> {

        let getUrl = "";
        if (entityType === 'brand') {
            getUrl = "campaign/create";
        } else
            if (entityType === 'digital_agency') {
                getUrl = "digitalagency/campaign/create";
            }

        let body = {
            id: campaign.id,
            associatedId: campaign.associatedId,
            campaignObjectiveIds: campaign.campaignObjectiveIds,
            campaignObjectiveDescription: campaign.campaignObjectiveDescription || null,
            campaignSocialMediaChannelIds: campaign.campaignSocialMediaChannelIds,
            campaignInfluencerTypeIds: campaign.campaignInfluencerTypeIds,
            campaignName: campaign.campaignName,
            campaignCategoryIds: campaign.campaignCategoryIds,
            campaignStartDate: campaign.campaignStartDate,
            campaignEndDate: campaign.campaignEndDate,
            campaignDescription: campaign.campaignDescription,
            campaignReferenceUrls: campaign.campaignReferenceUrls,
            offeredInfluencers: campaign.offeredInfluencers,
            draftState: campaign.draftState,
            currencyId: campaign.currencyId,
            attachmentIds: campaign.attachmentIds || [],
            campaignMediaLinks: campaign.campaignMediaLinks || []

        };
        return this._http.postRequest(getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public loadInfluencerCampaignDetails(id: any) {
        let url = "influencer/campaign/details";
        let body = {
            campaignId: id
        }
        return this._http.postRequest(url, body)
            .map(res => { return res.json().genericResponse.genericBody.data.campaign })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')
            );
    }


    // public getBrandCampaignDetails(id): Observable<any> {
    //     this.getUrl = "brand/campaign/details";
    //     let body = { campaignId: +id };
    //     return this._http.postRequest(this.getUrl, body)
    //         .map(res => { return res.json().genericResponse.genericBody.data })
    //         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    // }

    public getBrandCampaignDetails(id, entityType): Observable<any> {
        if (entityType === 'brand') {
            this.getUrl = "brand/campaign/details";
        } else
            if (entityType === 'digital_agency') {
                this.getUrl = "digitalagency/campaign/details";
            }
            else
                if (entityType === 'influencer_agent') {
                    this.getUrl = "influenceragent/campaign/details";
                }
        let body = { campaignId: +id };
        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public acceptCampaignOffer(id: any) {
        this.getUrl = "campaign/offer/accept";
        let body = { campaignId: id };
        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public rejectCampaignOffer(id: any, reason: string) {
        this.getUrl = "campaign/offer/reject";
        let body = {
            campaignId: id,
            rejectReason: reason
        };
        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getCampaignReportChannelWise(id: number, channelId: number) {
        this.getUrl = "/influencer/campaign/report";
        let body = {
            campaignId: id,
            channelId: channelId
        };
        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }



    public getCampaignConsolidatedReport(campaignId: number) {
        this.getUrl = "/influencer/consolidated/campaign/report";
        let body = {
            campaignId: campaignId,
        };
        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getCampaignSentiments() {

        this.getUrl = "/setup/influencer/campaign/sentiments";

        return this._http.getRequest(this.getUrl)
            .map(res => { return res.json().genericResponse.genericBody.data.influencerCampaignSentiments });

    }

    public saveCampaignSentiments(obj){

        this.getUrl = "influencer/campaign/sentiments";
        let body = {
            campaignId: obj.id,
            sentimentOptionId: obj.sentimentsId,
        };

        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

    public postCampaignReport(post) {
        this.getUrl = "influencer/campaign/report/complete";
        let body = {
            campaignId: post.campaignId,
            socialChannelId: post.socialChannelId,
            totalEngagement: post.totalEngagement,
            totalReach: post.totalReach,
            postUrls:post.postUrls,
            totalEngagementRate: post.totalEngagementRate,
            attributes: [],
            attachmentIds: post.attachmentIds
        };
        post.attributes.forEach(obj => {
            body.attributes.push({
                keyId: obj.id,
                keyName: obj.displayName,
                value: obj.value
            });
        });
        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody })
            .catch((error: any) => Observable.throw(error.json().genericResponse.genericBody ));
    }

    public getAllCampaignReport(post) {
        this.getUrl = "brand/campaign/report";
        let body = {
            campaignId: post.campaignId,
            influencerId: post.inf,
        };

        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data.campaignReports })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public brandCampaignReportApproval(post) {
        this.getUrl = "brand/campaign/report/approve";
        console.log("post", post);
        let body = {
            campaignId: post.campaignId,
            influencerId: post.influencerId,
            ratingId: post.ratingId,
            feedback: post.feedback
        };

        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public dropInfluencerCampaign(post) {
        this.getUrl = "drop/campaign/influencer";
        let body = {
            campaignId: post.campaignId,
            influencerId: post.inf,
        };

        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public rejectCampaignReportChannelWise(post) {
        this.getUrl = "brand/campaign/report/decline";
        console.log("post", post);

        let body = {
            campaignReportId: post.campaignReportId,
            channelId: post.channelId,
            declineFeedback: post.declineFeedback
        };
        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public editCampaignBasicInfo(post) {
        this.getUrl = "campaign/edit";
        console.log("post", post);

        let body = {
            campaignId: post.campaignId,
            campaignSocialMediaChannelIds: post.campaignSocialMediaChannelIds ,
            campaignDescription: post.campaignDescription,
            campaignReferenceUrls: post.campaignReferenceUrls
        };
        
        return this._http.postRequest(this.getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}