import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Loading,AlertController } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service'

import {AddcarsPage} from '../addcars/addcars';

import {CardetailsPage} from '../cardetails/cardetails';

import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the CarsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cars',
  templateUrl: 'cars.html',
})
export class CarsPage {
  carlists:any;
  loading: Loading;
  carDetails: any;

  availableList:any;
  rentedList:any;
  carwaitingapprovals:any
  rentedcars:any;
  checkreplist:boolean;
  checkrentlist:boolean;
  checkavaillist:boolean;
  
  allcarlists: string = "available";

  myDate: String = new Date().toISOString();

  todayMonth=('0'+new Date().getMonth()+1).slice(-2);
  nowDate=('0'+new Date().getDate()).slice(-2);
  
  todayDate: String = new Date().getFullYear().toString()+"-"+this.todayMonth.toString()+"-"+this.nowDate.toString();
  todaysDate: String = new Date().getFullYear().toString()+"-"+this.todayMonth.toString()+"-"+this.nowDate.toString();

  todaysEndDate:String = this.todayDate;

  availablecarunits:any;
  numofavailablecars:number;


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataservice: DataServiceProvider,public loadingCtrl: LoadingController,private firebasechatdb:AngularFireDatabase,private alertCtrl: AlertController) {

  this.carDetails = CardetailsPage;
  this.getAllCarList();

  
   // this.getAvailableCars(this.todayDate,this.todaysEndDate);
  }

  getAllCarList(){
    
    this.loading= this.loadingCtrl.create({
      content: 'Please wait...',
      spinner:'dots'
      
    });
    this.loading.present();

    this.dataservice.getLists('v_allcars').subscribe(
      (response)=> {
      this.carlists= response['retrievedata'];
      this.loading.dismissAll();
      },
      (error) => console.log(error)
    );

  }
  changeDateStart(){
    this.todaysEndDate=this.todayDate;
   this.getAvailableCars(this.todayDate,this.todaysEndDate);
   }
   changeDateEnd(){
   this.getAvailableCars(this.todayDate,this.todaysEndDate);
  }

  getAvailableCars(dateFrom,dateTo){
    //alert(dateFrom +" -- " +dateTo);
    this.loading= this.loadingCtrl.create({
      content: 'Please wait...',
      spinner:'dots'
      
    });
   //alert(dateFrom);
   this.loading.present().then(()=>{

    var datatosend={
      action:'get-available-cars',
      datefrom:dateFrom,
      dateto:dateTo
  }
    this.dataservice.getAvailbleCars(datatosend).subscribe((response)=>{

      console.log(response);
      this.availablecarunits = response['available_cars'];
      this.numofavailablecars= response['available_cars'].length;
     
      this.loading.dismissAll();
     // if(this.loading){ this.loading.dismiss(); this.loading = null; }
      });
    
   });
   

   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarsPage');
  }
  
  gotToAddCar(){
    this.navCtrl.setRoot(AddcarsPage);
  }
  naviTo(cardetails){
    this.navCtrl.push(CardetailsPage, {
      cardetail: cardetails
    })
  }

  declineRent(rentaldetails){
    var rental={
      action:'rental-approval',
      app_type: 'available-declined',
      details: rentaldetails
     }

     this.dataservice.processRentalApprovals(rental).subscribe((response)=>{
      //alert(JSON.stringify(response));

      this.navCtrl.setRoot(this.navCtrl.getActive().component);

     });
  }

  approveRent(rentaldetails){

    var rental={
      action:'rental-approval',
      app_type: 'on-hold-approved',
      details: rentaldetails
     }

    //alert(JSON.stringify(rentaldetails));
    //console.log(rental);

     this.dataservice.processRentalApprovals(rental).subscribe((response)=>{
     // console.log(response);
      if(response['messaging'] == '0'){
        var chattable= '/'+rentaldetails['assigned_driver']+'-'+rentaldetails['rented_by'];

        var newobj ={
          specialMessage:true,
          message:"Chat room created"
        }

        this.firebasechatdb.list(chattable).push(newobj);
      }
   
      /*
      this.firebasechatdb.object(`chats/${"9-8-3"}`).set(newobj)
      .then(()=>{
        alert('sent');
      })
      */
   

      //alert(JSON.stringify(response));
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
      


     });

  }

  ongoingRent(){
    this.loading= this.loadingCtrl.create({
      content: 'Please wait...',
      spinner:'dots'
      
    });
    this.loading.present();

    var onrent={
      action:'rental-car-status',
      statlog:'on-rent'
     }

    this.dataservice.getWaitingforApprovals(onrent).subscribe((response)=>{
     
      this.rentedcars=response['rental-status'];
      this.loading.dismissAll();

      });
    
  }

  waitingApprovals(){

    this.loading= this.loadingCtrl.create({
      content: 'Please wait...',
      spinner:'dots'
      
    });
    this.loading.present();
    var waitingapprovals={
      action:'rental-car-status',
      statlog:'waiting-approval'
     }

    this.dataservice.getWaitingforApprovals(waitingapprovals).subscribe((response)=>{
     
      this.carwaitingapprovals=response['rental-status'];
      this.loading.dismissAll();

      //alert(JSON.stringify(this.carwaitingapprovals));
    });
  }

  availableCars(){
  
    this.getAvailableCars(this.todayDate,this.todaysEndDate);
   
  }
  removeCar($cardetails){

    var datatosend={
      action:'check-onrent-car',
      carid:$cardetails['car_unit_id']
    }
    
    this.dataservice.checkBeforeRemoveCar(datatosend).subscribe((response)=>{

      if(response['status']== '0'){

        let alerts = this.alertCtrl.create({
          title: 'Cannot delete!',
          message: 'Cannot remove '+ $cardetails.car_model+',  because it is still rented.',
          buttons: [
            {
              text: 'OK',
              role: 'cancel'
            }
             
          ]
        });
        alerts.present();

      }else{

        let alerts = this.alertCtrl.create({
          title: 'Confirm delete',
          message: 'Deleting will remove all associated transactions for '+ $cardetails.car_model+ '. <br /> <br /> Do you want to delete this car?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Delete',
              handler: () => {
              //  console.log('Buy clicked');
                this.confirmedDelete($cardetails)
              }
            }
          ]
        });
        alerts.present();



      }



     });


  }

  confirmedDelete($cartodelete){

    var datatosend={
      action:'check-delete-car',
      carid:$cartodelete['car_unit_id']
    }
    this.dataservice.processRemoveCar(datatosend).subscribe((response)=>{
      if(response['status']=='1'){
        this.getAllCarList();
      }
     // alert(JSON.stringify(response));
     });
  }
 
}
