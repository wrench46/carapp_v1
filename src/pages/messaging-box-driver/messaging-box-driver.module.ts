import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagingBoxDriverPage } from './messaging-box-driver';

@NgModule({
  declarations: [
    MessagingBoxDriverPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagingBoxDriverPage),
  ],
})
export class MessagingBoxDriverPageModule {}
