import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewSignupPage } from './new-signup';

@NgModule({
  declarations: [
    NewSignupPage,
  ],
  imports: [
    IonicPageModule.forChild(NewSignupPage),
  ],
})
export class NewSignupPageModule {}
