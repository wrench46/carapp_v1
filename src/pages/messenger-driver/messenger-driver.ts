import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Loading } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Storage } from '@ionic/storage';
import { MessagingBoxDriverPage } from '../messaging-box-driver/messaging-box-driver';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the MessengerDriverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messenger-driver',
  templateUrl: 'messenger-driver.html',
})
export class MessengerDriverPage {

  userdetails:any;
  activeclients:any;
  userdetailsstorage:any;

  adminchat: object[]=[];

  loading: Loading;

  username:string="";
  messagetosend:string="";
  chatfirebase:string;

  allmessages: string = "clients";

  constructor(public navCtrl: NavController, public navParams: NavParams,private dataservice:DataServiceProvider,private storage: Storage,public loadingCtrl: LoadingController,public firebasechatdb:AngularFireDatabase) {

    this.loading= this.loadingCtrl.create({
      content: 'Please wait...',
      spinner:'dots'
    });

    this.loading.present();

 
    this.storage.get('datafromdb').then((response)=>{

      this.userdetailsstorage= response[0];

      if(this.navParams.data[0] == undefined){

        this.userdetails = this.userdetailsstorage;
        
      }else{
        //alert(this.navParams.data[0]['id'] +' -- '+this.userdetailsstorage['id']);
        this.userdetails= this.navParams.data[0];
      }


      var datatosend={
        action:'get-common-data',
        table: 'v_messaging_client',
        dbcol: 'chat_driver_id',
        myid:  this.userdetails['id']
      }

      this.dataservice.getCommonData(datatosend).subscribe((response)=>{
    
        this.activeclients = response['resultset'];
       this.loading.dismissAll();

      });

      this.username =this.userdetails['username'];
      this.chatfirebase = '/1-'+this.userdetails['id'];

      this.firebasechatdb.list(this.chatfirebase).valueChanges().subscribe(response=>{
        // console.log(response);
           this.adminchat=response;
        
       });

    });
   
   
   

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessengerDriverPage');
  }

  ionViewWillEnter(){



  }

  goToMessaging($client,$driverid){

   var chatdbid ={
    chatfirebasetable: $driverid+'-'+$client.id,
    username:this.userdetails['username'],
    clientdetails:$client
  }

  //alert(JSON.stringify(chatdbid));
   this.navCtrl.setRoot(MessagingBoxDriverPage,chatdbid);

  }

  sendChatMessage(){
    //alert(this.messagetosend);
  
        
      this.firebasechatdb.list(this.chatfirebase).push({
        username:this.username,
        message:this.messagetosend
      });

      this.messagetosend="";
      
    }

}
