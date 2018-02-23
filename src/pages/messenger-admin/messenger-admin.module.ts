import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessengerAdminPage } from './messenger-admin';

@NgModule({
  declarations: [
    MessengerAdminPage,
  ],
  imports: [
    IonicPageModule.forChild(MessengerAdminPage),
  ],
})
export class MessengerAdminPageModule {}
