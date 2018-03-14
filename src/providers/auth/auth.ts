import { Http, RequestOptions, Headers} from "@angular/http";
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Rx";

import { User } from "../../models/user";
import { BrandProfile } from "../../models/brand.profile";

import 'rxjs/add/operator/map';
import { environment } from "../../environments/environment";
import { Storage } from '@ionic/storage';


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider implements OnDestroy {

	loginStatusChanged = new Subject<User>();

    private _clientId: string = '';
    private _clientSecret: string = '';

  constructor(public _http: Http, public storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }

    ngOnDestroy(): void {
        console.log("destorying auth service");
    }

        /**
    * Build API url.
    * @param url
    * @returns {string}
    */
    protected getFullUrl(url: string): string {
        return environment.apiBaseUrl + url;
    }

    
    protected mapUser(res : any) : User{ 
        let userData = res.json().genericResponse.genericBody.data.userData;
                let isUser = new User();
                isUser.fullName =  userData.entity.entityName;
                isUser.loginEmail =  userData.loginEmail;
                isUser.firstName =  userData.firstName;
                isUser.lastName =  userData.lastName;
                isUser.accountVerified =  userData.accountVerified;
                isUser.lastLogin =  userData.lastLogin;
                isUser.created =  userData.created;
                isUser.updated =  userData.updated;
                isUser.entityType =  userData.entity.entityType;
                isUser.entityId =  userData.entity.id;
                isUser.entityName =  userData.entity.entityName;
                isUser.webUrl =  userData.entity.websiteUrl;
                isUser.token =  userData.token.token;
                isUser.id =  userData.id;
                isUser.subscriptionRequired = userData.entity.subscriptionRequired;
                isUser.subscription = userData.entity.subscription;
                isUser.permissions = userData.userRole.permissions;
        
                isUser.profilePic = userData.entity.profilePic;
                isUser.coverPic = userData.entity.coverPic;
                isUser.entityDescription = userData.entity.entityDescription;
                isUser.country = userData.entity.country.name;
                isUser.currency = userData.entity.currency || "null";
                isUser.minCampaignPaymentOffer = userData.entity.minCampaignPaymentOffer;
                // this.isUser.countryId =  userData.countryId;
                
                // let expiryTime = new Date(Date.now());
                // expiryTime.setSeconds(expiryTime.getSeconds() + userData.token.expiry);
                isUser.expiry =  Date.now() + (userData.token.expiry * 1000);

                isUser.roleId =  userData.userRole.id;
                isUser.roleName =  userData.userRole.roleName;
                isUser.userName =  userData.userName;
                
                return isUser;
    }


    isLoggedIn(): any {

       return this.getUser().then((user)=> {
        if (user && user.token && user.expiry) {
            if (user.expiry > Date.now())
                    return true;
            }
            else {
                 return false;
            }
       });



    //    this.loginStatusChanged.next(null);
       
    }
    

    checkLogin(user: User): Observable<any> {
        let url = this.getFullUrl('login');
        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        let body = {
            entityType: user.entityType,
            loginEmail: user.loginEmail,
            loginPassword: user.password,
            mobileDeviceToken: user.deviceToken
        }

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                //console.log(err);
                return Observable.throw(err);
            })
            .do((res) => {
                
                let isUser = this.mapUser(res);
                this.storeUser(isUser);
                this.loginStatusChanged.next(isUser);

            });
            // .finally(() => console.log("User Login successfully."));
    }


    forgotPassword(user: User): Observable<any> {
        let url = this.getFullUrl('forgetpassword');
        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');
       
        let body = {
            entityType: user.entityType,
            loginEmail: user.loginEmail,
        }

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                //console.log(err);
                return Observable.throw(err);
            });
    }


    resetPassword(user : User, key: string) : Observable<any>{
        
        let url = this.getFullUrl('forgetpassword/verify');
        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        let body = {
            verificationKey: key,
            loginPassword: user.password,
            confirmPassword: user.confirmPassword,
        }

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                //console.log(err);
                return Observable.throw(err);
            });
    }

 
    checkEntityNameAvailability(entityName, entityType): Observable<any> {

        let url = this.getFullUrl('name/available');

        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        let body = {
            entityName: entityName,
            entityType: entityType
        }

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
            //.finally(() => console.log("Check name availability is completed."))
            ;

    }

    checkEmailAvailability(emailAddress, entityType): Observable<any> {

        let url = this.getFullUrl('email/available');

        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        let body = {
            loginEmail: emailAddress,
            entityType: entityType
        }

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            }) ;

    }

    register(user: User): Observable<any> {

        //console.log('yes i am getting there');
        let url = this.getFullUrl('signup');
        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');
        //options.headers.append('Access-Control-Allow-Origin', '*');
        // if(user.fullName===""){
        //     user.fullName = "not available";
        // }

        let body = {
            entityType : user.entityType,
            entityName : user.fullName ,
            firstName : user.entityType === 'influencer' ? user.firstName : '',
            lastName : user.entityType === 'influencer' ? user.lastName : '',
            countryId : user.countryId.toString(),
            loginEmail : user.loginEmail,
            loginPassword : user.password,
            confirmPassword : user.confirmPassword,
            websiteUrl : user.webUrl?user.webUrl:''
        }

        if(user.fullName===""){
            user.fullName = "not available";
        }

      //  console.log(body);
        

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                //console.log(err);
                return Observable.throw(err);
            });
            // .finally(() => console.log("Signup request has been completed."))
    }

    verifyKey(key: string): Observable<any> {
        let url = this.getFullUrl('account/verify');
        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        let body = {
            verificationKey: key
        }

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
            // .finally(() => console.log("Email verification has been completed."));
    }

    resendEmail(user:User): Observable<any> {
        let url = this.getFullUrl('accountverification/resend');
        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        let body = {
            loginEmail: user.loginEmail,
            entityType: user.entityType
            }            
        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
            // .finally(() => console.log("Email verification has been completed."));
    }

    getApiToken(): Observable<Headers> {
        return Observable.fromPromise(this.storage.get('api_token'));
       //OR return Observalbe.of(this.storage.get('api_token'));
    }

    getToken(): any {
        let user = this.getUser();       
        
        return this.getUser().then( (user) => {    
        if (user && user.token)
            return user.token;
        else
            return null;    
        });
    }

    getLoggedinUser(): User {
        return this.getUser();
    }

    public storeUser(user: User) {
        if (!user) return;

        this.storage.set('user', JSON.stringify(user));
        this.storage.set('api_token', user.token);
        // console.log("user stored in local storage");
    }

    public storeUrlPath(urlPath: string) {
        this.storage.set('urlPath', JSON.stringify(urlPath));
    }

    getUrlPath():any {
		this.storage.get('urlPath').then((value) => {
			return JSON.parse(value);
		})
    }

    getUser(): any {
        return this.storage.get('user').then((value) => {
			return JSON.parse(value);
		})
    }

    logoutUser(): any {
        return this.storage.clear().then(()=>{
            this.loginStatusChanged.next(null);
            return true;
        });
        
    }


}
