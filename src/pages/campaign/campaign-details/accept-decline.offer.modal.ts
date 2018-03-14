import { Component, OnInit, Inject, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Message, MessageTypes } from "../../../models/message";
import { UIService } from "../../../providers/ui/ui.service";

import { CampaignService } from "../../../providers/campaign/campaign.service";


@Component({
    selector: 'page-accept-decline.offer.modal',
    templateUrl: 'accept-decline.offer.modal.html'
  })
export class AcceptDeclineOffer {

    grossOffer: String;
    serviceCharges : String;
    netOffer: String;
    rejectReason: string;
    rejectError: boolean = false;
    
    acceptOfferDetails: any;
    action: String;
    brandName : String;
    constructor(public viewCtrl: ViewController, params: NavParams,
    private _campaignService: CampaignService, private _uiService :UIService) {
        this.grossOffer = params.get("gCurrency") + " " + params.get("grossOffer");
        this.serviceCharges = params.get("serviceCharges") + " " + params.get("serviceSymbol");
        this.netOffer = params.get("nCurrency") + " " + params.get("netOffer");
        this.action = params.get("action");
        this.brandName = params.get("brandName");
        console.log("Action is", this.action, params);
        let obj;

            obj = {
                campaignId: params.get("campaignId"),
                brandName: params.get("brandName"),
                gCurrency:params.get("gCurrency"),
                grossOffer: params.get("grossOffer"),
                serviceSymbol: params.get("serviceSymbol"),
                serviceCharges:params.get("serviceCharges"),
                netOffer: params.get("netOffer"),
                nCurrency: params.get("nCurrency"),
            };
        this.acceptOfferDetails = obj;
        
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }
    
    negotiateOffer() {
        
    }

    declineOffer() {
        this._campaignService.rejectCampaignOffer(this.acceptOfferDetails.campaignId, this.rejectReason).subscribe(
            (res) => {
                console.log("response", res);
               let msg = new Message();
                msg.msg = "Your campaign offer has rejected successfully";
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                this.viewCtrl.dismiss();
            },
            (err) => {
                console.log(err);
                let msg = new Message();
                msg.msg = "Sorry, an error has occured";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                this.viewCtrl.dismiss();
            });
    }
    acceptOffer() {
        this._campaignService.acceptCampaignOffer(this.acceptOfferDetails.campaignId).subscribe(
            (res) => {
                console.log("response", res);
                let msg = new Message();
                msg.msg = "Your campaign offer has accepted successfully";
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                this.viewCtrl.dismiss();
            },
            (err) => {
                console.log(err);
                let msg = new Message();
                msg.msg = "Sorry, an error has occured";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
                this.viewCtrl.dismiss();
            });
    }
}