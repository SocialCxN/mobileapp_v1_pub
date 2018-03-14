import { Component, Input, OnInit, Inject, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NavController , NavParams, App } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { UIService } from '../../providers/ui/ui.service';
import { Message, MessageTypes } from '../../models/message';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { InfluencerReferalService } from '../../providers/influencer/influencer.referral.service';
import { Subject } from 'rxjs/Subject';

import { LoaderComponent} from '../../shared/loader/loader';

@Component({
    selector: 'page-referrals',
    templateUrl: 'referrals.html',
    // styleUrls: []
})
export class InfluencerReferralComponent implements OnInit, OnDestroy {

    isEmailAvailable = true;
    isPatternError = false;
    user: User = new User();
    emails = new Array();
    inputReferal = '';
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = false;
    isSubmitStarted = false;

    // Enter, comma
  //  separatorKeysCodes = [ENTER, COMMA];
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(private _authService: AuthProvider,
        public uiService: UIService, private referService: InfluencerReferalService, private navCtrl: NavController,public loader: LoaderComponent) {
    }

    ngOnInit(): void {
        // if (this._authService.isLoggedIn()) {
        //     this.user = this._authService.getUser();
        //     if (this.user.entityType !== 'influencer') {
        //         this._router.navigateByUrl('permission');
        //     }
        // } else {
        //     this._router.navigateByUrl('ib-login');
        // }
    }

    onSubmit() {
        this.isSubmitStarted = true;
        this.loader.show("Please wait..")
        this.referService.postReferals(this.emails).takeUntil(this.ngUnsubscribe).subscribe(
            (res) => {
                this.loader.hide();
                this.isSubmitStarted = false;
                console.log('sent', res);
                this.emails = [];
                const msg = new Message();
                if (res.message) {
                    msg.msg = res.message;
                } else {
                    msg.msg = 'Email(s) has been sent';
                }
                msg.msg = res.message;
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this.uiService.presentToast(msg.msg);
            },
            (err) => {
                this.loader.hide();
                this.isSubmitStarted = false;
                console.log('err', err);
                const msg = new Message();
                msg.msg = 'Sorry, an error has occured';
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this.uiService.presentToast(msg.msg);
            }
        );
    }

    pop() {
        this.navCtrl.pop();
    }

    add(event): void {
        //const input = event.input;
        const value = event.emailAdd;
        this.isEmailAvailable = true;

        // matching pattern
        const res = value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        if (!res) {
            this.isPatternError = true;
            return;
        }
        this.isPatternError = false;
        let match = false;

        // matching to the list of emails which user has entered
        this.emails.forEach(email => {
            if (email === value) {
                match = true;
                console.log('match', email);
                const msg = new Message();
                msg.msg = 'Already entered this email address';
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this.uiService.presentToast(msg.msg);
                return;
            }
        });

        if (match === false) {
            this.loader.show("Please wait..")
            this._authService.checkEmailAvailability(value, 'influencer')
                .subscribe(
                    () => {
                        this.isEmailAvailable = true;
                        this.loader.hide();
                        // add email
                        if (this.isEmailAvailable) {
                            if ((value || '').trim()) {
                                this.emails.push(value.trim());
                                console.log('this.emails', this.emails);
                            }
                            // Reset the input value
                            //if (input) {
                                this.inputReferal= '';
                            //}
                        }
                    },
                    (err) => {
                        this.isEmailAvailable = false;
                        const msg = new Message();
                        this.loader.hide();
                        msg.msg = 'This email address has already been registered as an influencer.';
                        msg.msgType = MessageTypes.Error;
                        msg.autoCloseAfter = 400;
                        this.uiService.presentToast(msg.msg);
                        return;
                    }
                );
        }

    }

    remove(email: any): void {
        const index = this.emails.indexOf(email);
        if (index >= 0) {
            this.emails.splice(index, 1);
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.unsubscribe();
    }
}
