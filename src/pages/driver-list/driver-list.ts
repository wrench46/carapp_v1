import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Loading } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { ApprovalPage} from '../approval/approval';

/**
 * Generated class for the DriverListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driver-list',
  templateUrl: 'driver-list.html',
})
export class DriverListPage {
  loading: Loading;

  driversList:any;
  pendingList:any;
  approvedList:any;
  declinedList:any;
  alldrivers: string = "driverslists";

  constructor(public navCtrl: NavController, public navParams: NavParams,private dataservice: DataServiceProvider,public loadingCtrl: LoadingController) {

    this.loading= this.loadingCtrl.create({
      content: 'Please wait...',
      spinner:'dots'
      
    });
    this.loading.present();
    
    this.dataservice.getAllDrivers().subscribe((response)=>{
      console.log(response);
 
     this.driversList = response['all-drivers'];
     this.loading.dismissAll();

     this.pendingList  = this.driversList.filter(function (el) {
      return (el.status === "pending");
      });

      this.approvedList  = this.driversList.filter(function (el) {
        return (el.status === "approved");
        });
      this.declinedList  = this.driversList.filter(function (el) {
        return (el.status === "declined");
        });

      console.log(this.pendingList);


    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriverListPage');
  }
  
  goToDetails(driverdetail){
    this.navCtrl.push(ApprovalPage, {
      driverdetails: driverdetail
    })
  }

}
