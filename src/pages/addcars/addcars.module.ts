import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddcarsPage } from './addcars';

@NgModule({
  declarations: [
    AddcarsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddcarsPage),
  ],
})
export class AddcarsPageModule {}
