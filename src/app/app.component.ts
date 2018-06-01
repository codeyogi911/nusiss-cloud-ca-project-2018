import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Auth } from 'aws-amplify';
import {enableProdMode} from '@angular/core';
enableProdMode();
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = null;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    let globalActions = function() {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    };

    platform.ready()
      .then(() => {
        Auth.currentAuthenticatedUser()
          .then(() => { this.rootPage = 'NewTabsPage'; })
          .catch(() => { this.rootPage = 'NewLoginPage'; })
          .then(() => globalActions());
      });
  }
}
