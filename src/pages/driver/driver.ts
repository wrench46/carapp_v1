import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import {DataServiceProvider} from '../../providers/data-service/data-service'

import { SchedDriverPage } from '../../pages/sched-driver/sched-driver';
import { MessengerDriverPage } from '../../pages/messenger-driver/messenger-driver';
import { AccountDriverPage } from '../../pages/account-driver/account-driver';
//import { Storage } from '@ionic/storage';

/**
 * Generated class for the DriverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driver',
  templateUrl: 'driver.html',
})
export class DriverPage {

  sched=SchedDriverPage;
  messenger=MessengerDriverPage;
  accountdriver= AccountDriverPage;
  allparams:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private firebaseauth:AngularFireAuth,private dataservice:DataServiceProvider) {

    this.allparams = this.navParams.get('userdetails');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriverPage');
  }




}
