import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { Home } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = Home;
  tab2Root = SettingsPage;

  constructor() {

  }
}
