import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges } from '@angular/core'
import { NavController , NavParams, App, Platform  } from 'ionic-angular';
import { InterestGroup } from "../../../models/influencer/interest.group";
import { User } from "../../../models/user";
import { InfluencerService } from "../../../providers/influencer/influencer.service";
import { UIService } from "../../../providers/ui/ui.service";
import { Message, MessageTypes } from "../../../models/message";
import { AuthProvider } from "../../../providers/auth/auth";
import { LoaderComponent} from '../../../shared/loader/loader';
import { InfluencerSharedData } from "../../../shared/influencer.profile"
import { Influencer } from "../../../models/influencer/influencer";
@Component({
    selector: 'page-interest-groups',
    templateUrl: 'interest-groups.html'
  })

export class InterestGroupsPage implements OnInit, OnChanges {


    @Input() selectedInterests = new Array<InterestGroup>();
    influencer: Influencer = new Influencer();
    interestGroups = new Array<InterestGroup>();
    isSubmitStarted = false;
    user: User;
	public ionicNamedColor: string = 'primary';

    constructor(private _navCtrl:NavController,  private _influencerSharedData: InfluencerSharedData,
    	private _influencerService: InfluencerService,   
     private _uiService: UIService,
      private _authService : AuthProvider, public loader: LoaderComponent) {

    }
    ngOnInit(): void {
    	this.loader.show('Please wait..');
        this._authService.getUser().then((res)=>{
          	this.user = res;  
	        this._influencerService.getInterestGroups().subscribe(
	            (res) => {
	                this.interestGroups = res.json().genericResponse.genericBody.data.interestGroups;
	                this.loader.hide();
	                this.influencer =  this._influencerSharedData.getInfluencer();
	                for (let interest of this.influencer.interestDetails){
	                	for (let inf of this.interestGroups) {
	                		if (interest.id == inf.id) {
	                			inf.selected = true;
	                			inf.color = 'primary';
	                			break;
	                		}
	                	}
	                }
	            },
	            (err) => {
	            	this.loader.hide();
	                console.log(err);
	            }
	        )

	        this.selectedInterests.forEach(i => {
	            let selected = this.interestGroups.filter(ig => ig.id == i.id);
	            if (selected.length != 0) {
	                selected[0].selected = true;
	            }
	        });
        });



    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.selectedInterests) return;

        this.selectedInterests.forEach(i => {
            let selected = this.interestGroups.filter(ig => ig.id == i.id);
            if (selected.length != 0) {
                selected[0].selected = true;
            }
        });
    }

    onClick(interestGroup: InterestGroup) {
		interestGroup.selected = !interestGroup.selected;
		if (interestGroup.selected) {
			interestGroup.color = 'primary';
		}
		else {
			interestGroup.color = '';
		}
    }

    pop() {
        this._navCtrl.pop();
    }

   onSubmit() {

        if (!this.user) return;

        this.isSubmitStarted = true;
        let selected = this.interestGroups.filter(i => i.selected).map(i => i.id);
        if (selected.length < 3) {
            let empty = new Message();
            empty.msg = "Please select atleast 3 interest groups";
            empty.msgType = MessageTypes.Error;
            empty.autoCloseAfter = 400;
            //this._uiService.showToast(empty, "");

            this._uiService.presentToast(empty.msg);
            this.isSubmitStarted = false;
            return;
        }

        for (let i of this.interestGroups) {
        	if (i.selected) {
        		this.selectedInterests.push(i);
        	}
        }
        console.log(selected.length, this.selectedInterests);

        this._influencerService.saveInterstGroups(this.user.entityId, selected).subscribe(
            () => {
                this.isSubmitStarted = false;
                this.influencer.interestDetails = this.selectedInterests;
                this._influencerSharedData.setInfluencer(this.influencer);
                let msg = new Message();
                msg.msg = "Interest groups have been saved successfully.";
                msg.msgType = MessageTypes.Information;
                msg.autoCloseAfter = 400;
                //this._uiService.showToast(msg, "info");
                this._uiService.presentToast(msg.msg);
            },
            (error) => {
                this.isSubmitStarted = false;
                let msg = new Message();
                msg.msg = "Sorry, an error has occured";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
            }

        )
    }
}