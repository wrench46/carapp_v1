import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Loading } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { ApprovalPage} from '../approval/approval';
/**
 * Generated class for the ApplicantsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-applicants',
  templateUrl: 'applicants.html',
})
export class ApplicantsPage {
  driversList:Object;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,private dataservice: DataServiceProvider,public loadingCtrl: LoadingController) {
    
    this.loading= this.loadingCtrl.create({
      content: 'Please wait...',
      spinner:'dots'
      
    });
    this.loading.present();
    
    this.dataservice.getPendingDrivers().subscribe((response)=>{
 
     this.driversList = response['pending'];
     this.loading.dismissAll();
    });

  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad ApplicantsPage');
  }
  
  goToDetails(driverdetail){
    this.navCtrl.push(ApprovalPage, {
      driverdetails: driverdetail
    })
  }

}
