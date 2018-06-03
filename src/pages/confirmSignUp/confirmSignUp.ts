import { Component } from '@angular/core';

import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

// import { LoginPage } from '../login/login';

const logger = new Logger('ConfirmSignUp');

@Component({
  selector: 'page-confirm-signup',
  templateUrl: 'confirmSignUp.html'
})
export class ConfirmSignUpPage {

  public code: string;
  public username: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController) {
    this.username = navParams.get('username');
  }

  confirm() {
    Auth.confirmSignUp(this.username, this.code)
      .then(() => this.navCtrl.push('NewLoginPage'))
      .catch(err => {
        logger.debug('confirm error', err);
        let toast = this.toastCtrl.create({
            message: 'Invalid Confirmation Code!',
            duration: 3000,
            position: 'top'
            });

        toast.onDidDismiss(() => {
        console.log('Dismissed toast');
        });

        toast.present();
      });
      // .then(() => loading.dismiss());
  }

  resendCode() {
    Auth.resendSignUp(this.username)
      .then(() => logger.debug('sent'))
      .catch(err => logger.debug('send code error', err));
  }
}
