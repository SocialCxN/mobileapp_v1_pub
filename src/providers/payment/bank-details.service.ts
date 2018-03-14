
import { HttpService } from "../base/http.service";
import { Http, RequestOptionsArgs, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { User } from "../../models/user";
import { BankDetails } from "../../models/payment/bank.details";
import { CreditCardInfo } from "../../models/payment/credit.card.info";

@Injectable()
export class BankDetailsService {

    getUrl: string;
    constructor(private _http: HttpService) { }


    public getDetailsViaRouting(routingNumber: any): Observable<any> {
        this.getUrl = "bank";

        return this._http.getRequest(`${this.getUrl}/${routingNumber}`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    public getServiceProviders(): Observable<any> {
        this.getUrl = "creditcard/serviceprovider";

        return this._http.getRequest(this.getUrl)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    public updateBankInfo(user: User,countryId: number, bank: BankDetails): Observable<any> {
        this.getUrl = "brand/paymentinfo/bank";
        let body = {
            id: bank.bankTableId,
            bankName: bank.bankName,
            entityId: user.entityId.toString(),
            branchName: bank.branchName,
            ibanNumber: bank.ibanNumber,
            routingNumber: bank.routingNumber,
            ntnNumber: bank.ntnNumber,
            accountNumber: bank.accountNumber,
            accountTitle: bank.accountTitle,
            countryId: countryId

        }
        return this._http.postRequest(this.getUrl, body)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public updateCardInfo(user: User, countryId: number, cardInfo: CreditCardInfo, serviceProviderId: number): Observable<any> {
        this.getUrl = "brand/paymentinfo/creditcard";
        // let body = {
        //     id: bank.creditCardTableId,
        //     creditCardNumber: bank.creditCardNumber,
        //     cvcValue: bank.cvcValue.toString(),
        //     expiryDate: bank.expiryDate,
        //     entityId: user.entityId.toString(),
        // }

        let body = {
            id: serviceProviderId.toString(),
            creditCardNumber: cardInfo.creditcardNumber,
            cvcValue: cardInfo.cvcValue.toString(),
            expiryDate: cardInfo.expiryDate,
            entityId: user.entityId.toString(),
            creditCardServiceProviderId: serviceProviderId.toString()
        }
        return this._http.postRequest(this.getUrl, body)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }



}