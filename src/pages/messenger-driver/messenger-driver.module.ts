import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessengerDriverPage } from './messenger-driver';

@NgModule({
  declarations: [
    MessengerDriverPage,
  ],
  imports: [
    IonicPageModule.forChild(MessengerDriverPage),
  ],
})
export class MessengerDriverPageModule {}
