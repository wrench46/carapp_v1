import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagingBoxAdminPage } from './messaging-box-admin';

@NgModule({
  declarations: [
    MessagingBoxAdminPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagingBoxAdminPage),
  ],
})
export class MessagingBoxAdminPageModule {}
