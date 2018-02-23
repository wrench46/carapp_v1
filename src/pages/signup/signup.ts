import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController } from 'ionic-angular';
import { User } from '../../models/users';

//import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../login/login';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseprovider:FirebaseServiceProvider,private firebaseauth:AngularFireAuth,private alertCtrl: AlertController,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  /*
  async signUpUser(){
   // this.firebaseprovider.addUserToFirebase(this.user);
   alert(JSON.stringify(this.user));
   /*
      try{
      const result = await this.firebaseauth.auth.createUserWithEmailAndPassword(this.user.email,this.user.password);
      // alert(JSON.stringify(this.user));
      console.log(result);
      
      }catch (e){
        console.error(e);
      }
      
  try{
    const result = await this.firebaseprovider.addUserUsingAuth(this.user);
    // alert(JSON.stringify(this.user));
    console.log(result);
    
    }catch (e){
      console.error(e);
    }
*/


  signUpUser(){
   // const signupresult= this.firebaseprovider.addUserUsingAuth(this.user);

    //console.log(signupresult);
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner:'dots'
      
    });

    loading.present();
    this.firebaseauth.auth.createUserWithEmailAndPassword(this.user.email,this.user.password)
    .then(data=> {
      this.alertMessage('Successfully Resigstered');
      loading.dismiss();
     this.navCtrl.setRoot(LoginPage);
    })
    .catch(error=>{
      console.log(error);
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
