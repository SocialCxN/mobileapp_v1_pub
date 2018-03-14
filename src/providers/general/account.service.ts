
import { HttpService } from "../base/http.service";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";

@Injectable()
export class AccountService {

    constructor(private _http: HttpService) { }

    disableAccountRequest(post, entityType) {

        let getUrl = '';
        let body;

        if (entityType === 'brand') {
            getUrl = 'brand/account/disable/request';
            body = {
                brandId: post.id,
                deleteReason: post.reason
            };
        }
        if (entityType === 'influencer') {
            getUrl = 'influencer/account/disable/request';
            body = {
                influencerId: post.id,
                deleteReason: post.reason
            }
        }
        if (entityType === 'influencer_agent') {
            getUrl = 'influenceragent/account/disable/request';
            body = {
                influencerAgentId: post.id,
                deleteReason: post.reason
            }
        }
        if (entityType === 'digital_agency') {
            getUrl = 'digitalagency/account/disable/request';
            body = {
                digitalAgentId: post.id,
                deleteReason: post.reason
            }
        }
        return this._http.postRequest(getUrl, body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });

    }
}