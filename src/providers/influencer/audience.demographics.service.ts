import { Http, RequestOptions, Headers } from "@angular/http";
import { HttpService } from "../base/http.service";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { User } from "../../models/user";
import { environment } from "../../environments/environment";
import { InterestGroup } from "../../models/influencer/interest.group";
import { InfluencerProfile } from "../../models/influencer/influencer.profile";
import { Influencer } from "../../models/influencer/influencer";
import { AgeGroups } from "../../models/influencer/audience-demographics/age.groups";
import { AudienceLocation } from "../../models/location/audience.location";

@Injectable()
export class AudienceDemographicsService {

    constructor(private _http: HttpService) {
    }

    getAgeGroups() {
        let url = "setup/agegroups/list";
        return this._http.getRequest(url).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postAudienceGender(malePercentage: number, femalePercentage: number) {
        let url = "influencers/socialmedia/audience/gender";

        let body = {
            malePercentage,
            femalePercentage,
        }

        return this._http.postRequest(url, body);


    }

    postAudienceAgeGroup(ageGroups: AgeGroups[]) {
        let url = "influencers/socialmedia/audience/agegroup";
        let body = {
            audienceAgeGroupData: []
        }

        ageGroups.forEach(obj => {
            body.audienceAgeGroupData.push({
                ageGroupId: obj.id,
                percentageCount: obj.percentageCount
            });
        });
        return this._http.postRequest(url, body).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postAudienceLocation(audienceLocation: AudienceLocation[]) {
        let url = "influencers/socialmedia/audience/location";
        let body = {
            audienceLocationData: []
        }
        audienceLocation.forEach(obj => {
            body.audienceLocationData.push({
                countryId: obj.country.id,
                stateId: obj.state.id,
                cityId: obj.city.id,
                percentageCount: obj.percentageCount
            });
        });
        return this._http.postRequest(url,body).map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }




}