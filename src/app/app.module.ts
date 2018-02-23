import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { ErrorHandler, NgModule } from '@angular/core';
//import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicApp, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { Ionic2RatingModule } from 'ionic2-rating';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { UserpagePage } from '../pages/userpage/userpage';
import { CreateprofilePage } from '../pages/createprofile/createprofile';
import { CarsPage } from '../pages/cars/cars';
import { ApplicantsPage } from '../pages/applicants/applicants';
import { ViewerPage } from '../pages/viewer/viewer';

import { DriverPage } from '../pages/driver/driver';
import { AddcarsPage } from '../pages/addcars/addcars';
import { CardetailsPage } from '../pages/cardetails/cardetails'
import { ApprovalPage } from '../pages/approval/approval';
import { DriverListPage } from '../pages/driver-list/driver-list';
import { AvailCarPage } from '../pages/avail-car/avail-car';
import { ProcessRentPage } from '../pages/process-rent/process-rent';
import { SchedDriverPage } from '../pages/sched-driver/sched-driver';
import { MessengerDriverPage } from '../pages/messenger-driver/messenger-driver';
import { MessengerUserPage } from '../pages/messenger-user/messenger-user';
import { AccountDriverPage } from '../pages/account-driver/account-driver';
import { SettingsUserPage } from '../pages/settings-user/settings-user';
import { MessagingBoxPage } from '../pages/messaging-box/messaging-box';
import { MessagingBoxDriverPage } from '../pages/messaging-box-driver/messaging-box-driver';
import { MessengerAdminPage } from '../pages/messenger-admin/messenger-admin';
import { MessagingBoxAdminPage } from '../pages/messaging-box-admin/messaging-box-admin';


//import  { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AdminPage } from '../pages/admin/admin';
import { DataServiceProvider } from '../providers/data-service/data-service';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { FCM } from '@ionic-native/fcm';
import { HyperTrack } from '@ionic-native/hyper-track';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    UserpagePage,
    CreateprofilePage,
    AdminPage,
    DriverPage,
    CarsPage,
    ApplicantsPage,
    ViewerPage,
    AddcarsPage,
    CardetailsPage,
    ApprovalPage,
    DriverListPage,
    AvailCarPage,
    ProcessRentPage,
    SchedDriverPage,
    AccountDriverPage,
    MessengerDriverPage,
    MessengerUserPage,
    SettingsUserPage,
    MessagingBoxPage,
    MessagingBoxDriverPage,
    MessengerAdminPage,
    MessagingBoxAdminPage
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
   // HttpModule,
   HttpClientModule,
   AngularFireDatabaseModule,
   AngularFireModule.initializeApp(FIREBASE_CONFIG),
   AngularFireAuthModule,
   AngularFirestoreModule,
   FormsModule,
   ReactiveFormsModule,
   IonicStorageModule.forRoot(),
   Ionic2RatingModule 

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    UserpagePage,
    CreateprofilePage,
    AdminPage,
    DriverPage,
    CarsPage,
    ApplicantsPage,
    ViewerPage,
    AddcarsPage,
    CardetailsPage,
    ApprovalPage,
    DriverListPage,
    AvailCarPage,
    ProcessRentPage,
    SchedDriverPage,
    AccountDriverPage,
    MessengerDriverPage,
    MessengerUserPage,
    SettingsUserPage,
    MessagingBoxPage,
    MessagingBoxDriverPage,
    MessengerAdminPage,
    MessagingBoxAdminPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseServiceProvider,
    DataServiceProvider,
    File,
    Transfer,
    Camera,
    FilePath,
    FCM,
    HyperTrack
   // {provide: ErrorHandler, useClass: IonicErrorHandler},
    
  ]
})
export class AppModule {}
