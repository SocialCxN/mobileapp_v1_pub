import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpService } from '../base/http.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { User } from '../../models/user';
import { environment } from '../../environments/environment';

@Injectable()
export class InfluencerReferalService {

    constructor(private _http: HttpService) {
    }

    public getBackofficeReferralsInfo(limit, offset, searchKey): Observable<any> {
        const getUrl = 'backoffice/referrals/detail';
        const body = {
            searchByEntityName: searchKey,
            limitValue: limit,
            offsetValue: offset
        }
        return this._http.postRequest(getUrl, body).map(res=> res.json().genericResponse.genericBody.data)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public postReferals(emails): Observable<any> {
        const postUrl = 'influencer/refer/influencer';
        const body = {
            emails: emails
        };
        return this._http.postRequest(postUrl, body).map(res => res.json().genericResponse.genericBody)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}
