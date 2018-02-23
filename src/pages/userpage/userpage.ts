import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessengerUserPage } from '../messenger-user/messenger-user';
import { ProcessRentPage } from '../process-rent/process-rent';
import { SettingsUserPage } from '../settings-user/settings-user';
//import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFireDatabase } from 'angularfire2/database';
//import { Userprofile } from '../../models/userprofile';
/**
 * Generated class for the UserpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-userpage',
  templateUrl: 'userpage.html',
})
export class UserpagePage {
  //clientdata:any;

  settingsuser=SettingsUserPage;
  messengeruser = MessengerUserPage;
  processrent = ProcessRentPage;

  userdetails:any;
  //applicantpage=ApplicantsPage;
  //driverslist= DriverListPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    this.userdetails =  this.navParams.get('userdetails');

  }
  
  ionViewDidLoad() {
   // this.firebaseauth.authState.take(1).subscribe(auth=>{
    //  this.usersdata = this.firebasedb.object(`users/${auth.uid}`);
   // })
  }

}
