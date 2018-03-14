
import { HttpService } from "../base/http.service";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";

@Injectable()
export class DashboardService {

    constructor(private _http: HttpService) { }

    getDashboard(entityType) {

        let getUrl = '';

        if (entityType === 'brand') {
            getUrl = 'brand/dashboard';

        }
        if (entityType === 'influencer') {
            getUrl = 'influencer/dashboard';

        }
        if (entityType === 'influencer_agent') {
            getUrl = 'influenceragent/dashboard';

        }
        if (entityType === 'digital_agency') {
            getUrl = 'digitalagency/dashboard';

        }
        return this._http.getRequest(getUrl)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((err, caught) => {
                return Observable.throw(err);
            });

    }
}