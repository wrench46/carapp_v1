import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController,ActionSheetController, ToastController, Platform,Loading  } from 'ionic-angular';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { FCM } from '@ionic-native/fcm';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { HyperTrack } from '@ionic-native/hyper-track';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SettingsUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-settings-user',
  templateUrl: 'settings-user.html',
})
export class SettingsUserPage {

  userdetails:any;
  userdetailsstorage:any;

  profileFormGroupDC : FormGroup;
  lastImage: string = null;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,private dataservice: DataServiceProvider, private fcm:FCM,private _formBuilder: FormBuilder,private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform,private hyperTrack: HyperTrack,private storage: Storage, public loadingCtrl: LoadingController,private alertCtrl: AlertController) {

    this.storage.get('datafromdb').then((response)=>{
      this.userdetailsstorage= response[0];
    });
    
    if(this.navParams.data[0] == undefined){

      this.userdetails = this.userdetailsstorage;
      
    }else{
      //alert(this.navParams.data[0]['id'] +' -- '+this.userdetailsstorage['id']);
      this.userdetails= this.navParams.data[0];
    }

    this.profileFormGroupDC = this._formBuilder.group({
      username: [this.userdetails.username,Validators.required],
      firstname:[this.userdetails.first_name,Validators.required],
      lastname: [this.userdetails.last_name,Validators.required],
      mobilephone:[this.userdetails.phone_number,[Validators.required,Validators.maxLength(11)]],
      gender:[this.userdetails.gender,Validators.required]
      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsUserPage');
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 75,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: false
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {

    this.loading = this.loadingCtrl.create({
      content: 'Updating...',
      spinner:'dots'
    });
        
              // Destination URL
              var url = "http://sagla.tech/backend/apps/carapp/backend.php";
            
              // File for Upload
              var targetPath = this.pathForImage(this.lastImage);    

              if(this.lastImage !== null){
                
                this.loading.present();

                var userfirebaseid= {
                  userid:this.userdetails.id,
                  imgupload:'true',
                  action:'update-profile'
                }
  
                            
                var trythis = Object.assign(userfirebaseid, this.profileFormGroupDC.value);

                var filename = this.lastImage;
            
                var options = {
                  fileKey: "file",
                  fileName: filename,
                  chunkedMode: false,
                  mimeType: "multipart/form-data",
                  params : trythis
                };
              
                const fileTransfer: TransferObject = this.transfer.create();
                
                fileTransfer.upload(targetPath, url, options).then(data => {
  
                  this.alertCtrl.create({
                    title: 'Info',
                    subTitle: 'Successfully updated.',
                    buttons: [  {
                      text: 'OK',
                      role: 'ok'
                    }]
                 
                   }).present();

                  this.loading.dismissAll();
              
                }, err => {
                  this.loading.dismissAll()
                  this.presentToast('Error while uploading file.');
                });

              } else {

                var sendto= {
                  userid:this.userdetails.id,
                  imgupload:'false',
                  action:'update-profile'
                }
  
                            
                var trythis = Object.assign(sendto, this.profileFormGroupDC.value);


                //alert(JSON.stringify(trythis));

                this.dataservice.updateProfiles(trythis).subscribe((response)=>{

                 // alert(JSON.stringify(response));

                 this.alertCtrl.create({
                  title: 'Info',
                  subTitle: 'Successfully updated.',
                  buttons: [  {
                    text: 'OK',
                    role: 'ok'
                  }]
               
                 }).present();

                  this.loading.dismissAll();

                });

              }

           /*
            
              // File name only
              var filename = this.lastImage;
            
              var options = {
                fileKey: "file",
                fileName: filename,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params : trythis
              };
            
              const fileTransfer: TransferObject = this.transfer.create();
              
              fileTransfer.upload(targetPath, url, options).then(data => {

              
            
              }, err => {
                this.loading.dismissAll()
                this.presentToast('Error while uploading file.');
              });
          */    
   
        
}

cancelCamerataken(){
  this.lastImage=null;
}

}
