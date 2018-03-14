
import { HttpService } from "../base/http.service";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { Notifications } from "../../models/notification/notification";
import { Subject } from "rxjs/Subject";
@Injectable()
export class NotificationService {
    notificationChanged = new Subject<Notifications>();
    constructor(private _http: HttpService) { }

    public getNotifications(post): Observable<any> {
        let body = {
            offsetValue: post.offsetValue ,
            limitValue: post.limitValue ,
            deviceType: 'mobile'
        }
         return this._http.postRequest('notifications', body)
            .map(res => { 
                this.notificationChanged.next(res.json().genericResponse.genericBody.data);
                return res.json().genericResponse.genericBody.data 
            });
    }

    public getChatMessagesStatus(): Observable<any> {
     
        return this._http.getRequest('conversationsOverAll')
           .map(res => { return res.json().genericResponse.genericBody.data });
   }

    public updateNotifications(id): Observable<any> {
        let body = {
             id: id
        }

        return this._http.postRequest('notifications/update', body)
            .map(res => { return res.json().genericResponse.genericBody });
    }


}