import { NgModule } from '@angular/core';
import { HttpModule} from '@angular/http';
import { InfluencerSharedData } from './influencer.profile'
import {InfluencerCampaignSharedData } from "./campaign.influencer.shared";
import {LoaderComponent } from "./loader/loader";
import {SidemenuSharedData } from "./sidemenu.shared"
import { NotificationSharedData } from "./notification.shared"
@NgModule({
    imports : [HttpModule],
    providers: [InfluencerSharedData, NotificationSharedData,InfluencerCampaignSharedData, SidemenuSharedData],
    declarations : [LoaderComponent],
    exports : []
})
export class SharedModule{}