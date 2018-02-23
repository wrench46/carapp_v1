import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading  } from 'ionic-angular';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { DataServiceProvider } from '../../providers/data-service/data-service'

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the AddcarsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-addcars',
  templateUrl: 'addcars.html',
})
export class AddcarsPage {

  carFormGroup: FormGroup;

  lastImage: string = null;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController,private _formBuilder: FormBuilder, private dataservice: DataServiceProvider) {
    
    this.carFormGroup = this._formBuilder.group({
      car_model: [''],
      car_plate_number: [''],
      car_color: [''],
      car_year_model: [''],
      rent_price_per_day:[''],
      fuel_type:['']
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddcarsPage');
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
      quality: 45,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
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
   
  // Copy the image to a local folder
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
   
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {


    //alert(JSON.stringify(this.carFormGroup.value));

    
          // Destination URL
          var url = "http://sagla.tech/backend/apps/carapp/backend.php";
        
          // File for Upload
          var targetPath = this.pathForImage(this.lastImage);
          var formaction ={
            'action':'add-car',
            'status':'available'
          }
          var trythis = Object.assign(formaction, this.carFormGroup.value);
        
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
        
          this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
          });
          this.loading.present();
       
          
          // Use the FileTransfer to upload the image
          fileTransfer.upload(targetPath, url, options).then(data => {
           //alert(JSON.stringify(data));
            this.loading.dismissAll();
            this.loading = this.loadingCtrl.create({
              content: 'Saving data...',
            });
            this.loading.present();
            this.loading.dismissAll();
            this.presentToast('Car successfully added.');
        
          }, err => {
            this.loading.dismissAll()
            this.presentToast('Error while uploading file.');
          });
          

    
  }

  cancelCamerataken(){
    this.lastImage=null;
  }

}
