import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchedDriverPage } from './sched-driver';

@NgModule({
  declarations: [
    SchedDriverPage,
  ],
  imports: [
    IonicPageModule.forChild(SchedDriverPage),
  ],
})
export class SchedDriverPageModule {}
