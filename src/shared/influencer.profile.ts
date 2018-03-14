import { Observable } from "rxjs/Observable";
import { Observer } from 'rxjs/Observer';
export class InfluencerSharedData {
  data: any;
  dataChange: Observable<any>;
  dataChangeObserver: Observer<string>;

  constructor() {
    this.dataChange = new Observable((observer:Observer<string>)=> {
      this.dataChangeObserver = observer;
    });
  }

  setInfluencer(data:any) {
    this.data = data;
    //this.dataChangeObserver.next(this.data);
  }

  getInfluencer() {
    return this.data;
  }
}