import { Observable } from "rxjs/Observable";
import { Observer } from 'rxjs/Observer';
export class tab {
  data: any;
  dataChange: Observable<any>;
  dataChangeObserver: Observer<string>;

  constructor() {
    this.dataChange = new Observable((observer:Observer<string>)=> {
      this.dataChangeObserver = observer;
    });
  }

  setData(data:any) {
    this.data = data;
    //this.dataChangeObserver.next(this.data);
  }

  showTab() {
    return this.data;
  }
}