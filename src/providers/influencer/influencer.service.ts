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
import { BankInfo } from "../../models/payment/bank.info";
import { PaymentGatewayDetails } from "../../models/payment/payment.gateway.details";

@Injectable()
export class InfluencerService {

    //onInfluencerChange = new Subject<Influencer>();

    constructor(private _http: HttpService) {
    }

    mapTo(res) {
        //console.log(res.json().genericResponse.genericBody.data);
        let influencer = new Influencer();
        influencer = res.json().genericResponse.genericBody.data.influencer;
        influencer.profile.gender = res.json().genericResponse.genericBody.data.influencer.users[0].gender;
        // this.onInfluencerChange.next(influencer);
        return influencer;
    }

    updatePersonalInfo(user: User, influencer: Influencer, selectedValues) {

        let getUrl = "influencer/profile/basicinfo";
        console.log("influencer", influencer);


        let body = {
            entityType: user.entityType,
            entityId: user.entityId.toString(),
            entityName: user.entityName,
            userId: user.id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            entityDescription: influencer.profile.entityDescription,
            gender: influencer.profile.gender,
            countryId: influencer.profile.country.id && influencer.profile.country.id != 0 ? influencer.profile.country.id.toString() : '',
            stateId: influencer.profile.state.id && influencer.profile.state.id != 0 ? influencer.profile.state.id.toString() : '',
            cityId: influencer.profile.city.id && influencer.profile.city.id != 0 ? influencer.profile.city.id.toString() : '',
            zipCode: influencer.profile.zipCode,
            contactNumber: influencer.profile.contactNumber,
            influencerObjectiveIds: selectedValues
        }

        // influencer.objectiveDetails.forEach(obj => {
        //     body.influencerObjectiveIds.push(obj.id);
        // });

        return this._http.putRequest(getUrl, body);
    }

    getInfluencerObjects() {
        let url = "influencer/types";
        return this._http.getRequest(url)
            .map(res => { return res.json().genericResponse.genericBody.data.influencerTypes });
    }

    getPersonalInfo() {
        let getUrl = "influencer/profile";
        return this._http.getRequest(getUrl)
            .map(res => this.mapTo(res));
    }

    getInterestGroups() {
        return this._http.getRequest('interestgroups');
    }

    saveInterstGroups(entityId: number, interestGroupIds: number[]) {

        let body = {
            entityType: 'influencer',
            entityId: entityId.toString(),
            interestIds: interestGroupIds
        }
        return this._http.putRequest('influencer/interests', body);
    }

    saveBankInfo(entityId: number, countryId: number, bankInfo: BankInfo): Observable<any> {
        let url = 'influencer/paymentinfo/bank';
        console.log("countryId:", countryId);

        let body = {
            id: bankInfo.id != 0 ? bankInfo.id.toString() : '',
            bankName: bankInfo.bankName,
            entityId: entityId.toString(),
            branchName: '',
            ibanNumber: bankInfo.ibanNumber,
            routingNumber: bankInfo.routingNumber,
            ntnNumber: bankInfo.ntnNumber,
            accountNumber: bankInfo.accountNumber,
            accountTitle: bankInfo.accountTitle,
            countryId : countryId.toString()
        };

        return this._http.postRequest(url, body);

    }

    savePaymentGatewayInfo(entityId, paymentGateWayId: number, countryId: number, paymentGatewayDetails: PaymentGatewayDetails): Observable<any> {
        let url = 'influencer/paymentinfo/gateway';
        // let body = {
        //     id: paymentGatewayDetails.id,
        //     paymentgatewayId: paymentGateWayId,
        //     entityId: entityId.toString(),
        //     registeredEmail: paymentGatewayDetails.email,
        //     registeredContactNumber: paymentGatewayDetails.mobileNumber,
        // }

        let body = {
            id: paymentGatewayDetails.id,
            paymentgatewayId: paymentGateWayId,
            entityId: entityId.toString(),
            registeredEmail: paymentGatewayDetails.email,
            registeredContactNumber: paymentGatewayDetails.mobileNumber,
            accountType: null,
            authorizeCode: paymentGatewayDetails.accountId
        }

        return this._http.postRequest(url, body);
    }
    public getDetailsViaRouting(routingNumber: any): Observable<any> {
        let getUrl = "bank";

        return this._http.getRequest(`${getUrl}/${routingNumber}`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


}