import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewTabsPage } from './new-tabs';

@NgModule({
  declarations: [
    NewTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(NewTabsPage),
  ],
})
export class NewTabsPageModule {}
