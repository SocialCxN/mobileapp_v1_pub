import { ViewChild,Component, OnInit, Inject, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { User } from "../../models/user";
import { AuthProvider } from "../../providers/auth/auth";
import { UIService } from "../../providers/ui/ui.service";
import { Notifications } from "../../models/notification/notification";
import { NotificationService } from "../../providers/general/notification.service";
import { NotificationArray } from "../../models/notification/notification.array";
import { UtilityService } from "../../providers/general/utility.service";
import { BrandService } from "../../providers/brand/brand"
import { Messaging } from "../../models/messaging";
import { Message, MessageTypes } from "../../models/message";
import { NavController , LoadingController, NavParams, App, Events, Content } from 'ionic-angular';

import { LoaderComponent} from '../../shared/loader/loader';
@Component({
    selector: 'page-messaging',
    templateUrl: 'messaging.component.html'
})
export class MessagingComponent implements OnInit, OnChanges {

    @ViewChild("chatScroll") content: Content;

    isLogin: any;

    user: User = new User();
    campaignList = new Array<any>();
    influencersList = new Array<any>();

    showAllNotif = new Array<NotificationArray>();
    newLimitValue: number;
    newOffsetValue: number;
    status: boolean = true;
    campaignName: string;
    messageTitle: string;
    message: string;
    isEnter: boolean = false;
    sendCheckMessage: boolean = false;
    hideGetMoreButton: boolean = false;
    finalMessage = new Messaging();
    messageDetails: any;
    messages = new Array<any>();
    campaignUserName = new Array<any>();
    entityHeading: string;
    conversationDetail: any;

    constructor( private _authService: AuthProvider, private _uiService: UIService,
        private navCtrl: NavController,
        private utilityService: UtilityService,
        private _messagingService: BrandService,
        private loader: LoaderComponent
    ) {
    }

    ngOnInit(): void {


        this.messageDetails = { id: '', type: "", limitValue: '', offsetValue: '' }
        this.conversationDetail = { campignLimitValue: 10, campignOffsetValue: 0, entityLimitValue: 10, entityOffsetValue: 0 }

        this.isLogin = this._authService.isLoggedIn();
        this.user = this._authService.getUser();
        this._authService.getUser().then((res)=> {
            this.user = res;
                    //Check if the brand has permission to view notification page
            if (this.user.entityType === 'brand') {
                this.entityHeading = "Influencers"
            } else if (this.user.entityType === 'influencer') {
                this.entityHeading = "Brands"
            }
            this.getConversationList();
        })
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    showChat = false;
    getConversationList() {
        let post = {
            offsetValue: 0,
            limitValue: 10
        };
        this.loader.show("Please wait..")
        this._messagingService.viewConversationList().subscribe(
            (res) => {
                this.showChat= true;
                this.campaignList = res.campaignList;
                this.influencersList = res.entityList;
                console.log('list dataaaaaaa', res)
                this.loader.hide();
            },
            (error) => {
                console.error(error)
                this.loader.hide();
            });
    }

    selectUser(data, index) {
        console.log('data------------', data);
        console.log('index------------', index);
        this.num = this.num == 1 ? 2 : 1;

        this.campaignUserName = [];
        try {
            if (data.type == "campaign") {
                this.messageTitle = data.campaignName;
                this.finalMessage.campaignId = data.id
                this.finalMessage.entityId = null
                this.finalMessage.subject = ""
                //for changing recent-current message color
                this.campaignList[index].thisChatUnreadStatus = false


                //printing campaign userNames
                if (data.users.length > 0) {
                    data.users.forEach(element => {
                        this.campaignUserName.push(element);
                    });
                }

                //get messages object
                this.messageDetails.id = data.id
                this.messageDetails.type = data.type

                this.getMessages();

            } if (data.type == "entity") {

                this.finalMessage.campaignId = null
                this.finalMessage.entityId = data.id
                this.messageTitle = data.entityName;

                //for changing recent-current message color
                this.influencersList[index].thisChatUnreadStatus = false


                //get messages object
                this.messageDetails.id = data.id
                this.messageDetails.type = data.type

                this.getMessages();
            }


        } catch (err) {

        }


    }

    isEnterCheck() {
        this.sendCheckMessage = (this.isEnter == true ? true : false)
        console.log('val', this.sendCheckMessage);
    }

    sendMessage() {
        if (this.sendCheckMessage == true) {
            this.saveMessage()
        }
    }

    saveMessage() {
        if (this.message) {
            this.finalMessage.messageBody = this.message;

            this._messagingService.saveConversation(this.finalMessage).subscribe(
                (res) => {
                    this.messages.push({ type: 'sender', message: this.message, date: new Date().toDateString() })
                    console.log('data----------', this.messages);
                    this.message = "";

                    // this.content.scrollToBottom();
                    // this.ScrollToBottom();
                    // let msg = new Message();
                    // msg.msg = "message sent successfully";
                    // msg.msgType = MessageTypes.Information;
                    // msg.autoCloseAfter = 400;
                    // this._uiService.showToast(msg, "info");
                },
                (error) => {

                    let msg = new Message();
                    msg.msg = "Please Select Anyone ";
                    msg.msgType = MessageTypes.Error;
                    msg.autoCloseAfter = 400;
                    this._uiService.showToast(msg, "info");
                    console.error(error);
                }
            );
            console.log('calling save api');
        }

    }

    getMessages() {

        if (this.messageDetails) {

            this._messagingService.getConversations(this.messageDetails).subscribe(
                (res) => {

                    this.messages = res.messages;

                    console.log('message', this.messages);
                    // let msg = new Message();
                    // msg.msg = "message sent successfully";
                    // msg.msgType = MessageTypes.Information;
                    // msg.autoCloseAfter = 400;
                    // this._uiService.showToast(msg, "info");
                },
                (error) => {
                    console.error(error);
                }
            );
            console.log('calling save api');
        }



    }


    loadCampaigns() {

    }

    loadUsers() {

    }

    num : Number = 1;
    pop() {
        if (this.num == 1) {
            this.navCtrl.pop();
        }
        else {
            this.num =1;
        }
    }

    ScrollToBottom(){
        var element = document.getElementById("myLabel");
        // I can't remember why I added a short timeout, 
        // but you might be able to use ngzone instead.
        // the below works great though. 
        setTimeout(()=>{element.scrollIntoView(true)},200); 
    }
}