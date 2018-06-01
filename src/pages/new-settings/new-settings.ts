import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { App } from 'ionic-angular';
import { Auth } from 'aws-amplify';
import { AboutPage } from '../about/about';
import { AccountPage } from '../account/account';

@IonicPage()
@Component({
  selector: 'page-new-settings',
  templateUrl: 'new-settings.html',
})
export class NewSettingsPage {
  public aboutPage = AboutPage;
  public accountPage = AccountPage;
  constructor(public app: App) {
  }

  logout() {
    Auth.signOut()
      .then(() => this.app.getRootNav().setRoot('NewLoginPage'));
  }
  ionViewWillEnter() {
    Auth.currentCredentials()
  .catch(err => this.app.getRootNav().setRoot('NewLoginPage'));
  }

}
