import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewHomePage } from './new-home';

@NgModule({
  declarations: [
    NewHomePage,
  ],
  imports: [
    IonicPageModule.forChild(NewHomePage),
  ],
})
export class NewHomePageModule {}
