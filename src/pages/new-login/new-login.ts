import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';
import { ConfirmSignInPage } from '../confirmSignIn/confirmSignIn';

const logger = new Logger('Login');

export class LoginDetails {
  username: string;
  password: string;
}

@IonicPage()
@Component({
  selector: 'page-new-login',
  templateUrl: 'new-login.html',
})
export class NewLoginPage {

  public loginDetails: LoginDetails;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController) {
    this.loginDetails = new LoginDetails();
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.loginDetails;
    logger.info('login..');
    Auth.signIn(details.username, details.password)
      .then(user => {
        logger.debug('signed in user', user);
        if (user.challengeName === 'SMS_MFA') {
          this.navCtrl.push(ConfirmSignInPage, { 'user': user });
        } else {
          this.navCtrl.setRoot('NewTabsPage');
        }
      })
      .catch(err => {
        logger.debug('errrror', err);
        this.navCtrl.push('NewSignupPage');
      })
      .then(() => loading.dismiss());
  }

  signup() {
    this.navCtrl.push('NewSignupPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewLoginPage');
  }

}
