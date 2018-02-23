import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverListPage } from './driver-list';

@NgModule({
  declarations: [
    DriverListPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverListPage),
  ],
})
export class DriverListPageModule {}
