import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Loading } from 'ionic-angular';

import { MessagingBoxAdminPage } from '../messaging-box-admin/messaging-box-admin';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';


/**
 * Generated class for the MessengerAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messenger-admin',
  templateUrl: 'messenger-admin.html',
})
export class MessengerAdminPage {

  loading: Loading;
  allmessages: string = "clients";
  userdetailsstorage:any;
  userdetails:any;
  activeclients:object[]=[];
  activedrivers:object[]=[];
  idclientarrays:any = [];
  iddriverarrays:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private dataservice:DataServiceProvider,private storage: Storage,public loadingCtrl: LoadingController,public firebasechatdb:AngularFireDatabase) {

   
  
  }

  getClientsChat(){
   
    this.loading= this.loadingCtrl.create({
      content: 'Please wait...',
      spinner:'dots'
      
    });
    this.loading.present();

    var datatosend={
      action:'get-admin-chat',
      chatters:'v_messaging_client'

    }

    this.dataservice.getCommonData(datatosend).subscribe((response)=>{
  
     // this.activeclients = response['chatters'];

      response['chatters'].forEach(element => {
     
        if(this.idclientarrays.indexOf(element.id)==-1){
          this.idclientarrays.push(element.id);
          this.activeclients.push(element);
        }


      });

      //alert(JSON.stringify(this.activeclients));
     this.loading.dismissAll();

    });

    

  }


  getDriverChat(){

    this.loading= this.loadingCtrl.create({
      content: 'Please wait...',
      spinner:'dots'
      
    });

    this.loading.present();

    var datatosend = {
      action:'get-admin-chat',
      chatters:'v_messaging_drivers'

    }

    this.dataservice.getCommonData(datatosend).subscribe((response)=>{
  
     // this.activedrivers = response['chatters'];
   
    // alert(JSON.stringify(this.activedrivers ));

    response['chatters'].forEach(element => {
     
      if(this.iddriverarrays.indexOf(element.id)==-1){
        this.iddriverarrays.push(element.id);
        this.activedrivers.push(element);
      }


    });

    this.loading.dismissAll();

    });

  }
  ionViewWillEnter(){
   

    this.allmessages = "clients";
  


    this.storage.get('datafromdb').then((response)=>{  
     
      this.userdetailsstorage= response[0];

      if(this.navParams.data[0] == undefined){

        this.userdetails = this.userdetailsstorage;
        
      }else{
        //alert(this.navParams.data[0]['id'] +' -- '+this.userdetailsstorage['id']);
        this.userdetails= this.navParams.data[0];
      }
      this.getClientsChat();
     

    });
  }

  goToMessaging($details){
    //alert(JSON.stringify($details));

   this.navCtrl.setRoot(MessagingBoxAdminPage,$details);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessengerAdminPage');
  }

}
