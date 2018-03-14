import { Http, RequestOptions, Headers } from "@angular/http";
import { HttpService } from "../base/http.service";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import { User } from "../../models/user";
import { environment } from "../../environments/environment";
import {BrandProfile} from "../../models/brand.profile";
import { DigitalBrandProfile } from "../../models/digital-agency/brand.profile";
import { BrandUsers } from "../../models/digital-agency/brand.user";


@Injectable()
export class BrandService  {

    constructor(private _http: HttpService) {
    }

    ngOnDestroy(): void {
        console.log("destorying brand service");
    }

     public getBrandProfile(): Observable<any> {
         
        let getUrl = "brand/profile";
    
        return this._http.getRequest(getUrl)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public viewConversationList(): Observable<any> {
        let getUrl = "conversation/list";
        let body = {
            searchByCampaignName: "",
            campignLimitValue: 300,
            campignOffsetValue: 0,
            searchByEntityName: "",
            entityLimitValue: 300,
            entityOffsetValue: 0
        }
        return this._http.postRequest(getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getConversations(message): Observable<any> {
        let getUrl = "conversations";
        let body = {
            id: message.id,
            type: message.type,
            limitValue: 800,
            offsetValue: 0
        }
        return this._http.postRequest(getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    

    public saveConversation(message): Observable<any> {
        let getUrl = "save/conversation/details";
        let body = {
            campaignId: message.campaignId,
            entityId: message.entityId,
            subject: message.subject || "",
            messageBody: message.messageBody,
        }
        return this._http.postRequest(getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public updateBrandInfo(user:User, brand: BrandProfile): Observable<any> {
        let getUrl = "brand/profile/basicinfo";
        
        let body = {
                        entityType: user.entityType,
                        entityId: brand.id?brand.id.toString():'',
                        entityName: brand.brandName,
                        industryId: brand.industryId?brand.industryId.toString():'',
                        entityDescription: brand.about,
                        websiteUrl: brand.webUrl,
                        contactNumber: brand.contactNumber,
                        countryId: brand.countryId?brand.countryId.toString():'',
                        stateId : brand.stateId === null ? '' : brand.stateId.toString(),
                        cityId : brand.cityId === null ? '' : brand.cityId.toString(),
                        zipCode: brand.zipCode,
                        streetOne: brand.streetOne,
                        streetTwo: brand.streetTwo
                    }    

        return this._http.putRequest(getUrl,body)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    updateBrandUserInfo(user: User) : Observable<any> {
        let getUrl = 'brand/user/profile';
        let body = {
                        entityType: user.entityType,
                        userId: user.id.toString(),
                        firstName: user.firstName,
                        lastName: user.lastName,
                    }    
        return this._http.putRequest(getUrl,body)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }
       

      // ------------------DIGITAL AGENCY SERVICES-------------------------------------------

      public getDigitalAgencyProfile(): Observable<any> {
        let url = "digitalagency/profile";

        return this._http.get(url)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public updateDigitalAgencyInfo(user: User, brand: BrandProfile): Observable<any> {
        let getUrl = "digitalagency/profile/basicinfo";

        let body = {
            entityType: user.entityType,
            entityId: user.id ? user.id.toString() : '',
            entityName: brand.brandName,
            industryId: brand.industryId ? brand.industryId.toString() : '',
            entityDescription: brand.about,
            websiteUrl: brand.webUrl,
            contactNumber: brand.contactNumber,
            countryId: brand.countryId ? brand.countryId.toString() : '',
            stateId: brand.stateId === null ? '' : brand.stateId.toString(),
            cityId: brand.cityId === null ? '' : brand.cityId.toString(),
            zipCode: brand.zipCode,
            streetOne: brand.streetOne,
            streetTwo: brand.streetTwo
        }

        return this._http.put(getUrl, body)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    updateDigitalAgencyUserInfo(user: User): Observable<any> {
        let getUrl = 'digitalagency/user/profile';
        let body = {
            entityType: user.entityType,
            userId: user.id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
        }
        return this._http.put(getUrl, body)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }


    public getDigitalAgencyBrands(): Observable<any> {
        let url = "digitalagency/associated/brands";

        return this._http.get(url)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postDigitalAgencyAddBrand(post): Observable<any> {
        let getUrl = 'digitalagency/add/brand';
        let body = {
            entityName: post.brandName,
            countryId: post.countryId.toString(),
            firstName: "",
            lastName: "",
            loginEmail: post.loginEmail,
            websiteUrl: post.webUrl,
            termsAgree: post.termsAgree
        }
        return this._http.post(getUrl, body)
            .map((res: Response) => res)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getDigitalAgencyBrandProfile(id): Observable<any> {
        let getUrl = 'digitalagency/brand/profile';
        let body = {
            brandId: id
        }
        return this._http.post(getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postDigitalAgencyBrandProfileBasicInfo(brand: DigitalBrandProfile): Observable<any> {
        let getUrl = 'digitalagency/brand/profile/basicinfo';
        let body = {
            entityType: 'brand',
            entityId: brand.id.toString(),
            entityName: brand.name,
            industryId: brand.industry.id.toString(),
            entityDescription: brand.entityDescription,
            websiteUrl: brand.websiteUrl,
            contactNumber: brand.contactNumber,
            countryId: brand.country.id.toString(),
            stateId: brand.state.id.toString(),
            cityId: brand.city.id.toString(),
            zipCode: brand.zipCode,
            streetOne: brand.streetOne,
            streetTwo: brand.streetTwo,
        }
        return this._http.put(getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postDigitalAgencyBrandProfileUserInfo(brandUsers: BrandUsers): Observable<any> {
        let getUrl = 'digitalagency/brand/user/profile';
        let body = {
            userId: brandUsers.id.toString(),
            firstName: brandUsers.firstName,
            lastName: brandUsers.lastName,
            entityType: 'brand',
        }
        return this._http.put(getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    createBrandUser(user): Observable<any> {
        let getUrl = 'brand/user/add';
        let body = {
            firstName: user.firstName,
            lastName: user.lastName,
            loginEmail: user.loginEmail,
            loginPassword: user.password,
            confirmPassword: user.confirmPassword,
            roleId: user.roleId,
        }
        return this._http.post(getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((err, caught) => {
                let error = err.json().genericResponse.genericBody;
                return Observable.throw(error);
            })
    }


    editBrandUser(user: User): Observable<any> {
        let getUrl = 'brand/user/edit';
        let body = {
            firstName: user.firstName,
            lastName: user.lastName,
            roleId: user.roleId,
            userId: user.id
        }
        return this._http.put(getUrl, body)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getBrandUserList() {

        let url = "brand/users";

        return this._http.get(url)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

    getBrandSubscriptionList() {

        let url = "brand/subscription/options";

        return this._http.get(url)
            .map(res => { return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

    getBrandSubscriptionFeaturesList() {

        let url = "brand/subscription/features/available";

        return this._http.get(url)
            .map(res => { return res.json().genericResponse.genericBody.data.features })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

}