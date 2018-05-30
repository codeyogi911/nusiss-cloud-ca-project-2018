import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NewTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-tabs',
  templateUrl: 'new-tabs.html',
})
export class NewTabsPage {

  tab1Root = 'NewHomePage';
  tab3Root = 'NewSettingsPage';
  tab2Root = 'NewFriendListPage';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}
