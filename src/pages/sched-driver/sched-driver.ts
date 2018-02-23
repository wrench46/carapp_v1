import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataServiceProvider } from '../../providers/data-service/data-service';
import { HyperTrack } from '@ionic-native/hyper-track';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SchedDriverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sched-driver',
  templateUrl: 'sched-driver.html',
})
export class SchedDriverPage {
  userid:any;
  driverscheduletoday:any;
  driverscheduleafterrent:any;
  first_name:String;
  last_name:String;
  car_model:String;
  car_plate:String;
  rentdatefrom:String;
  rentdateto:String;
  schedtoday:Boolean= false;
  onRent = false;
  todaySchedOnly:any;
  schedEnd=false; 
  futureScheds:any;
  driverhtid:any;
  userdetailsstorage:any;
  hypertrackid:any;
  hidehtpreocessor:boolean;
  pendingstat:any;

  //todayMonth=('0'+new Date().getMonth()+1).slice(-2);
  //nowDate=('0'+new Date().getDate()).slice(-2);

  //todaysDate: String;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,private dataservice:DataServiceProvider,private hyperTrack: HyperTrack,private storage: Storage ) {
 
    this.hidehtpreocessor= true;
    
    this.storage.get('datafromdb').then((response)=>{
     // console.log(response);
      this.userdetailsstorage= response[0];
    });

    if(this.navParams.data[0] == undefined){

      this.userid = this.userdetailsstorage['id'];
      this.hypertrackid = this.userdetailsstorage['hypertrackid'];

    } else {

      this.userid= this.navParams.data[0].id;
      this.hypertrackid = this.navParams.data[0]['hypertrackid'];
    }

    this.driverhtid= this.hypertrackid;

    if(this.hypertrackid== ''){

      if(this.navParams.data[0]['status']==='approved' ){

      this.hyperTrack.getOrCreateUser(this.navParams.data[0]['username'],this.navParams.data[0]['phone_number'],'http://sagla.tech/backend/apps/carapp/uploads/profile/'+this.navParams.data[0]['id']+'/'+this.navParams.data[0]['profile_pic'],'SAGLA'+this.navParams.data[0]['id']).then(user=>{

       var hyperuser=JSON.parse(user);

            var datatosend ={
              action: 'update-hypertrack',
              id:this.userid,
              hypertrackid: hyperuser['id']
            }

            this.dataservice.processhypertrackupdate(datatosend).subscribe(response=>{
             // alert(JSON.stringify(response));
            });

               // this.hyperTrack.startTracking().then(userId => {}, trackingError => {
            
               // });

          },(e)=>{
      
            alert(e);
        });
      }
    }

    
      this.pendingstat = (this.navParams.data[0]['status']==='pending')? true : false;
   

    this.getSchedules();

 
  }

  ionViewWillEnter(){
   
  }

showPendingPage(){
  
}
  
getSchedules(){

  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  
  var driverSched = {
    action: 'get-driver-schedule',
    userid:this.userid
  }

  this.dataservice.getDriverSchedule(driverSched).subscribe((response)=>{
      
       // console.log(response);
  
  var todayNow = new Date();

  this.todaySchedOnly  = response['driverschedules'].filter(function (el) {

    var todayMonth=('0'+new Date().getMonth()+1).slice(-2);
    var nowDate=('0'+new Date().getDate()).slice(-2);
  
    var todaysDate = new Date().getFullYear().toString()+"-"+todayMonth.toString()+"-"+nowDate.toString() + " 00:00:00";

    return (el.date_rented === todaysDate);
    
  });

   this.futureScheds = response['driverschedules'].filter(function (el) {

    var todayMonth=('0'+new Date().getMonth()+1).slice(-2);
    var nowDate=('0'+new Date().getDate()).slice(-2);
  
    var todaysDate = new Date().getFullYear().toString()+"-"+todayMonth.toString()+"-"+nowDate.toString() + " 00:00:00";

    return (el.date_rented != todaysDate);
    
  });

  this.driverscheduletoday=this.todaySchedOnly[0];
  //console.log(response['driverschedules']);
  //console.log(this.futureScheds);

  if(response['driverschedules'].length <= 0){
    this.hidehtpreocessor= true;
  }else{
    
    if(this.driverscheduletoday){
        if(this.driverscheduletoday['rental_status']== 'rental-complete'){
          this.schedEnd= true;
        
          this.hidehtpreocessor= true;
        }
    }

  }

//alert(this.schedEnd);

 

  var countarr = response['driverschedules'];

  if(this.driverscheduletoday){
    this.hidehtpreocessor= false;
    if(this.todaySchedOnly[0]['car_log_status']== 'on-rent'){
      this.onRent = true;
    }

    this.schedtoday = true;

    this.first_name=this.driverscheduletoday['first_name'];
    this.last_name=this.driverscheduletoday['last_name'];
    this.car_model=this.driverscheduletoday['car_model'];
    this.car_plate=this.driverscheduletoday['car_plate_number'];
  
    var daterentfrom = new Date(this.driverscheduletoday['date_rented']);
    var daterentto = new Date(response['driverschedules'][countarr.length-1]['date_rented']);
  
    //alert(daterentfrom +" -- "+ daterentto);
    var day = daterentfrom.getDate();
    var monthIndex = daterentfrom.getMonth();
    var year = daterentfrom.getFullYear();
  
    var dayto = daterentto.getDate();
    var monthIndexto = daterentto.getMonth();
    var yearto = daterentto.getFullYear();
  
    this.rentdatefrom = monthNames[monthIndex] + ' ' + day + ',  ' + year;
    this.rentdateto = monthNames[monthIndexto] + ' ' + dayto + ',  ' + yearto;
   /* */
  }
  

  });
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedDriverPage');
   
   //alert(JSON.stringify(this.driverschedule.first_name));
  }

  processDriverScheduleHT(){

  //alert(this.onRent);
    
    if(this.onRent== false){

   //alert(this.driverhtid);
      var data={
        action:'process-driver-schedule',
        details: this.driverscheduletoday
      }
      //console.log(this.driverscheduletoday);

      this.dataservice.processDriverSchedule(data).subscribe((response)=>{
        //console.log(response);
        if(response['status']=='1'){

          this.onRent = true;
        }

      });

     // alert(JSON.stringify(this.driverhtid));

      this.hyperTrack.setUserId(this.driverhtid).then(user => {

        this.hyperTrack.startTracking().then(userId => {}, trackingError => {});

      }, error => {});
      /*
         this.hyperTrack.startTracking().then(userId => {
          alert('start');

         }, trackingError => {
            
               });
               */

    } else {

        this.hyperTrack.setUserId(this.driverhtid).then(user => {

          this.hyperTrack.stopTracking().then(success => {
            // Handle success (String). Should be "OK".
          }, error => {});
        
      }, error => {});

      var driverSched = {
        action: 'get-driver-schedule',
        userid:this.userid
      }
      
    

      this.dataservice.getDriverSchedule(driverSched).subscribe((response)=>{


        this.todaySchedOnly  = response['driverschedules'].filter(function (el) {

          var todayMonth=('0'+new Date().getMonth()+1).slice(-2);
          var nowDate=('0'+new Date().getDate()).slice(-2);
        
          var todaysDate = new Date().getFullYear().toString()+"-"+todayMonth.toString()+"-"+nowDate.toString() + " 00:00:00";
      
          return (el.date_rented === todaysDate);
          
        });
  
        this.driverscheduletoday=this.todaySchedOnly[0];
            var data={
              action:'process-driver-schedule',
              details: this.driverscheduletoday
            }

           // alert(JSON.stringify(response));
          // console.log(response);
           // console.log(this.driverscheduletoday);
          
            this.dataservice.processDriverSchedule(data).subscribe((response)=>{

             // console.log(response);
              if(response['status']=='1'){
                this.schedEnd= true;
                this.onRent = false;

              }

            });
           
      });



    }

  }

}
