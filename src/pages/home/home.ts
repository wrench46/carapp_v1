import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import {LoginPage} from '../login/login';
import {SignupPage} from '../signup/signup';

import { AngularFireAuth } from 'angularfire2/auth';
//import { User } from '../../models/users';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,private alertCtrl: AlertController,private firebaseauth:AngularFireAuth) {

  }

  signUp(){

    this.navCtrl.push(SignupPage);
  }

  logIn(){
    //calling page for ionic : push or setRoot
    this.navCtrl.push(LoginPage);
  

  }



}
