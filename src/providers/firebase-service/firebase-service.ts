import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


/*
  Generated class for the FirebaseServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseServiceProvider {

  constructor(public afiredbase:AngularFireDatabase,private firebaseauth:AngularFireAuth) {
   
  }
  addUserToFirebase(user){
   // this.afiredbase.list('/users/').push(user);

  }
  removeUserInFirebase(id){
    //this.afiredbase.list('/users/').push(id);
  }
  



  

  

}
