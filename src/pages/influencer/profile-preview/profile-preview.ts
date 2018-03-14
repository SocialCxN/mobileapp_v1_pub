import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges } from '@angular/core'
import { InfluencerSharedData } from "../../../shared/influencer.profile"
import { Influencer } from "../../../models/influencer/influencer";
import { User } from "../../../models/user";
import { AuthProvider } from "../../../providers/auth/auth";
import { NavController , NavParams, App, Platform  } from 'ionic-angular';

@Component({
    selector: 'page-profile-preview',
    templateUrl: 'profile-preview.html'
  })

export class ProfilePreviewPage  implements OnInit {
  influencer: Influencer = new Influencer();
  user = new User();

  coverPic: any;
  profilePic : any;
  constructor(private _navCtrl: NavController, private _sharedData: InfluencerSharedData,private _authService : AuthProvider) {

  }

  ngOnInit() {
    this.influencer = this._sharedData.getInfluencer();
    console.log("in pic influencer", this.influencer)
    this.coverPic = this.influencer.profile.coverPic.thumbnails.large;
    this.profilePic = this.influencer.profile.profilePic.thumbnails.medium;
    
    this._authService.getUser().then((res)=>{
      this.user = res;  
      
    });
  }

  pop() {
    this._navCtrl.pop();
}
}