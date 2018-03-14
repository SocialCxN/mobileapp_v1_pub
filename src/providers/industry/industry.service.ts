
import { HttpService } from "../base/http.service";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";

@Injectable()
export class IndustryService {

    constructor(private _http: HttpService) { }

    public getIndustries(): Observable<any> {
        return this._http.getRequest('industries');
    }

   
}