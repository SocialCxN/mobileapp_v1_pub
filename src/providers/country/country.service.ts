
import { HttpService } from "../base/http.service";
import { Http, RequestOptionsArgs, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";

@Injectable()
export class CountryService {

    getUrl: string;
    constructor(private _http: HttpService) { }

    public getCountries(): Observable<any> {
        return this._http.getRequest('country').map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));;
    }

    public getStates(countryId: any): Observable<any> {
        this.getUrl = "states"
        return this._http.getRequest(`${this.getUrl}/${countryId}`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getCities(stateId: any): Observable<any> {
        this.getUrl = "cities"
        return this._http.getRequest(`${this.getUrl}/${stateId}`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getZipCodes(countryId: number, zipCode: string): Observable<any> {
        this.getUrl = "location";
        return this._http.getRequest(`${this.getUrl}/${countryId}/${zipCode}`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}