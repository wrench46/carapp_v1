import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DataServiceProvider } from '../../providers/data-service/data-service'
//import { ApplicantsPage} from '../applicants/applicants';
import { DriverListPage} from '../driver-list/driver-list';
import { Storage } from '@ionic/storage';

import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the ApprovalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-approval',
  templateUrl: 'approval.html',
})
export class ApprovalPage {
  driverDetails: any;
  approvalFormGroup: FormGroup;
  approvalSelected: string = null;
  userdetailsstorage:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private _formBuilder: FormBuilder, private dataservice: DataServiceProvider,private storage: Storage,private firebasechatdb:AngularFireDatabase) {

    this.storage.get('datafromdb').then((response)=>{
      this.userdetailsstorage= response[0];
      
     });
   
   this.approvalSelected=null;
    this.driverDetails = this.navParams.get('driverdetails');

    this.approvalFormGroup = this._formBuilder.group({
      //driver_name: [''],
      //driver_phone: [''],
      //driver_email: [''],
      driver_status: ['']
    });
    console.log(this.driverDetails);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApprovalPage');
  }

  updataStatus(){
  
    var objectdata={
      id: this.driverDetails.id,
      action:'driver-approval'
    }

    var newobj = Object.assign(objectdata, this.approvalFormGroup.value);

   
    this.dataservice.setDriverApproval(newobj).subscribe((response)=>{
      
      if(response['status']== 1){

        if(response['approval']== 'approved'){

          var adminMessaging={
            action:'admin-messaging',
            chatmainid:this.userdetailsstorage['id'],
            chatclientid:this.driverDetails.id
           }
      
           this.dataservice.processMessagingAdmin(adminMessaging).subscribe((response)=>{
            // console.log(response);
             if(response['messaging'] == '0'){
               
               var chattable= '/'+this.userdetailsstorage['id']+'-'+this.driverDetails.id;
       
               var newobj ={
                 specialMessage:true,
                 message:"Chat room created"
               }
       
               this.firebasechatdb.list(chattable).push(newobj);
      
             }


            /* 

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
               */



             this.navCtrl.push(DriverListPage);
       
            });



        }
        
        
      }
    });


  }
  onSelectChange(event){
    //alert(JSON.stringify(event));
    this.approvalSelected=event;
  }

}
