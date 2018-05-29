import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { MyApp } from './app.component';
import { ConfirmSignInPage } from '../pages/confirmSignIn/confirmSignIn';
import { ConfirmSignUpPage } from '../pages/confirmSignUp/confirmSignUp';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { NewPostCreatePage } from '../pages/new-post/new-post';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DynamoDB } from '../providers/aws.dynamodb';
import {GlobalVars} from '../providers/GlobalVars';
import Amplify from 'aws-amplify';
const aws_exports = require('../aws-exports').default;

Amplify.configure(aws_exports);

@NgModule({
  declarations: [
    MyApp,
    ConfirmSignInPage,
    ConfirmSignUpPage,
    AboutPage,
    AccountPage,
    NewPostCreatePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ConfirmSignInPage,
    ConfirmSignUpPage,
    AboutPage,
    AccountPage,
    NewPostCreatePage
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
