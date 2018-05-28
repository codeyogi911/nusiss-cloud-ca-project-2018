import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
// import { Camera } from '@ionic-native/camera';

import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ConfirmSignInPage } from '../pages/confirmSignIn/confirmSignIn';
import { ConfirmSignUpPage } from '../pages/confirmSignUp/confirmSignUp';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { TabsPage } from '../pages/tabs/tabs';
import { friendlistPage } from '../pages/friendlist/friendlist';
// import { TasksPage } from '../pages/tasks/tasks';
import { NewPostCreatePage } from '../pages/new-post/new-post';
import { Home } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DynamoDB } from '../providers/aws.dynamodb';
import {GlobalVars} from '../providers/GlobalVars';
// import * as $ from 'jquery';
import Amplify from 'aws-amplify';
const aws_exports = require('../aws-exports').default;

Amplify.configure(aws_exports);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    ConfirmSignInPage,
    ConfirmSignUpPage,
    SettingsPage,
    AboutPage,
    AccountPage,
    TabsPage,
    friendlistPage,
    // TasksPage,
    NewPostCreatePage,
    Home
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ConfirmSignInPage,
    ConfirmSignUpPage,
    SettingsPage,
    AboutPage,
    AccountPage,
    TabsPage,
    friendlistPage,
    // TasksPage,
    NewPostCreatePage,
    Home
  ],
  providers: [
    GlobalVars,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    FileTransfer,
    // FileUploadOptions,
    FileTransferObject,
    File,
    DynamoDB
  ]
})
export class AppModule {}

declare var AWS;
AWS.config.customUserAgent = AWS.config.customUserAgent + ' Ionic';
