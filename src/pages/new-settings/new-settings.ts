import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App } from 'ionic-angular';
import { Auth } from 'aws-amplify';

// import { LoginPage } from '../login/login';
import { AboutPage } from '../about/about';
import { AccountPage } from '../account/account';
/**
 * Generated class for the NewSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewSettingsPage');
  }

}
