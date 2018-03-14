
import { HttpService } from "../base/http.service";
import { Http, RequestOptionsArgs, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";

@Injectable()
export class SocialMediaService {

    getUrl: string;
    constructor(private _http: HttpService) { }

    public getChannels(): Observable<any> {
        let getUrl = "socialmedia/channels";
        return this._http.getRequest(getUrl).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postSocialChannelsFollowers(channel_id : number , avgEngagementValue : any, socailDetails :Array<any>, engagementLevelId : number, socialmediaProfileName: string) {

        let body = {
            "channelId": channel_id,
            "avgEngagementValue" : avgEngagementValue,
            "socialmediaDetails": socailDetails,
            "engagementLevelId":engagementLevelId,
            'socialmediaProfileName': socialmediaProfileName
        }

        console.log('post social channels followers');
        let url = "influencer/socialmedia/follower";

         return this._http.postRequest(url, body);
           

        // ageGroups.forEach(obj => {
        //     body.audienceAgeGroupData.push({
        //         ageGroupId: obj.id,
        //         percentageCount: obj.percentageCount});
        //});
        // return this._http.post(url,body).map((res: Response) => res)
        //     .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getSocialEngagementList(): Observable<any> {
        let getUrl = "setup/socialengagements/list";
        return this._http.getRequest(getUrl).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));;
    }
}