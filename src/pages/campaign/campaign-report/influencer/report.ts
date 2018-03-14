
import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { UIService } from "../../../../providers/ui/ui.service";
import { CampaignService } from "../../../../providers/campaign/campaign.service";
import { CampaignReport } from "../../../../models/campaign/campaign.report";
import { InfluencerCampaignListModel } from "../../../../models/campaign/influencer.campaignlist";
import { ReportAttributes } from "../../../../models/campaign/attribute";
import { AuthProvider } from "../../../../providers/auth/auth";
import { User } from "../../../../models/user"
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FBService } from "../../../../providers/socialMedia/facebook.service";
import { Message, MessageTypes } from "../../../../models/message";
import { ChannelReport } from "../../../../models/influencer/channel.report";
import { InfluencerCampaignSharedData } from "../../../../shared/campaign.influencer.shared";
import { LoaderComponent } from '../../../../shared/loader/loader';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { environment } from '../../../../environments/environment';
import { FileModel } from "../../../../models/file.model";
import { FilePath } from '@ionic-native/file-path';
import { FileUploadService } from "../../../../providers/file/file.upload";
import { EventData } from "../../../../providers/file/event.data";
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { Clipboard } from '@ionic-native/clipboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ModalController, AlertController, NavController, Platform, NavParams, App, ActionSheetController } from 'ionic-angular';


declare var FilePicker: any;

@Component({
    selector: 'page-report',
    templateUrl: 'report.html'
})



export class InfluencerReport implements OnInit {
    isSubmitted = false;

    @Output() onSubmitStarted = new EventEmitter();
    @Output() onSubmitFinished = new EventEmitter<any>();
    campaign: InfluencerCampaignListModel = new InfluencerCampaignListModel();

    fb: CampaignReport = new CampaignReport();
    modelReport = new Array<ReportAttributes>();
    insta: CampaignReport = new CampaignReport();
    twitter: CampaignReport = new CampaignReport();
    snapchat: CampaignReport = new CampaignReport();
    linkedin: CampaignReport = new CampaignReport();
    tumblr: CampaignReport = new CampaignReport();
    pinterest: CampaignReport = new CampaignReport();
    utube: CampaignReport = new CampaignReport();

    postUrl: string;
    campId: number;
    reportStatus: string;
    user: User = new User();
    mediaLink: string;
    medialinksUrl: ReportAttributes = new ReportAttributes();
    isSubmitStarted = false;
    showManual: boolean = false;
    totalReach: number = 0;
    totalReachError: boolean = false;
    files = new Array<FileModel>();
    displayFiles = new Array<FileModel>();
    postLinks = new Array<ChannelReport>();
    link = new ChannelReport();
    postUrlLinks = new Array<string>();
    postURLError: boolean = false;
    urlError: boolean = false;
    url: any;
    fbPullData: boolean = true;
    reactions: any;
    comments: any;
    campaignId: number;
    isIos = false;
    model: any;

    _attachments = new Array<any>();

    utis = ['public.content', 'public.text', 'public.plain-text', 'com.apple.bundle', 'com.apple.application-bundle'];

    private isSubscribedToFBStatus = false;

    constructor(private _authService: AuthProvider, public eventsdata: EventData,
        private imagePicker: ImagePicker, private clipboard: Clipboard, private iab: InAppBrowser,
        private FilePath: FilePath, private _fileUploadService: FileUploadService,
        private transfer: FileTransfer, private file: File, private camera: Camera, private fileChooser: FileChooser, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController, private _fbService: FBService, private _influencerCampaignSharedData: InfluencerCampaignSharedData, public platform: Platform, private _navParams: NavParams,
        public _uiService: UIService, private _loader: LoaderComponent, private _campaignService: CampaignService, private _navCtrl: NavController) {
        //this.campaignId = this._navParams.get("campaignId");

        this.isIos = this.platform.is('ios') ? true : false;

    }


    pop() {
        this._navCtrl.pop();
    }

    presentConfirm() {

        let alert = this.alertCtrl.create({
            title: 'Confirm submit report',
            message: 'Are you sure you want to submit this report? Once submitted, report cant be modified.',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.onSubmit();
                    }
                }
            ]
        });
        alert.present();
    }

    ngOnInit() {
        this.model = this._navParams.get("model");
        console.log("model report is ", this.model);
        this.reportStatus = this.model.reportStatus.replace(/_/g, " ");

        this._authService.getUser().then((res) => {
            this.user = res;
            //Binding 
            if (this.model.socialMediaChannel.codeName === 'facebook') {
                this._fbService.postEngagement.subscribe(
                    (postInfo) => {

                        if (postInfo.type == "unknown") {
                            //alert('open karo model');
                            console.log("Custome Values");
                            // let dialogRef = this.dialog.open(InfluencerModelReport, {
                            //     width: '450px',
                            //     data: { model: this.modelReport }
                            // });

                            // dialogRef.afterClosed().subscribe(result => {


                            //     let final = this.postLinks.filter(item => item.urlLink == postInfo.link)
                            //     console.log('final data dekhana', final),
                            //         result.forEach(element => {
                            //             if (element.codeName == "reactions") {
                            //                 final[0].reactions = element.value;
                            //             }
                            //             if (element.codeName == "likes") {
                            //                 final[0].likes = element.value;
                            //             }
                            //             if (element.codeName == "comments") {
                            //                 final[0].comments = element.value;
                            //             }
                            //             if (element.codeName == "shares") {
                            //                 final[0].shares = element.value;
                            //             }
                            //             if (element.codeName == "video_views") {
                            //                 final[0].views = element.value;
                            //             }
                            //             if (element.codeName == "post_clicks") {
                            //                 final[0].postClick = element.value;
                            //             }

                            //         });


                            // });



                        }


                        console.log('================this is final=====', postInfo);

                        if (postInfo.type === "videos_post") {

                            console.log('final post data to iterate', postInfo.data.data);

                            let final = this.postLinks.filter(item => item.urlLink == postInfo.link)


                            postInfo.data.data.forEach(element => {
                                if (element.name == "total_video_views") {
                                    final[0].views = element.values[0].value;

                                }
                                if (element.name == "total_video_stories_by_action_type") {

                                    final[0].comments = element.values[0].value.comment;
                                    final[0].reactions = element.values[0].value.like;
                                    final[0].shares = element.values[0].value.share;
                                    final[0].engagment = element.values[0].value.comment + element.values[0].value.like + element.values[0].value.share;

                                }
                                if (element.name == "total_video_impressions_organic_unique") {

                                    final[0].reach = element.values[0].value;


                                }
                                if (element.name == "total_video_views_clicked_to_play") {
                                    final[0].postClick = element.values[0].value;

                                }
                                if (element.name == "total_video_reactions_by_type_total") {
                                    final[0].likes = element.values[0].value.like;
                                }


                            });




                        } else if (postInfo.type == "page_post") {

                            let final = this.postLinks.filter(item => item.urlLink == postInfo.link)

                            console.log("--------1-0-0-0-0-0-0-0-------- ", final);

                            final[0].comments = (postInfo.data.hasOwnProperty("comments") ? postInfo.data.comments.summary.total_count : 0);
                            final[0].reactions = (postInfo.data.hasOwnProperty("reactions") ? postInfo.data.reactions.summary.total_count : 0);
                            final[0].likes = (postInfo.data.hasOwnProperty("likes") ? postInfo.data.likes.summary.total_count : 0);
                            final[0].shares = (postInfo.data.hasOwnProperty("shares") ? postInfo.data.shares.summary.total_count : 0);
                            final[0].engagment = final[0].comments + final[0].likes + final[0].shares;

                            console.log('======++++++++++++++FINAL', this.postLinks);




                            if (postInfo.data.insights) {

                                postInfo.data.insights.data.forEach(element => {

                                    if (element.name == "post_consumptions") {

                                        final[0].postClick = element.values[0].value;
                                        //postClick = element.values[0].value;
                                    }
                                    if (element.name == "post_impressions_unique") {

                                        final[0].reach = element.values[0].value;
                                        //reach = element.values[0].value;
                                    }


                                });

                            }

                        } else if (postInfo.type == "single_post") {

                            let final = this.postLinks.filter(item => item.urlLink == postInfo.link)

                            console.log('----------SINGLE', postInfo);


                            final[0].comments = (postInfo.data.hasOwnProperty("comments") ? postInfo.data.comments.summary.total_count : 0);
                            final[0].reactions = (postInfo.data.hasOwnProperty("reactions") ? postInfo.data.reactions.summary.total_count : 0);
                            final[0].likes = (postInfo.data.hasOwnProperty("likes") ? postInfo.data.likes.summary.total_count : 0);
                            final[0].shares = (postInfo.data.hasOwnProperty("shares") ? postInfo.data.shares.count : 0);
                            final[0].engagment = final[0].reactions + final[0].comments + final[0].shares;
                            final[0].postClick = final[0].reactions;
                            final[0].reach = final[0].likes;


                        }

                        let comments = 0;
                        let likes = 0;
                        let reactions = 0;
                        let shares = 0;
                        let views = 0;
                        let postclicks = 0;
                        let reach = 0;
                        let engagment = 0;

                        this.postLinks.forEach(element => {

                            comments += element.comments;
                            postclicks += element.postClick;
                            reactions += element.reactions;
                            views += element.views;
                            likes += element.likes;
                            shares += element.shares;
                            reach += element.reach;
                            engagment += element.engagment;
                            console.log('ssadadadadadad', element.comments);
                            console.log('tttt', comments);
                        });

                        this.model.totalReach = reach;

                        console.log("Engagements are", engagment, "reaches are", reach);
                        let engageRate = +((engagment / reach) * 100).toFixed(0);
                        if (!isNaN(engageRate)) {
                            this.model.totalEngagementRate = +((engagment / reach) * 100).toFixed(0);
                        }
                        // this.model.totalEngagement = this.model.totalEngagementRate;

                        this.model.attributes.forEach(attr => {
                            if (attr.codeName == "comments") {
                                attr.value = comments;
                            }
                            if (attr.codeName == "post_clicks") {
                                attr.value = postclicks;
                            }
                            if (attr.codeName == "reactions") {
                                attr.value = reactions;
                            }
                            if (attr.codeName == "video_views") {
                                attr.value = views;
                            }
                            if (attr.codeName == "shares") {
                                attr.value = shares;
                            }
                            if (attr.codeName == "likes") {
                                attr.value = likes;
                            }

                        })
                    })

            }

            if (this.model.socialMediaChannel.codeName === 'twitter' ||
                this.model.socialMediaChannel.codeName === 'youtube' ||
                this.model.socialMediaChannel.codeName === 'instagram' ||
                this.model.socialMediaChannel.codeName === 'facebook' ||
                this.model.socialMediaChannel.codeName === 'linkedin' ||
                this.model.socialMediaChannel.codeName === 'pinterest' ||
                this.model.socialMediaChannel.codeName === 'tumblr'
            ) {
                //Binding 
                if (this.model.postUrls) {
                    for (var i = 0; i < this.model.postUrls.length; i++) {

                        let link = {
                            channel: "",
                            urlLink: this.model.postUrls[i],
                            postClick: 0, comments: 0, reactions: 0, engagment: 0, shares: 0, reach: 0, likes: 0, views: 0, engagmentRate: 0,
                        }
                        this.postLinks.push(link);
                    }

                }

                if (this.model.attachments) {
                    console.log('AAAAAAAAAAAA-----------', this.model.attachments)
                    this._attachments = this.model.attachments;
                }




            }
        });

    }


    removeLink(index) {
        if (index !== -1) {
            // this.model.attributes.forEach(attr => {
            //     if (attr.codeName == "comments") {
            //         attr.value -= this.postLinks[index].comments;
            //     }
            //     if (attr.codeName == "post_clicks") {
            //         attr.value -= this.postLinks[index].postClick;
            //     }
            //     if (attr.codeName == "reactions") {
            //         attr.value -= this.postLinks[index].reactions;
            //     }
            //     if (attr.codeName == "video_views") {
            //         attr.value -= this.postLinks[index].views;
            //     }
            //     if (attr.codeName == "shares") {
            //         attr.value -= this.postLinks[index].shares;
            //     }
            //     if (attr.codeName == "likes") {
            //         attr.value -= this.postLinks[index].likes;;
            //     }


            // })
            this.postLinks.splice(index, 1);

        }
        console.log('this data', this.postLinks);
    }

    getPost() {

        if (this.postUrl) {
            console.log("in get post")

            if (this.model.socialMediaChannel.codeName === 'facebook') {

                var fbpattern = new RegExp("(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/([\/\w \.-]*)*");
                var res = fbpattern.test(this.postUrl);
                if (!res) {
                    console.log("checking pattern", this.postUrl, res);
                    this.urlError = true;
                    let msg = new Message();
                    msg.msg = "Please enter a valid post URL";
                    msg.msgType = MessageTypes.Error;
                    msg.autoCloseAfter = 400;
                    this._uiService.presentToast(msg.msg);
                    return;
                }
                this.urlError = false;
            }


            // if (this.postUrl && this.model.socialMediaChannel.codeName === 'facebook') {
            //     console.log(" this.urlError", this.urlError);
            //     this.urlError = true;
            //     return;
            // }

            if (this.postUrl) {
                console.log("in get this post url", this.postUrl)
                let link = {
                    channel: "facebook",
                    urlLink: this.postUrl,
                    postClick: 0,
                    comments: 0,
                    reactions: 0,
                    engagment: 0,
                    shares: 0,
                    reach: 0,
                    likes: 0,
                    views: 0,
                    engagmentRate: 0,
                }

                var id = this.postLinks.length + 1;

                if (this.postLinks.length < 5) {

                    if (this.postLinks.filter(item => item.urlLink == this.postUrl).length == 0) {
                        this.postLinks.push(link);

                    } else {
                        let msg = new Message();
                        msg.msg = "It is already added in your list!";
                        msg.msgType = MessageTypes.Error;
                        msg.autoCloseAfter = 400;
                        this._uiService.presentToast(msg.msg);
                    }
                }

            }


            console.log('test this', this.postLinks);

            if (this.model.socialMediaChannel.codeName === 'facebook') {

                this._fbService.facebookStatus();
                if (!this.isSubscribedToFBStatus) {
                    this._fbService.checkStatus.subscribe(
                        (fb) => {
                            console.log("fb service response", fb);

                            if (fb.status == "connected") {
                                var fbPost = this.parseUrl(this.postUrl)
                                this.postUrl = "";
                                this._fbService.getPostInsights(fbPost);

                            } else if (fb.status == "unknown") {
                                let msg = new Message();
                                msg.msg = "Please connect your facebook or enter data manually";
                                this.fbPullData = false;
                                msg.msgType = MessageTypes.Error;
                                msg.autoCloseAfter = 400;

                                this._uiService.presentToast(msg.msg);
                                return;
                            }
                            // }else{
                            //     return;
                            // }

                        })
                    this.isSubscribedToFBStatus = true;
                }



            }
            else {
                this.postUrl = "";
            }

        }


    }


    apiUrl = environment.apiBaseUrl;
    images: any;

    onhold() {
        console.log("hello on hold");

        if (!this.isIos) {
            let alert = this.alertCtrl.create({
                title: 'Paste url',
                message: 'Are you sure you want to paste copied url here?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Paste',
                        handler: () => {
                            console.log('Buy clicked');
                            this.clipboard.paste().then(
                                (resolve: string) => {
                                    this.postUrl = resolve;
                                    this.getPost();
                                },
                                (reject: string) => {
                                    //alert('Error: ' + reject);
                                }
                            );
                        }
                    }
                ]
            });
            alert.present();
        }



    }

    fileIds = new Array<number>();
    uploadFiles() {
        this._loader.show("Please wait while files are uploading");
        this._fileUploadService.uploadCampaignReportFiles(this.files, this.model).then((res) => {

            let uploadedFiles = res;
            //  res.json().genericResponse.genericBody.data.userData;
            console.log("uploaded files", uploadedFiles);
            let count = 0;
            for (let i of uploadedFiles) {
                let res = JSON.parse(i.response);
                this.displayFiles.push(this.files[0]);
                this.files.splice(count, 1);
                //.json().genericResponse.genericBody.data.attachment;
                this.fileIds.push(res.genericResponse.genericBody.data.attachment.fileId);
            }
            let msg = new Message();
            msg.msg = "Files have been uploaded successfully";
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.presentToast(msg.msg);
            console.log("file ids", this.fileIds)

            this._loader.hide();
        }, (err) => {
            console.log("err", err);
            this._loader.hide();
        });
    }
    openActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Take action',
            buttons: [
                {
                    text: 'Camera',
                    role: 'Camera',
                    handler: () => {
                        const options: CameraOptions = {
                            quality: 100,
                            destinationType: this.camera.DestinationType.DATA_URL,
                            encodingType: this.camera.EncodingType.JPEG,
                            mediaType: this.camera.MediaType.PICTURE,
                            sourceType: this.camera.PictureSourceType.CAMERA
                        }
                        this.camera.getPicture(options).then((imageData) => {
                            // imageData is either a base64 encoded string or a file URI
                            // If it's base64:
                            let base64Image = 'data:image/jpeg;base64,' + imageData;
                            let file: FileModel = new FileModel();
                            file.data = base64Image;
                            file.type = 'image';
                            file.mimeType = 'image/jpeg';
                            this.files.push(file);
                            //this._fileUploadService.uploadCampaignReportFiles(this.files, this.model);

                        }, (err) => {
                            // Handle error
                        });
                    }
                },
                {
                    text: 'Gallery',
                    handler: () => {
                        const options: ImagePickerOptions = {
                            quality: 100,
                            maximumImagesCount: 10,
                            outputType: 0
                        }
                        this.imagePicker.getPictures(options).then((results) => {
                            for (var i = 0; i < results.length; i++) {
                                console.log('Image URI after selecting picture ----------: ' + results[i]);
                                let file: FileModel = new FileModel();
                                file.data = results[i];
                                file.type = 'image';
                                file.mimeType = 'image/jpeg';
                                this.files.push(file);

                                // this.eventsdata.makeFileIntoBlob(results[i], 'jpeg',"image/jpeg").then((fileblob) => {
                                //     //console.log("blob", fileblob);
                                //     let file : FileModel = new FileModel();
                                //     file.data = fileblob;
                                //     file.type = 'image';
                                //     file.mimeType = 'image/jpeg';
                                //     this.files.push(file);
                                // })
                                // let base64Image = 'data:image/jpeg;base64,' + results[i];
                                // let file : FileModel = new FileModel();
                                // file.data = results[i];
                                // file.type = 'image';
                                // this.files.push(file);
                            }
                        }, (err) => {
                            console.log("err in picking images", err);
                        });
                    }
                },
                {
                    text: 'Document',
                    role: 'Document',
                    handler: () => {
                        console.log('Cancel clicked');

                        if (this.platform.is('ios')) {
                            console.log("in iossss platform")
                            FilePicker.pickFile(
                                function (uri) {
                                    let correctPath = uri.substr(0, uri.lastIndexOf('/') + 1);
                                    let currentName = uri.substring(uri.lastIndexOf('/') + 1);
                                    console.log(correctPath);
                                    console.log(currentName);
                                },
                                function (error) {
                                    console.log("File error : ", error)
                                }
                                ,
                                function (utis) {
                                    console.log('UTIS', this.utis)
                                }
                            )
                        }
                        else {
                            this.fileChooser.open()
                                .then((uri) => {
                                    console.log(uri)
                                    // let file : FileModel = new FileModel();
                                    // file.data = uri;
                                    // file.type = 'pdf';
                                    // this.files.push(file);

                                    this.FilePath.resolveNativePath(uri).then((fileentry) => {
                                        let filename = this.eventsdata.getfilename(fileentry);
                                        let fileext = this.eventsdata.getfileext(fileentry);

                                        if (fileext == "pdf") {
                                            this.eventsdata.makeFileIntoBlob(fileentry, fileext, "application/pdf").then((fileblob) => {
                                                console.log("blob", fileblob);
                                                let file: FileModel = new FileModel();
                                                file.data = fileblob;
                                                file.type = 'pdf';
                                                file.mimeType = 'application/pdf';
                                                this.files.push(file);
                                            })
                                        }

                                        if (fileext == "docx") {
                                            this.eventsdata.makeFileIntoBlob(fileentry, fileext, "application/vnd.openxmlformats-officedocument.wordprocessingml.document").then((fileblob) => {
                                                console.log("blob", fileblob);
                                                let file: FileModel = new FileModel();
                                                file.data = fileblob;
                                                file.type = 'doc';
                                                file.mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                                                this.files.push(file);
                                            })
                                        }


                                        if (fileext == "doc") {
                                            this.eventsdata.makeFileIntoBlob(fileentry, fileext, "application/msword").then((fileblob) => {
                                                console.log("blob", fileblob);
                                                let file: FileModel = new FileModel();
                                                file.data = fileblob;
                                                file.type = 'doc';
                                                file.mimeType = "application/msword";
                                                this.files.push(file);
                                            })
                                        }

                                        if (fileext == "xlsx") {
                                            this.eventsdata.makeFileIntoBlob(fileentry, fileext, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").then((fileblob) => {
                                                console.log("blob", fileblob);
                                                let file: FileModel = new FileModel();
                                                file.data = fileblob;
                                                file.type = 'xls';
                                                file.mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                                                this.files.push(file);
                                            })
                                        }


                                        if (fileext == "mp4") {
                                            this.eventsdata.makeFileIntoBlob(fileentry, fileext, "video/mp4").then((fileblob) => {
                                                console.log("blob", fileblob);
                                                let file: FileModel = new FileModel();
                                                file.data = fileblob;
                                                file.type = 'video';
                                                file.mimeType = "video/mp4";
                                                this.files.push(file);
                                            })
                                        }

                                    })
                                })
                                .catch(e => console.log(e));
                        }


                    }
                }
            ]
        });

        actionSheet.present();
    }

    callFacebook() {
        this._fbService.facebookLogin();
    }

    openFileInBrowser(link) {
        this._fileUploadService.downloadDoc(link);
        // this.iab.create(link);
    }

    parseUrl(url): any {

        // var fbpattern = new RegExp("(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?");
        // var res = fbpattern.test(url);

        // if (res) {
        //     //alert('true');
        //     // return true;
        // } else {
        //     alert('false');
        //     return false;
        // }


        let postId;
        let postObject = { type: 'unknown', id: '', pageid: '', link: url };
        //var url = "https://www.facebook.com/trendinginsocial/photos/a.814206018637597.1073741828.812099768848222/1577022559022602/?type=3&theater"
        //var url = "https://www.facebook.com/skillorbit/videos/1963635497256522/"
        //var url = "https://www.facebook.com/photo.php?fbid=10155856306372868&set=pb.626502867.-2207520000.1508399801.&type=3&theater"
        //var url = "https://www.facebook.com/wasiq.mohammad/posts/10155859873117868"
        //var url = "https://www.facebook.com/photo.php?fbid=10155856306372868&set=pb.626502867.-2207520000.1508399801.&type=3&theater";
        //var url ="https://www.facebook.com/trendinginsocial/photos/a.814206018637597.1073741828.812099768848222/1577022559022602/?type=3&theater";
        //url = "https://www.facebook.com/SocialManiacOfficial/videos/1081034495366416/"
        let keywords = url.split('/');
        console.log('keyowrds', keywords);

        if (url.includes('story_fbid')) {
            let keys = url.split('=');
            let key2 = keys[1].split('&');
            postId = key2[0];
            postObject.type = 'post';
            postObject.id = postId;
        }
        else {
            keywords.forEach((element, i) => {

                //if its a page post image
                if (element.includes('?type') && !element.includes('?type=2')) {

                    //page id
                    let pageId;
                    let et = keywords[i - 2];
                    let pageArrayId = et.split(".")
                    pageId = pageArrayId[pageArrayId.length - 1];
                    postObject.pageid = pageId;

                    //postid
                    postId = keywords[i - 1];
                    postObject.type = 'post';
                    postObject.id = postId;

                    //if its a page video 
                } else if (element.includes('videos')) {
                    postId = keywords[i + 1];
                    postObject.type = 'videos';
                    postObject.id = postId;

                    //if its a individual post image
                } else if (element.includes('?fbid')) {
                    // postId = element.substring((element.indexOf('=')+1, element.indexOf('&')-1))
                    postId = element.substring(element.indexOf('?fbid=') + 6, element.indexOf('&'));
                    postObject.type = 'post';
                    postObject.id = postId;

                    //if its a individual post 
                } else if (element.includes('posts')) {
                    postId = keywords[i + 1];
                    postObject.type = 'post';
                    postObject.id = postId;
                }
                //if its a individual video
                else if (element.includes('?type=2')) {

                    //postid
                    postId = keywords[i - 1];
                    postObject.type = 'post';
                    postObject.id = postId;

                }

                else if (element.includes('?story_fbid')) {

                }
                // } else {
                //     console.log('yea nahe mila')
                //     postObject.type = "unknown";
                // }
            });
        }


        console.log('final keywords', postObject);
        return postObject;



    }

    addItem() {
        if (this.mediaLink && (this.mediaLink.toLocaleLowerCase().indexOf('http') >= 0 ||
            this.mediaLink.toLocaleLowerCase().indexOf('https') >= 0)) {
            this.mediaLink = this.mediaLink.toLowerCase();
            this.medialinksUrl.value.push(this.mediaLink);
            this.mediaLink = "";
            return;
        }
        else if (this.mediaLink) {
            this.mediaLink = this.mediaLink.toLowerCase();
            this.mediaLink = 'http://' + this.mediaLink;
            this.medialinksUrl.value.push(this.mediaLink);
            this.mediaLink = "";
        }

        console.log("final url", this.medialinksUrl);
    }

    onUrlFocusOut() {
        if (this.user.webUrl && (this.user.webUrl.toLocaleLowerCase().indexOf('http') >= 0 ||
            this.user.webUrl.toLocaleLowerCase().indexOf('https') >= 0)) {
            this.user.webUrl = this.user.webUrl.toLowerCase();
            return;
        }
        else if (this.user.webUrl) {
            this.user.webUrl = this.user.webUrl.toLowerCase();
            this.user.webUrl = 'http://' + this.user.webUrl;
        }

    }

    calculateEngRate() {
        let sum = 0, total = 0, rem = 0;
        if (this.model.socialMediaChannel.codeName === 'twitter') {
            this.model.attributes.forEach(element => {
                if (element.codeName === 'likes' || element.codeName === 'number_of_tweets' || element.codeName === 'number_of_retweets' || element.codeName == "link_clicks") {
                    sum += parseInt(element.value);
                }
            });
        }
        if (this.model.socialMediaChannel.codeName === 'facebook') {
            this.model.attributes.forEach(element => {
                if (element.codeName === 'reactions' || element.codeName === 'comments' || element.codeName === 'shares' || element.codeName === 'post_clicks' || element.codeName === 'video_views') {
                    sum += parseInt(element.value);
                }
            });
        }
        if (this.model.socialMediaChannel.codeName === 'youtube') {
            this.model.attributes.forEach(element => {
                if (element.codeName === 'likes' || element.codeName === 'comments' || element.codeName === 'views' || element.codeName === 'shares') {
                    sum += parseInt(element.value);
                }
            });
        }
        if (this.model.socialMediaChannel.codeName === 'instagram') {
            this.model.attributes.forEach(element => {
                if (element.codeName === 'likes' || element.codeName === 'comments' || element.codeName === 'saved' || element.codeName === 'video_views') {
                    sum += parseInt(element.value);
                }
            });
        }

        if (this.model.socialMediaChannel.codeName === 'linkedin') {
            this.model.attributes.forEach(element => {
                if (element.codeName === 'total_likes' || element.codeName === 'total_comments' || element.codeName === 'total_shares') {
                    sum += parseInt(element.value);
                }
            });
        }
        if (this.model.socialMediaChannel.codeName === 'pinterest') {
            this.model.attributes.forEach(element => {
                if (element.codeName === 'total_saves' || element.codeName === 'total_shares') {
                    sum += parseInt(element.value);
                }
            });
        }
        if (this.model.socialMediaChannel.codeName === 'tumblr') {
            this.model.attributes.forEach(element => {
                if (element.codeName === 'total_reblogs') {
                    sum += parseInt(element.value);
                }
            });
        }
        if (this.model.socialMediaChannel.codeName === 'snapchat') {
            this.model.attributes.forEach(element => {
                if (element.codeName === 'total_screenshots' || element.codeName === 'total_views') {
                    sum += parseInt(element.value);
                }
            });
        }
        console.log("sum", sum);
        let temp;
        let percentage;
        if (sum.toString() === "NaN" || sum == 0) {
            temp = 0;
            return;
        } else {
            temp = sum;
        }
        this.totalReachError = false;
        if (temp > this.model.totalReach) {
            this.totalReachError = true;
            console.log("temp", temp);
            return;
        } else {
            percentage = (temp / this.model.totalReach) * 100;
            this.model.totalEngagementRate = percentage.toFixed(2);
            this.model.totalEngagement = temp;
        }


        //this.model.totalEngagementRate = total.toFixed(0) + "%";
        console.log("total attributes:", this.model.totalEngagementRate);

    }

    onSubmit() {
        if (this.postLinks.length < 1) {
            this.postURLError = true;
            let msg = new Message();
            msg.msg = "Please enter your post URL";
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.presentToast(msg.msg);
            return;
        }

        this.postURLError = false;
        console.log('reach', this.model.reach);

        if (!this.model.totalReach || this.model.totalReach === '' || this.totalReachError) {
            console.log('reach', this.model.reach);
            let msg = new Message();
            msg.msg = "Total reach is invalid or empty";
            msg.msgType = MessageTypes.Error;
            msg.autoCloseAfter = 400;
            this._uiService.presentToast(msg.msg);
            return;
        }


        // let parent components to know that submit has been started
        // this.onSubmitStarted.emit();
        // this.isSubmitStarted = true;
        // console.log("Submit", this.medialink);
        // this.onSubmitFinished.emit();
        // this.isSubmitStarted = false;
        let post;
        let finalUrls = new Array<string>();
        this.postLinks.forEach(element => {
            finalUrls.push(element.urlLink);
        });

        // if (this.fileIds.length > 0) {
        //     this.fileIds.forEach(element => {
        //             this.fileIds.push(element);
        //     })
        // }

        console.log("console this fileids", this.fileIds);
        post = {
            campaignId: this.model.campaign.id,
            socialChannelId: this.model.socialMediaChannel.id,
            totalEngagement: this.model.totalEngagement,
            totalReach: this.model.totalReach,
            postUrls: finalUrls,
            totalEngagementRate: this.model.totalEngagementRate,
            attributes: this.model.attributes,
            attachmentIds: this.fileIds
        }


        console.log("Submit", this.postUrlLinks);
        this._loader.show("Please wait..")
        this._campaignService.postCampaignReport(post).subscribe(
            (res) => {
                this.onSubmitFinished.emit();
                this._loader.hide();
                this.isSubmitStarted = false;
                let msg = new Message();
                msg.msg = "Report has submitted successfully.";
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._navCtrl.pop();
                this._uiService.presentToast(msg.msg);
                this.ngOnInit();
                //window.location.reload();
            },
            (err) => {
                console.log("submit report error", err);
                this._loader.hide();
                this.isSubmitStarted = false;
                this.onSubmitFinished.emit(err);
                let msg = new Message();
                msg.msg = "Sorry, an error has occured";
                if (err.message) {
                    msg.msg = err.message;
                }
                msg.msgType = MessageTypes.Error;
                msg.autoCloseAfter = 400;
                this._uiService.presentToast(msg.msg);
            }
        );

    }
}