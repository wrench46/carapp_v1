import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the MessagingBoxAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messaging-box-admin',
  templateUrl: 'messaging-box-admin.html',
})
export class MessagingBoxAdminPage {

  messagedetail:any;
  username:string="";
  messagetosend:string="";
  chatmessages: object[]=[];
  firebasechatid:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,public firebasechatdb:AngularFireDatabase,private storage: Storage) {
    this.messagedetail=this.navParams.data;
    

    this.storage.get('datafromdb').then((response)=>{   

    this.username = response[0]['username'];
    var chattablfb= '/1-'+this.navParams.data['id'];
    this.firebasechatid=chattablfb;
  
   this.firebasechatdb.list(chattablfb).valueChanges().subscribe(response=>{
    // console.log(response);
       this.chatmessages=response;
    
   });

  });

  }

  sendChatMessage(){
    //alert(this.messagetosend);
   // var chattable= '/1-'+this.firebasechatid;
        
      this.firebasechatdb.list(this.firebasechatid).push({
        username:this.username,
        message:this.messagetosend
      });

      this.messagetosend="";
      
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagingBoxAdminPage');
  }

}
