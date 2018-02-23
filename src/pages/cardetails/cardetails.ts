import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ToastController, Platform, LoadingController, Loading  } from 'ionic-angular';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { DataServiceProvider } from '../../providers/data-service/data-service'
import { Storage } from '@ionic/storage';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the CardetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-cardetails',
  templateUrl: 'cardetails.html',
})
export class CardetailsPage {

  carFormGroup: FormGroup;

  lastImage: string = null;
  loading: Loading;
  
  carsdetail :any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController,private _formBuilder: FormBuilder, private dataservice: DataServiceProvider,private storage: Storage,private alertCtrl: AlertController) {
   //alert(JSON.stringify(this.navParams.get('cardetail')));
    this.carsdetail =this.navParams.get('cardetail');

    this.carFormGroup = this._formBuilder.group({
      car_model: [this.carsdetail.car_model],
      car_plate_number: [this.carsdetail.car_plate_number],
      car_color: [this.carsdetail.car_color],
      car_year_model: [this.carsdetail.car_model_year],
      rent_price_per_day:[this.carsdetail.rent_price_per_day],
      fuel_type:[this.carsdetail.fuel_type]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardetailsPage');
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
      quality: 25,
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
    //alert(JSON.stringify(this.carFormGroup.value));

    
    // Destination URL
    var url = "http://sagla.tech/backend/apps/carapp/backend.php";
      
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);    

    if(this.lastImage !== null){
            
            this.loading.present();

            var userfirebaseid= {
              carid: this.carsdetail.car_unit_id,
              imgupload:'true',
              action:'update-car'
            }

                        
            var trythis = Object.assign(userfirebaseid, this.carFormGroup.value);

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
              carid: this.carsdetail.car_unit_id,
              imgupload:'false',
              action:'update-car'
            }

                        
            var trythis = Object.assign(sendto, this.carFormGroup.value);

           // alert(JSON.stringify(trythis));

            this.dataservice.updateProfiles(trythis).subscribe((response)=>{


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
          

    
  }

  cancelCamerataken(){
    this.lastImage=null;
  }


}
