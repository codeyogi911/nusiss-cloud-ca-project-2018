import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { Home } from '../home/home';
import { friendlistPage } from '../friendlist/friendlist';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = Home;
  tab3Root = SettingsPage;
  tab2Root = friendlistPage;

  constructor() {

  }
}
