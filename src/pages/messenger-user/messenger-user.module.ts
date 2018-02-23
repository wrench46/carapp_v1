import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessengerUserPage } from './messenger-user';

@NgModule({
  declarations: [
    MessengerUserPage,
  ],
  imports: [
    IonicPageModule.forChild(MessengerUserPage),
  ],
})
export class MessengerUserPageModule {}
