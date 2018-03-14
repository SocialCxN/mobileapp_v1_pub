import { Http, RequestOptions, Headers } from "@angular/http";
import { HttpService } from "../base/http.service";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { File } from '@ionic-native/file';

@Injectable()
export class EventData {

  sbaList:any;

  constructor() {
    //this.sbaList = firebase.database().ref('/sbalist');
  }
 makeFileIntoBlob(_imagePath, name, type) {

  // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
  return new Promise((resolve, reject) => {
    (<any>window).resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

      fileEntry.file((resFile) => {

        var reader = new FileReader();
        reader.onloadend = (evt: any) => {
          var imgBlob: any = new Blob([evt.target.result], { type: type });
          imgBlob.name = name;
          resolve(evt.target.result);
        };

        reader.onerror = (e) => {
         alert('Failed file read: ' + e.toString());
          reject(e);
        };

        reader.readAsDataURL(resFile);
      });
    });
  });
}

getfilename(filestring){

   let file 
   file = filestring.replace(/^.*[\\\/]/, '')
   return file;
}

getfileext(filestring){
  let file = filestring.substr(filestring.lastIndexOf('.') + 1);
   return file;
}
getRequestFiles(sbaid): any {

   return this.sbaList.child('sbafiles');

  }

 addAssignmentFile(sbaid, file:any):any{

    return   this.sbaList.child(file.filename)
//Saves the file to storage
          .put(file.blob,{contentType:file.type}).then((savedFile) => {
//Gets the file url and saves it in the database
               this.sbaList.child('sbafiles').push({
               file: savedFile.downloadURL,
               name: file.filename,
               ext: file.fileext,
               type: file.type
          });
      })

  }
}