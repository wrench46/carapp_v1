import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController,ActionSheetController, ToastController, Platform,Loading  } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Userprofile } from '../../models/userprofile'
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { FCM } from '@ionic-native/fcm';

import { UserpagePage } from '../userpage/userpage';
import {AdminPage} from '../admin/admin';
import {DriverPage} from '../driver/driver';
import { HomePage } from '../home/home';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { HyperTrack } from '@ionic-native/hyper-track';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CreateprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-createprofile',
  templateUrl: 'createprofile.html',
})
export class CreateprofilePage {

  userprofile = {} as Userprofile;
  checkme:boolean;

  deviceToken:string;

  profileFormGroup: FormGroup;
  profileFormGroupDC : FormGroup;
  
  driverlSelected: string = null;
  lastImage: string = null;
  loading: Loading;
  newprofileFormGroup:any;
  userres:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private firebaseauth:AngularFireAuth, private firebasedb:AngularFireDatabase, public loadingCtrl: LoadingController,private alertCtrl: AlertController, private dataservice: DataServiceProvider, private fcm:FCM,private _formBuilder: FormBuilder,private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform,private hyperTrack: HyperTrack,private storage: Storage) {
   // private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform


    this.driverlSelected=null;

    this.profileFormGroup = this._formBuilder.group({
      username: ['',Validators.required],
      firstname:['',Validators.required],
      lastname: ['',Validators.required],
      mobilephone:['',[Validators.required,Validators.maxLength(11)]],
      gender:['',Validators.required]
      
    });

    this.profileFormGroupDC = this._formBuilder.group({
      username: ['',Validators.required],
      firstname:['',Validators.required],
      lastname: ['',Validators.required],
      mobilephone:['',[Validators.required,Validators.maxLength(11)]],
      gender:['',Validators.required],
      user_type:['',Validators.required]
      
    });
   

  this.dataservice.checkIfUserDb('users').subscribe(
    (response)=>{
   
      if(response['status']== '1'){
        this.checkme= false;



      }else{
        this.checkme= true;


      }
    }

  );

  this.fcm.getToken().then(token=>{
    this.deviceToken=token;
   });

  /*
      this.firebasedb.database.ref().on('value', 
      snapshot => {
                if(snapshot.val() == null){
              
                    this.checkme= false;
                }else{
                  this.checkme= true;
                }         
            }     
      );
      */

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateprofilePage');
    
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

      if(this.checkme== false){
        
                var user_type = {
                  "user_type" : 'admin'
                  };
                  
                  var newobj = Object.assign(user_type, this.profileFormGroup.value);
        
        
              } else {

                newobj =this.profileFormGroup.value;

              }
            //  alert(JSON.stringify(this.checkme));      
  //alert(JSON.stringify(newobj));
      this.firebaseauth.authState.take(1).subscribe(auth =>{
       
      
          if(this.checkme== false){      
                          
           // this.profileFormGroup.patchValue({user_type:'admin'});

            var user_type = {
              "user_type" : 'admin'
              };
              
              this.newprofileFormGroup = Object.assign(user_type, this.profileFormGroup.value);

          }else{

            this.newprofileFormGroup = this.profileFormGroupDC.value;
          }
        //  alert(JSON.stringify(this.checkme));
        
          
                // Destination URL
                var url = "http://sagla.tech/backend/apps/carapp/backend.php";
              
                // File for Upload
                var targetPath = this.pathForImage(this.lastImage);

                var userfirebaseid= {
                  firebase_id:auth.uid,
                  firebase_email: auth.email,
                  action:'register-profile',
                 devicetoken: this.deviceToken
                }

                            
                var trythis = Object.assign(userfirebaseid, this.newprofileFormGroup);

             
              
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
                  spinner:'dots'
                });
                this.loading.present();
             
                
                // Use the FileTransfer to upload the image
                fileTransfer.upload(targetPath, url, options).then(data => {

                 this.loading.dismissAll();
                  this.loading = this.loadingCtrl.create({
                    content: 'Saving data...',
                    spinner:'dots'
                  });
                  this.loading.present();
           
                this.userres = JSON.parse(data.response);

                 
                 this.storage.ready();

                 this.storage.set('datafromdb', this.userres.userdatadetail);

                  this.loading.dismissAll();
                  this.presentToast('Profile successfully created.');

                  if(this.newprofileFormGroup['user_type'] === 'admin'){

                        this.alertCtrl.create({
                          title: 'Info',
                          subTitle: 'Admin successfully added',
                          buttons: [  {
                            text: 'OK',
                            role: 'ok',
                            handler: data => {

                              this.navCtrl.setRoot(AdminPage,{
                                userdetails: this.userres.userdatadetail
                              });
                             
                            }
                          }]
                      
                        }).present();

                  }else if(this.newprofileFormGroup['user_type'] === 'driver'){

                    this.alertCtrl.create({
                      title: 'Info',
                      message: '<p>Driver successfully added.</p><p> Status: Pending for Admin\'s approval.</p>',
                      buttons: [  {
                        text: 'OK',
                        role: 'ok',
                        handler: data => {
                          
                         this.navCtrl.setRoot(DriverPage,{
                          userdetails: this.userres.userdatadetail
                        });
                         
                        }
                      }]
                   
                     }).present();

                  }else{
                    

                    var chattable= '/1-'+this.userres.userdatadetail[0]['id'];
       
                    var newobj ={
                      specialMessage:true,
                      message:"Chat room created"
                    }
            
                    this.firebasedb.list(chattable).push(newobj);

                    this.alertCtrl.create({
                      title: 'Info',
                      subTitle: 'Successfully added.',
                      buttons: [  {
                        text: 'OK',
                        role: 'ok',
                        handler: data => {
                          
                          this.navCtrl.setRoot(UserpagePage,{
                            userdetails: this.userres.userdatadetail
                          });
                         
                        }
                      }]
                   
                     }).present();

                  }
              
                }, err => {
                  this.loading.dismissAll()
                  this.presentToast('Error while uploading file.');
                });
                
              
                  
                            
      });
          
  }

  cancelCamerataken(){
    this.lastImage=null;
  }



///////////////////////////////////////////////////////////////////


  createProfile(){
   /*
 
    let loading= this.loadingCtrl.create({
      content: 'Please wait...',
      spinner:'dots'
      
    });
    loading.present();
   
      if(this.checkme== false){

        var user_type = {
          "user_type" : 'admin'
          };
          
          this.profileFormGroup.patchValue({user_type: 'Mahesh'})

      }else{
      }

     this.profileFormGroup.patchValue({user_type: 'Mahesh'})
      alert(JSON.stringify(this.profileFormGroup.value));
      
     
       this.firebaseauth.authState.take(1).subscribe(auth =>{

        
        var userfirebaseid= {
          firebase_id:auth.uid,
          firebase_email: auth.email,
          action:'register-profile',
         devicetoken: this.deviceToken
        }
        var finalobj = Object.assign(newobj, userfirebaseid);

        
        this.dataservice.addUserProfileToDb(finalobj).subscribe(
          (response)=>{

            if(newobj.user_type=='admin'){

              this.alertCtrl.create({
                title: 'Info',
                subTitle: 'Admin successfully added',
                buttons: ['Ok']
             
               }).present();
              
               loading.dismiss();

              this.navCtrl.setRoot(AdminPage);

            }else if(newobj.user_type=='driver'){
              this.alertCtrl.create({
                title: 'Info',
                message: '<p>Driver successfully added.</p><p> Status: Pending for Admin\'s approval.</p>',
                buttons: [  {
                  text: 'OK',
                  role: 'ok',
                  handler: data => {
                    
                   this.navCtrl.setRoot(DriverPage);
                   loading.dismiss();
                  }
                }]
             
               }).present();
           
             
            }else{

              this.alertCtrl.create({
                title: 'Info',
                subTitle: 'Successfully added.',
                buttons: [  {
                  text: 'OK',
                  role: 'ok',
                  handler: data => {
                    
                    this.navCtrl.setRoot(UserpagePage);
                   loading.dismiss();
                  }
                }]
             
               }).present();
            
            }
          
          }
        ) // end dataservice

        });*/ // end firebaseauth

    

      /*
        this.firebaseauth.authState.take(1).subscribe(auth =>{
          this.firebasedb.object(`users/${auth.uid}`).set(newobj)
          .then(()=>{
            
            if(newobj.user_type=='admin'){

              this.alertCtrl.create({
                title: 'Info',
                subTitle: 'Admin successfully added',
                buttons: ['Ok']
             
               }).present();
              
               loading.dismiss();

              this.navCtrl.setRoot(AdminPage);

            }else if(newobj.user_type=='driver'){
              this.alertCtrl.create({
                title: 'Info',
                message: '<p>Driver successfully added.</p><p> Status: Pending for Admin\'s approval.</p>',
                buttons: [  {
                  text: 'OK',
                  role: 'ok',
                  handler: data => {
                    
                   this.navCtrl.setRoot(DriverPage);
                   loading.dismiss();
                  }
                }]
             
               }).present();
           
             
            }else{
              this.navCtrl.setRoot(UserpagePage);
            }
           

          }
          
        
        )
        })
        */

   
  }

  logOutApp(){
    this.firebaseauth.auth.signOut();
    this.navCtrl.setRoot(HomePage);
  }
  onSelectChange(event){
    //alert(JSON.stringify(event));
   
    if(event=== 'driver'){
      this.driverlSelected=event;
    }else{
      this.driverlSelected=null;
    }
  }

}
