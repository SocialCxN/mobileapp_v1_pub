
import { HttpService } from "../base/http.service";
import { Http, RequestOptionsArgs, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { InfluencerSearch } from "../../models/influencer/influencer.search";

@Injectable()
export class AdvanceSearchService {

    getUrl: string;
    constructor(private _http: HttpService) { }

    public getRatings(): Observable<any> {
        let getUrl = "setup/ratings/list";
        return this._http.getRequest(getUrl).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));;
    }

    public getFollowersCount(): Observable<any> {
        let getUrl = "setup/followers/range";
        return this._http.getRequest(getUrl).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));;
    }

    public getPricingFollowersCount(): Observable<any> {
        let getUrl = "setup/followers/range";
        return this._http.getRequest(getUrl, { params: { useIn: "pc" } }).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));;
    }

    public getSocialEngagementList(): Observable<any> {
        let getUrl = "setup/socialengagements/list";
        return this._http.getRequest(getUrl).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));;
    }

    public getCampaignTask(): Observable<any> {
        let getUrl = "setup/campaign/task";
        return this._http.getRequest(getUrl).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));;
    }

    public getCampaignSubTask(taskId: any): Observable<any> {
        let postUrl = "campaign/subtasks";
        let body = {
            taskId: taskId
        }
        return this._http.postRequest(postUrl, body).map(res => { return res.json().genericResponse.genericBody.data.tasks })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));;
    }

    public getRecommendedOffer(obj): Observable<any> {
        console.log("getRecommendedOffer", obj);
        
        let postUrl = "price/calculator";
        let body = {
            channelId: obj.channelId,
            ratingId: obj.ratingId,
            countryId: obj.countryId,
            engagementRateId: obj.engagementRateId,
            campaignTaskId: obj.campaignTaskId,
            followerRangeId: obj.followerRangeId
        }
        return this._http.postRequest(postUrl, body).map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));;
    }


    public postCountryGetCities(countryIds: any): Observable<any> {
        let postUrl = "countries/cities";
        let body = {
            countryIds: countryIds,
            offsetValue: null,
            limitValue: null
        }
        return this._http.postRequest(postUrl, body).map(res => { return res.json().genericResponse.genericBody.data.cities })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));;
    }

    public postInfluencerSearch(searchObj: InfluencerSearch): Observable<any> {
        let getUrl = "influencer/search";
        let body = {

            searchKeyword: searchObj.searchKeyword ? searchObj.searchKeyword : "null",
            fansCountRange: searchObj.fansCountRange ? searchObj.fansCountRange.toString() : "null",
            influencerRating: searchObj.influencerRating ? searchObj.influencerRating.toString() : "null",
            influencerCountry: searchObj.influencerCountry.length == 0 ? "null" : searchObj.influencerCountry,
            influencerCity: searchObj.influencerCity.length == 0 ? "null" : searchObj.influencerCity,
            audienceCountry: searchObj.audienceCountry.length == 0 ? "null" : searchObj.audienceCountry,
            socialMediaChannel: searchObj.socialMediaChannel.length == 0 ? "null" : searchObj.socialMediaChannel,
            engagementLevel: searchObj.engagementLevel ? searchObj.engagementLevel.toString() : "null",
            campaignCategory: searchObj.campaignCategory.length == 0 ? "null" : searchObj.campaignCategory,
            influencerType: searchObj.influencerType.length == 0 ? "null" : searchObj.influencerType,
            userCountryId: searchObj.userCountryId || "null",
            sortParam: searchObj.sortParam || "null",
            sortOrder: searchObj.sortOrder || "null",
            offsetValue: searchObj.offsetValue,
            limitValue: searchObj.limitValue,

        }
        return this._http.postRequest(getUrl, body).map(res => { return res.json().genericResponse.genericBody.data.queryResult })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));;
    }



}
