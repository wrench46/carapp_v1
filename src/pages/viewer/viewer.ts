import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HyperTrack } from '@ionic-native/hyper-track';

/**
 * Generated class for the ViewerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewer',
  templateUrl: 'viewer.html',
})
export class ViewerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private hyperTrack: HyperTrack) {

    //https://www.hypertrack.com/blog/2016/09/11/our-framework-for-real-time-filtering-of-location-streams/

    //alert('test');
    /*
    this.hyperTrack.getCurrentLocation().then(location => {
      // Handle location. It's a String representation of a Location's JSON.For example:
      // '{"mAccuracy":22.601,,"mLatitude":23.123456, "mLongitude":-100.1234567, ...}'
      alert(JSON.stringify(location));
    }, error => {
      alert(JSON.stringify(error));
    });
    */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewerPage');
  }

  testcreatehypertrackuser(){
    

    this.hyperTrack.getOrCreateUser('Edwardo1','123456','http://sagla.tech/backend/apps/carapp/uploads/profile/25/1514262407921.jpg','01A450BCDE').then(user=>{
  
    this.hyperTrack.startTracking().then(userId => {}, trackingError => {

    });
    },(e)=>{

      alert(e);
    });

    
  }

  refreshHypertrack(){
 document.getElementById('hyperframe').setAttribute('src','https://dashboard.hypertrack.com/widget/map/users?key=sk_ef6aabfb1d12c4c4d10f4e8fc3692c856e4da3dd&show_all=true&ordering=-last_heartbeat_at');
   // f.src = f.src;
  }

}
