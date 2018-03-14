import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Message } from "../../models/message";
import { HttpService } from "../base/http.service";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs/Observable";
import { NavController, NavParams, ToastController, Slides } from 'ionic-angular';
import { Sidebar } from "../../models/nav/sidebar";

@Injectable()
export class UIService {
    
    /**
     * Hashtable to maintain label captions
     */
    captions = new Map<string,string>();

    /**
     * To keep track of the spinner status
     */
    spinnerStatus = new Subject<boolean>();

    /**
     * To keep track of the modal box
     */
    messageBoxStatus = new Subject<Message>();

    /**
     * To emit show toast events
     */
    toastStatus = new Subject<Message>();
    infoToastStatus = new Subject<Message>();
    navSidebar = new Subject<Sidebar>();
    /**
     * Constructor
     */
    constructor(private _http : HttpService, private toastCtrl: ToastController){}
    
    /**
     * Initialize UI Labels
     */
    initCaptions() { 
        this._http.get('config/entities/labels').subscribe(
            (res) => {
                let labels = res.json().genericResponse.genericBody.data.entitiesLabels;
                labels.forEach(label => {
                    this.captions[label.baseName] = label.displayName;
                });            
            }
        )       
        // this.footerService();
        // this.captions['influencer'] = 'Influencer';
        // this.captions['brand'] = 'Brand';
        // this.captions['digital_agency'] = 'Digital Agency';
        // this.captions['influencer_agent'] = 'Influencer Agent';

        //console.log(this.captions);
        
    }

    footerService(){

        let device = environment.device ;
        return this._http.get('config/footer/'+`${device}`)
                .map( res=> { return res.json().genericResponse.genericBody.data.footer});

   }
   headerService(){
    
            let device = environment.device ;
            return this._http.get('config/header/'+`${device}`)
                    .map( res=> { return res.json().genericResponse.genericBody.data.header});
    
       }
    
    /**
     * Show Toast
     * Background color depends on MessageType
     * Set autoCloseAfter parameter for auto close 
     * @param msg 
     */
    showToast(msg : Message, type : string){
        if(type=="info"){
            msg.iconType = "info";
            this.infoToastStatus.next(msg);
        }else{
            msg.iconType = 'error';
            this.toastStatus.next(msg);
        }
    }


    
    /**
     * Show popup modal box
     * Icon depends on MessageType
     * @param msg 
     */
    showMsgBox(msg : Message){
        this.messageBoxStatus.next(msg);
    }

    /**
     * Show Spinner 
     */
    showSpinner() {
        this.spinnerStatus.next(true);
    }

    /**
     * Hide Spinner
     */
    hideSpinner(){
        this.spinnerStatus.next(false);
    }

    presentToast(msg: string) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 2500,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    }

    navigationService() {
        let url = 'dynamic/navigations';
        let body = {
            deviceType: 'web'
        }
        return this._http.postRequest(url, body)
            .map(res => { 

                this.navSidebar.next(res.json().genericResponse.genericBody.data);
                return res.json().genericResponse.genericBody.data })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        ;
    }

}