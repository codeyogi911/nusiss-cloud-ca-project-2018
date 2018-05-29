import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewSettingsPage } from './new-settings';

@NgModule({
  declarations: [
    NewSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(NewSettingsPage),
  ],
})
export class NewSettingsPageModule {}
