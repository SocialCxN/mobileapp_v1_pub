import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class CountryIdService {
//   private id = new BehaviorSubject<string>("");
//   currentId = this.id.asObservable();
  constructor() { }
//   changeId(message: string) {
//     this.id.next(message)
//   }

   
  public id = 0;
  
   get() {
     return this.id;
   }
  
   set(id: any) {
     this.id = id;  
   }
   
//    decrement() {
//      this.count--;
//    }
   
}