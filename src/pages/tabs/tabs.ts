import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { Home } from '../home/home';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = Home;
  tab3Root = SettingsPage;
  tab2Root = ProfilePage

  constructor() {

  }
}
