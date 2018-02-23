import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the MessagingBoxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messaging-box',
  templateUrl: 'messaging-box.html',
})
export class MessagingBoxPage {

  firebasechatid:string;
  username:string="";
  messagetosend:string="";
  chatmessages: object[]=[];
  driverdetail:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public firebasechatdb:AngularFireDatabase) {

  this.firebasechatid = this.navParams.data['chatfirebasetable'];
  
  this.driverdetail = this.navParams.data['driverdetail'];
  
  var chattablfb= '/'+this.firebasechatid;

   this.username = this.navParams.data['username'];

   this.firebasechatdb.list(chattablfb).valueChanges().subscribe(response=>{
   // console.log(response);
      this.chatmessages=response;
   
  });

  console.log( this.chatmessages);
  

}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagingBoxPage');
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
