import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountDriverPage } from './account-driver';

@NgModule({
  declarations: [
    AccountDriverPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountDriverPage),
  ],
})
export class AccountDriverPageModule {}
