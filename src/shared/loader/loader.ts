import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

@Component({
    selector: 'loader',
    templateUrl : 'loader.html'
})
export class LoaderComponent  {
    loading:any;
    constructor(public loadingCtrl : LoadingController){
        
    }

    
    showWithPromise(text: string) {
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: text
        });
        return this.loading.present();
    }

    show(text: string) {
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: text
        });
        this.loading.present();
    }

    hide() {
        this.loading.dismiss();
    }
}