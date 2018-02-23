import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DataServiceProvider Provider');
  }

  getLists($table){
    var formdata ={
      action:'get-data-lists',
      tablecheck: $table
    }
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',formdata);
 
   }

   addCartoDb(formdata){
    var formaction ={
      action:'add-car'
    }
    var newobj = Object.assign(formaction, formdata);

    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',newobj);
 
   }

   checkUserExist(firebaseuuid){
     
    var formaction ={
      action:'check-user-exist',
      firebaseuserid: firebaseuuid
    }
   // var newobj = Object.assign(formaction);

    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',formaction);
 
   }

   checkIfUserDb(tabledb){
    
    var formaction ={
      action:'check-userdb-empty',
      tablecheck:tabledb
    }
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',formaction);
   }

  addUserProfileToDb(formdatas){
    
     
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',formdatas);
   }

getPendingDrivers(){
     var posteddata={
       action: 'get-pending-drivers'
     }
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',posteddata);
   }
getAllDrivers(){
    var posteddata={
      action: 'get-all-drivers'
    }
   return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',posteddata);
  }

setDriverApproval(datatosend){
  
   return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
  }

getAvailbleCars(datatosend){
    
     return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
    }

saveCarRental(datatosend){
  
  return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
}

getDriverSchedule(datatosend){
  //alert(JSON.stringify(datatosend));
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
  }

processRentalApprovals(datatosend){
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
  }

processDriverSchedule(datatosend){
  //alert(JSON.stringify(datatosend));
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);

  }

  getWaitingforApprovals(datatosend){
  
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
  }  

  processhypertrackupdate(datatosend){
  
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
  }  

  getCommonData(datatosend){
  
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
  } 

  updateProfiles(datatosend){
  
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
   }

   processMessagingAdmin(datatosend){
  
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
   }

   processRemoveCar(datatosend){
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
   }
   checkBeforeRemoveCar(datatosend){
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
   }

   checkRatings(datatosend){
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
   }
   
   updateRatings(datatosend){
    return this.http.post('http://sagla.tech/backend/apps/carapp/backend.php',datatosend);
   }
 

}
