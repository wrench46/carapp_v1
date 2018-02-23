import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagingBoxPage } from './messaging-box';

@NgModule({
  declarations: [
    MessagingBoxPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagingBoxPage),
  ],
})
export class MessagingBoxPageModule {}
