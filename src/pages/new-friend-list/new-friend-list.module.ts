import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewFriendListPage } from './new-friend-list';

@NgModule({
  declarations: [
    NewFriendListPage,
  ],
  imports: [
    IonicPageModule.forChild(NewFriendListPage),
  ],
})
export class NewFriendListPageModule {}
