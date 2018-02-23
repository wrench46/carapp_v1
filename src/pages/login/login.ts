
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, LoadingController } from 'ionic-angular';
import { User } from '../../models/users';
import { Storage } from '@ionic/storage';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataServiceProvider } from '../../providers/data-service/data-service';

import { HyperTrack } from '@ionic-native/hyper-track';

import {CreateprofilePage} from '../createprofile/createprofile';
import {UserpagePage} from '../userpage/userpage';
import {AdminPage} from '../admin/admin';
import {DriverPage} from '../driver/driver';



/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
 user = {} as User;
 driverdetails:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private firebaseauth:AngularFireAuth, private alertCtrl: AlertController,public loadingCtrl: LoadingController, private firebasedb:AngularFireDatabase,private dataservice: DataServiceProvider,private storage: Storage, private hyperTrack: HyperTrack) {
  
    this.hyperTrack.checkLocationPermission().then(response => {
      // response (String) can be "true" or "false"
      if (response != "true") {
        // Ask for permissions
        this.hyperTrack.requestPermissions().then(response => {
         
        }, error => {});
      }
    }, error => {});

    this.hyperTrack.checkLocationServices().then(response => {
      // response (String) can be "true" or "false"
      if (response != "true") {
        // Request services to be enabled
        this.hyperTrack.requestLocationServices().then(response => {
        }, error => {});
      }
    }, error => {});
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

logUser(){

  let loading= this.loadingCtrl.create({
    content: 'Please wait...',
    spinner:'dots'
    
  });
  loading.present();


  this.firebaseauth.auth.signInWithEmailAndPassword(this.user.email,this.user.password)
  .then(data=> {
    
    this.alertMessage('Successfully Logged in');
    loading.dismiss();

// this is to check if the user login exist in users database table

this.dataservice.checkUserExist(data.uid).subscribe(
  (response)=> {

  this.storage.ready();

  this.storage.set('datafromdb', response['data']);

  if(response['result'] < 1 ){
    this.navCtrl.setRoot(CreateprofilePage);
  }else{
   // alert(JSON.stringify(response['data']));
    //console.log(response['user_type']);
      if(response['data'][0]['user_type'] == 'admin'){
        
        this.navCtrl.setRoot(AdminPage,{
          userdetails: response['data']
        });
      }else if(response['data'][0]['user_type'] == 'driver'){
        
        this.navCtrl.setRoot(DriverPage, {
          userdetails: response['data']
        });
        

      }else{
      

        this.navCtrl.setRoot(UserpagePage,{
          userdetails: response['data']
        });
      }
      
  }



  },
  (error) => console.log(error)
);



/*
   this.firebasedb.object<any[]>('users/'+data.uid).valueChanges().subscribe(item =>{

       // console.log(item)
        if(item == null){
          this.navCtrl.setRoot(CreateprofilePage)
        }else{
          console.log(item['user_type']);
            if(item['user_type'] == 'admin'){
              
              this.navCtrl.setRoot(AdminPage);
            }else if(item['user_type'] == 'driver'){
              
              this.navCtrl.setRoot(DriverPage);

            }else{
              this.navCtrl.setRoot(UserpagePage);
            }
        }
   }  
    
    );
  */
   //this.navCtrl.setRoot(CreateprofilePage);

  })
  .catch(error=>{
    //console.log(error);
    loading.dismiss();
    this.alertMessage(error.message);
  });


  }


  alertMessage(message){
    this.alertCtrl.create({
      title: 'Info',
      subTitle: message,
      buttons: ['Ok']
    }).present();
  }


}
