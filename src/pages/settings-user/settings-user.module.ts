import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsUserPage } from './settings-user';

@NgModule({
  declarations: [
    SettingsUserPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsUserPage),
  ],
})
export class SettingsUserPageModule {}
