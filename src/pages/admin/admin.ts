import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CarsPage } from '../cars/cars';
import { ViewerPage } from '../viewer/viewer';
import { DriverListPage } from '../driver-list/driver-list';
import { MessengerAdminPage } from '../messenger-admin/messenger-admin';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
    viewpage=ViewerPage;
    carpage = CarsPage;
    driverslist= DriverListPage;
    messengers = MessengerAdminPage;
    userdetailsstorage:any;
    allparams:any;
    

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage ) {
    this.allparams = this.navParams.get('userdetails');
   //alert(JSON.stringify(this.allparams));

    this.storage.get('datafromdb').then((response)=>{
      // console.log(response);
       this.userdetailsstorage= response[0];
     });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }


}
