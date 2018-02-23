import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Loading  } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { MessagingBoxPage } from '../messaging-box/messaging-box';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the MessengerUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messenger-user',
  templateUrl: 'messenger-user.html',
})
export class MessengerUserPage {

  userdetails:any;
  userdetailsstorage:any;
  activedrivers:any;
  chatdbid:string;
  userdatas:any;

  username:string="";
  chatfirebase:string;
  messagetosend:string="";

  adminchat: object[]=[];

  allmessages: string = "drivers";

  constructor(public navCtrl: NavController, public navParams: NavParams,private firebasechatdb:AngularFireDatabase,private dataservice:DataServiceProvider,private storage: Storage,public loadingCtrl: LoadingController) {
  
    this.storage.get('datafromdb').then((response)=>{
     
        this.userdetailsstorage= response[0];

        if(this.navParams.data[0] == undefined){

        
          this.userdetails = this.userdetailsstorage;
          
        }else{
        
          this.userdetails= this.navParams.data[0];
        }
        
    
      var datatosend={
        action:'get-common-data',
        table: 'v_messaging_drivers',
        dbcol: 'chat_client_id',
        myid: this.userdetails['id']
      }
      this.dataservice.getCommonData(datatosend).subscribe((response)=>{
    
      this.activedrivers = response['resultset'];
   
        });


        this.chatfirebase = '/1-'+this.userdetails['id'];

        this.firebasechatdb.list(this.chatfirebase).valueChanges().subscribe(response=>{
          // console.log(response);
             this.adminchat=response;
          
         });
    });
   
  
  }

  ionViewDidLoad() {
  
    console.log('ionViewDidLoad MessengerUserPage');
  }
  
  ionViewWillEnter(){
    
   

  }

  goToMessaging($clientid,$driver){

    var chatdbid ={
      chatfirebasetable: $driver.id+'-'+$clientid,
      username:this.userdetails['username'],
      driverdetail:$driver
    }

    this.navCtrl.setRoot(MessagingBoxPage,chatdbid);

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
