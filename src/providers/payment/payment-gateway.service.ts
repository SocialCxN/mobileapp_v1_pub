
import { HttpService } from "../base/http.service";
import { Http, RequestOptionsArgs, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { User } from "../../models/user";
import { BankDetails } from "../../models/payment/bank.details";
import { PaymentGateway } from "../../models/payment/paymentGateway";

@Injectable()
export class PaymentGatewayService {

    getUrl: string;
    constructor(private _http: HttpService) { }


    public getPaymentGateways(countryId: any): Observable<any> {
        this.getUrl = "getPaymentgatewayViaCountry";

        return this._http.getRequest(`${this.getUrl}/${countryId}`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

     public updateGatewayInfo(user: User, countryId: number, bank: BankDetails): Observable<any> {
        this.getUrl = "brand/paymentinfo/gateway";
       let body = {
            id: bank.paymentgatewayId,
            paymentgatewayId: bank.paymentgatewayId.toString(),
            entityId: user.entityId.toString(),
            registeredEmail: bank.registeredEmail,
            registeredContactNumber: bank.registeredContactNumber,
           
        }
       
        return this._http.postRequest(this.getUrl, body)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    

    
}