import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

// import { LoginPage } from '../login/login';
import { ConfirmSignUpPage } from '../confirmSignUp/confirmSignUp';

const logger = new Logger('SignUp');
export class UserDetails {
    username: string;
    email: string;
    phone_number: string;
    password: string;
    passwordr: string;
}

@IonicPage()
@Component({
  selector: 'page-new-signup',
  templateUrl: 'new-signup.html',
})
export class NewSignupPage {
  public userDetails: UserDetails;

  error: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
                this.userDetails = new UserDetails();
  }
  signup() {



    let details = this.userDetails;
    if (details.password == details.passwordr){
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();

    this.error = null;
    logger.debug('register');
    Auth.signUp(details.username, details.password, details.email, details.phone_number)
      .then(user => {
        this.navCtrl.push(ConfirmSignUpPage, { username: details.username });
      })
      .catch(err => { this.error = err; })
      .then(() => loading.dismiss());
      }
      else {
        // loading.dismiss();
        let toast = this.toastCtrl.create({
    message: 'Passwords do not match, Please try entering again!',
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
      }
  }

  login() {
    this.navCtrl.push('NewLoginPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewSignupPage');
  }

}
