import { Http, RequestOptions, Headers } from "@angular/http";
import { HttpService } from "../base/http.service";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import { User } from "../../models/user";
import { environment } from "../../environments/environment";
import {BrandProfile} from "../../models/brand.profile";
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileModel } from "../../models/file.model";
import { AuthProvider } from "../auth/auth";


@Injectable()
export class FileUploadService  {

    user: User = new User();

    constructor(private _http: HttpService,
        private file: File,private transfer: FileTransfer, private _authService: AuthProvider) {
    }

    ngOnDestroy(): void {
        console.log("destorying brand service");
    }

    apiUrl = environment.apiBaseUrl;

    downloadDoc(url) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        var filename = url.substring(url.lastIndexOf('/')+1);
        fileTransfer.download(url, this.file.dataDirectory + filename ).then((entry) => {
            console.log('download complete: ' + entry.toURL());
          }, (error) => {
            // handle error
          });
    }

    //: Observable<any>
    uploadCampaignReportFiles(files: Array<FileModel>, model) {
        console.log("files are" , files, model);
        let promises_array:Array<any> = [];
        const fileTransfer: FileTransferObject = this.transfer.create();
        return this._authService.getUser().then((user)=> {
        
            
            
            let token = user.token;                            

            let that = this;
            for (let file of files) {
                let extension = file.mimeType.split("/")[1];
                if (extension == "vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    extension = "docx";
                }

                if (extension == "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    extension = "xlsx";
                }
                let options: FileUploadOptions = {
                    fileKey: 'file',
                    fileName: model.campaign.name + "." + extension,
                    headers: {
                        token: token,
                        'x-api-version': '1.1.0'
                    },
                    params: {
                        campaignId: model.campaign.id,
                        entityId: user.entityId,
                        socialChannelId: model.socialMediaChannel.id
                    },
                    mimeType: file.mimeType
                }
                promises_array.push(new Promise(function(resolve,reject) {
    
                    fileTransfer.upload(file.data, that.apiUrl+  'campaign/report/attachment', options)
                    .then((data) => {
                        console.log("succes", data);
                        resolve(data);
                      // success
                    }, (err) => {
                        console.log("error", err);
                        reject(err);
                      // error
                    })
                }));
            }

            return Promise.all(promises_array);

        })
    }

    uploadCampaignAttachment(files: Array<FileModel>, model) {
        console.log("files are" , files, model);
        let promises_array:Array<any> = [];
        const fileTransfer: FileTransferObject = this.transfer.create();
        return this._authService.getUser().then((user)=> {
        
            
            
            let token = user.token;                            

            let that = this;
            for (let file of files) {
                let extension = file.mimeType.split("/")[1];
                if (extension == "vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    extension = "docx";
                }

                if (extension == "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    extension = "xlsx";
                } 
                let options: FileUploadOptions = {
                    fileKey: 'file',
                    fileName: model.campaigName + "." + extension,
                    headers: {
                        token: token,
                        'x-api-version': '1.1.0'
                    },
                    params: {
                        campaignId: model.id,
                        entityId: model.entityId
                    },
                    mimeType: file.mimeType
                }
                promises_array.push(new Promise(function(resolve,reject) {
    
                    fileTransfer.upload(file.data, that.apiUrl+  'campaign/attachment', options)
                    .then((data) => {
                        console.log("succes", data);
                        resolve(data);
                      // success
                    }, (err) => {
                        console.log("error", err);
                        reject(err);
                      // error
                    })
                }));
            }

            return Promise.all(promises_array);

        })
    }
       
}