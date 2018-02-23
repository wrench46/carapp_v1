import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the MessagingBoxDriverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messaging-box-driver',
  templateUrl: 'messaging-box-driver.html',
})
export class MessagingBoxDriverPage {

  firebasechatid:string;
  username:string="";
  messagetosend:string="";
  chatmessages: object[]=[];
  clientdetail:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public firebasechatdb:AngularFireDatabase) {

   this.username = this.navParams.data['username'];
   
   this.clientdetail = this.navParams.data['clientdetails'];

   this.firebasechatid = this.navParams.data['chatfirebasetable'];

   var chattablfb= '/'+this.firebasechatid;
   
   this.firebasechatdb.list(chattablfb).valueChanges().subscribe(response=>{
    // console.log(response);
       this.chatmessages=response;
    
   });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagingBoxDriverPage');
  }

  sendChatMessage(){
    //alert(this.messagetosend);
    var chattable= '/'+this.firebasechatid;
        
      this.firebasechatdb.list(chattable).push({
        username:this.username,
        message:this.messagetosend
      });

      this.messagetosend="";
      
    }
     
}
