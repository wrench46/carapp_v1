import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController,Loading, Slides,ModalController  } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { CardetailsPage } from '../cardetails/cardetails';
import { Storage } from '@ionic/storage';
import { Ionic2RatingModule } from "ionic2-rating";
/**
 * Generated class for the ProcessRentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-process-rent',
  templateUrl: 'process-rent.html',
})
export class ProcessRentPage {

  @ViewChild(Slides) slides: Slides;

  loading: Loading;
  myDate: String = new Date().toISOString();
  public event = {
    month: this.myDate,
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  
  }

  userdetails:any;
  userdetailsstorage:any;

  availablecarunits:any;
  availabledrivers:any;

  numofavailablecars:number;
  numofavailabledrivers:number;

  selectedcars:Array<any> = [];
  selecteddrivers:Array<any> = [];

  selectedcheck:boolean = false;
  submitallowed:boolean=false;
  totalamountdue:number;
  totalnumofdays:number;
  totalamountcar:number;
  totaldue :number;
  userid:any;
  ratedriver:any;
  ratecar:any;
  //ratestar:any;


  //todaysEndDate:String;
  
  todayMonth=('0'+new Date().getMonth()+1).slice(-2);
  nowDate=('0'+new Date().getDate()).slice(-2);
  
  todayDate: String = new Date().getFullYear().toString()+"-"+this.todayMonth.toString()+"-"+this.nowDate.toString();
  todaysDate: String = new Date().getFullYear().toString()+"-"+this.todayMonth.toString()+"-"+this.nowDate.toString();
  //todayDate: String ="2018-01-02";
  //todaysDate: String ="2018-01-02";

  todaysEndDate:String = this.todayDate;

  constructor(public navCtrl: NavController, public navParams: NavParams,private dataservice: DataServiceProvider,public loadingCtrl: LoadingController, private alertCtrl: AlertController,private storage: Storage) {

   
    this.userid= this.navParams.data[0].id;

   this.getAvailableCars(this.todayDate,this.todaysEndDate);

      this.storage.get('datafromdb').then((response)=>{
        
          this.userdetailsstorage= response[0];

          if(this.navParams.data[0] == undefined){

          
            this.userdetails = this.userdetailsstorage;
            this.userid= this.userdetailsstorage.id;
          }else{
          
            this.userdetails= this.navParams.data[0];
            this.userid= this.navParams.data[0].id;
          }

          this.checkRatings(this.userdetails,'v_driver_rating');

          //alert(JSON.stringify(this.userdetails));
          console.log(this.userdetails);
      });
   
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessRentPage');
  }

  checkRatings($userdetails,$table){

   // alert('check');
    

    var datatosend ={
      action:'check-user-rate',
      table:$table,
      userid:this.userid
    }


    this.dataservice.checkRatings(datatosend).subscribe((response)=>{
      this.ratedriver = response['forrating'][0];
    

      if(this.ratedriver == undefined){

      
        var datatosend ={
          action:'check-user-rate',
          table:'v_car_rating',
          userid:this.userid
        }

        this.dataservice.checkRatings(datatosend).subscribe((response)=>{ 
          this.ratecar = response['forrating'][0];
       
          if(this.ratecar != undefined){
            this.showRatingCar(this.ratecar);
          }

        });

      } else {

        this.showRatingDriver(this.ratedriver);
      }




    });

  }
  
  changeDateStart(){
   this.todaysEndDate=this.todayDate;
   this.getAvailableCars(this.todayDate,this.todaysEndDate);
  }
  refreshDates(){
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


    var datatosend={
        action:'get-available-cars',
        datefrom:dateFrom,
        dateto:dateTo
    }

   //alert(dateFrom);
    this.dataservice.getAvailbleCars(datatosend).subscribe((response)=>{

      console.log(response);

      this.availablecarunits = response['available_cars'];
      this.availabledrivers = response['available_drivers'];
     // this.ratestar =  response['available_cars'];

      this.numofavailablecars= response['available_cars'].length;
      this.numofavailabledrivers= response['available_drivers'].length;
      this.totalnumofdays = response['num_of_days'];
      this.loading.dismiss();
      });

      this.selecteddrivers=[];
      this.selectedcars=[];
      this.totaldue=0;
  }

  naviTo(cardetails){
    this.navCtrl.push(CardetailsPage, {
      firstPassed: cardetails
    })
  }
  getSelectedCarValue(valueselected,currenstatus){

    if(currenstatus.checked){
   
      this.selectedcars.push(valueselected);
      this.getcaramountperday();

    }else{
      var indexcount=0;

      for (let entry of this.selectedcars) {
       
        if(valueselected.id === entry.id){
          this.selectedcars.splice(indexcount,1);
        }
        indexcount++;
      }
      this.getcaramountperday();
     // alert(this.selectedcars.length +" -- "+ this.selecteddrivers.length);
      if(this.selectedcars.length < this.selecteddrivers.length){
        this.selecteddrivers=[];
        this.selectedcars=[];
        this.totaldue=0;
        this.changeDateEnd();
      
      }
    }

    if(this.selectedcars.length === this.selecteddrivers.length){
      if(this.selectedcars.length > 0){
        this.submitallowed = true;
      }else{
        this.submitallowed = false;
      }
      
    }else{
      this.submitallowed = false;
    }

  console.log(this.selectedcars);
   //alert(currenstatus);
  }

  getcaramountperday(){
    this.totalamountcar=0;
    for(let counter of this.selectedcars){
        this.totalamountcar=(parseInt(counter.rent_price_per_day) + this.totalamountcar) ;
        //alert(this.totalamountcar);
    }
    //alert(this.totalamountcar +" --- "+this.totalnumofdays);
    this.totaldue = this.totalamountcar * this.totalnumofdays;

   // return this.totalamountcar;
  }

  getSelectedDriverValue(valueselected,currenstatus){ 
        if(currenstatus.checked){
          if(this.selectedcars.length > this.selecteddrivers.length){
            this.selecteddrivers.push(valueselected);
               
             }else{
              currenstatus.checked=false;
              
             }
      
          
        }else{
         
          var indexcount=0;

          for (let entry of this.selecteddrivers) {
          
            if(valueselected.id === entry.id){
              this.selecteddrivers.splice(indexcount,1);
            }
            indexcount++;
          }
      
        }

   //alert(this.selectedcars.length +" === "+ this.selecteddrivers.length);
   if(this.selectedcars.length === this.selecteddrivers.length){
    if(this.selectedcars.length > 0){
      this.submitallowed = true;
    }else{
      this.submitallowed = false;
    }
    
  }else{
    this.submitallowed = false;
  }
    

   // alert(JSON.stringify(valueselected));
  console.log(this.selecteddrivers);
   //alert(currenstatus);
  }

  saveRent(){

    this.todayMonth=('0'+new Date().getMonth()+1).slice(-2);
    this.nowDate=('0'+new Date().getDate()).slice(-2);
    
    this.todayDate = new Date().getFullYear().toString()+"-"+this.todayMonth.toString()+"-"+this.nowDate.toString();
    this.todaysDate = new Date().getFullYear().toString()+"-"+this.todayMonth.toString()+"-"+this.nowDate.toString();

    this.loading= this.loadingCtrl.create({
      content: 'Saving please wait...',
      spinner:'dots'
      
    });

    var saverent= {
        savetohistory:{
          rentedcars:this.selectedcars,
          selecteddrivers:this.selecteddrivers,
          daterange:{dateto:this.todaysEndDate,datefrom:this.todayDate},
          totalamount:this.totaldue
        },action:'save-car-rent',
        id:this.userid
    } 


    //alert(JSON.stringify(saverent));
    
    this.dataservice.saveCarRental(saverent).subscribe((response)=>{
      //alert(this.todayDate +" -- "+ this.todaysEndDate);
      if(response['status']=='1'){
        this.selecteddrivers=[];
        this.selectedcars=[];
        this.totaldue=0;
        this.changeDateEnd();
        this.getAvailableCars(this.todayDate,this.todaysDate);
        this.loading.dismissAll();
        this.slides.slideTo(0, 500);
        //this.navCtrl.setRoot(ProcessRentPage);

        //this.navCtrl.setRoot(this.navCtrl.getActive().component);
        this.alertMessage(response['message']);

      }else{
        this.selecteddrivers=[];
        this.selectedcars=[];
        this.totaldue=0;
        this.changeDateEnd();
        this.getAvailableCars(this.todayDate,this.todaysDate);
        this.loading.dismissAll();
        this.slides.slideTo(0, 500);
       // this.navCtrl.setRoot(ProcessRentPage);
        //this.navCtrl.setRoot(this.navCtrl.getActive().component);
        this.alertMessage(response['message']);
      }

    });
  


  }

  alertMessage(message){
    this.alertCtrl.create({
      title: 'Info',
      subTitle: message,
      buttons: ['Ok']
    }).present();
  }

  showRatingDriver($carlogdetails){

   //alert(JSON.stringify($carlogdetails));
    let ratedriver = this.alertCtrl.create({
      enableBackdropDismiss:false
    });
    ratedriver.setTitle('Rate Driver');

    ratedriver.addInput({
      type: 'radio',
      label: 'Very Poor',
      value: '1'
    });

    ratedriver.addInput({
      type: 'radio',
      label: 'Poor',
      value: '2'
    });

    ratedriver.addInput({
      type: 'radio',
      label: 'Fair',
      value: '3',
      checked: true
    });

    ratedriver.addInput({
      type: 'radio',
      label: 'Good',
      value: '4'
    });
    ratedriver.addInput({
      type: 'radio',
      label: 'Excellent',
      value: '5'
    });
    ratedriver.setMessage('Please rate your previous experience with '+$carlogdetails.first_name+ ' '+$carlogdetails.last_name);
// ratedriver.addButton('Cancel');
  ratedriver.addButton({
      text: 'Ok',
      handler: data => {
        var updatesend={
          action:'update-rating',
          carlogid:$carlogdetails['car_log_id'],
          colupdate:'driver_rating',
          driverid:$carlogdetails['assigned_driver'],
          carunitid:$carlogdetails['car_rented_unit_id'],
          value:data
        }

        this.dataservice.updateRatings(updatesend).subscribe((response)=>{

          if(response['status']== '1'){
           
            this.checkRatings(this.userdetails,'v_driver_rating');
          }else{
            alert('Error x10001');
          }

        });

     
        
      }
    });
    

    ratedriver.present().then(() => {
    // alert('test');
    });


  }

  showRatingCar($carlogdetails){

   // alert('ca ratgi');
    //alert(JSON.stringify($carlogdetails));
    let ratecar = this.alertCtrl.create({
      enableBackdropDismiss:false
    });

    ratecar.setTitle('Rate Car');

    ratecar.addInput({
      type: 'radio',
      label: 'Very Poor',
      value: '1'
    });

    ratecar.addInput({
      type: 'radio',
      label: 'Poor',
      value: '2'
    });

    ratecar.addInput({
      type: 'radio',
      label: 'Fair',
      value: '3',
      checked: true
    });

    ratecar.addInput({
      type: 'radio',
      label: 'Good',
      value: '4'
    });
    ratecar.addInput({
      type: 'radio',
      label: 'Excellent',
      value: '5'
    });
    ratecar.setMessage('Please rate your previous experience with '+$carlogdetails.car_model+'.');
// ratedriver.addButton('Cancel');
ratecar.addButton({
      text: 'Ok',
      handler: data => {

        var updatesend={
          action:'update-rating',
          carlogid:$carlogdetails['car_log_id'],
          colupdate:'exp_ratings',
          carunitid:$carlogdetails['car_rented_unit_id'],
          value:data
        }
     
        this.dataservice.updateRatings(updatesend).subscribe((response)=>{
         

          if(response['status'] != '1'){
            alert('Error x10002');
          }

        });
        
      }
    });
    

    ratecar.present().then(() => {
    // alert('test');
    });


  }





}
