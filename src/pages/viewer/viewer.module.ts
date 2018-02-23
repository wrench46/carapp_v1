import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewerPage } from './viewer';

@NgModule({
  declarations: [
    ViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewerPage),
  ],
})
export class ViewerPageModule {}
