import { Component, ViewChild } from '@angular/core';

import { LoadingController, NavController } from 'ionic-angular';
import { Auth, Storage, Logger } from 'aws-amplify';

import { Camera, CameraOptions } from '@ionic-native/camera';

const logger = new Logger('Account');
import { GlobalVars } from '../../providers/GlobalVars';
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  @ViewChild('avatar') avatarInput;

  public avatarPhoto: string;
  public selectedPhoto: Blob;
  public userId: string;
  public username: string;
  public attributes: any;
  public lambda: any;
  public user: any;

  constructor(public navCtrl: NavController,
              public camera: Camera,
              public loadingCtrl: LoadingController, public globals: GlobalVars) {

  }

  ionViewWillEnter() {
    Auth.currentCredentials()
    .then(() => {
      this.attributes = [];
      this.avatarPhoto = null;
      this.selectedPhoto = null;

      Auth.currentUserInfo()
        .then(info => {
          this.globals.invokeLambda('getUsers',{})
          .then(data => {
            var that = this;
            var users = JSON.parse(data.Payload);
            this.user = users.find(function(user){
              return user.username == that.username;
            });
            this.refreshAvatar();
          })
        .catch(err => console.log(err, err.stack));

          // this.userId = info.id;
          this.username = info.username;
          this.attributes = [];
          if (info['email']) { this.attributes.push({ name: 'email', value: info['email']}); }
          if (info['phone_number']) { this.attributes.push({ name: 'phone_number', value: info['phone_number']}); }
          // this.refreshAvatar();
        });
        this.lambda = this.globals.getLambda();
    })
  .catch(err => this.app.getRootNav().setRoot('NewLoginPage'));
  }

  refreshAvatar() {
          // var that = this;
          // var users = this.globals.getUsers();
          // var user = users.find(function(user){
          //   return user.username == that.username;
          // });
          Storage.get(this.user.avatarPath, { level: 'public' })
            .then(url => this.avatarPhoto = (url as string))
            .catch(err => console.log(err));
}

  dataURItoBlob(dataURI) {
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };

  selectAvatar() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.selectedPhoto  = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);
      this.upload();
    }, (err) => {
      this.avatarInput.nativeElement.click();
      // Handle error
    });
  }

  uploadFromFile(event) {
    const files = event.target.files;
    logger.debug('Uploading', files)

    const file = files[0];
    const { type } = file;
    // var that = this;
    Storage.put(this.username + '/avatar.jpeg', file, { contentType: type })
      .then(() => {

        this.globals.invokeLambda('updateAvatar',{"username":this.username})
        .then(data => {
            this.user.avatarPath = this.username + '/avatar.jpeg';
            this.refreshAvatar();
          });
        })
        .catch(err => console.log(err, err.stack));
  }

  upload() {
    if (this.selectedPhoto) {
      let loading = this.loadingCtrl.create({
        content: 'Uploading image...'
      });
      loading.present();

      Storage.put(this.username + '/avatar.jpeg', this.selectedPhoto, { contentType: 'image/jpeg' })
        .then(() => {


          this.globals.invokeLambda('updateAvatar',{"username":this.username})
          .then()
          .catch();

          var Payload = JSON.stringify({"username":this.username});
          var params = {
            FunctionName: 'updateAvatar', /* required */
            InvocationType: "RequestResponse",
            LogType: "None",
            Payload: Payload /* Strings will be Base-64 encoded on your behalf */,
          };
      this.lambda.invoke(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
          console.log(data);
            // var user = this.globals.getUser();
            this.user.avatarPath = this.username + '/avatar.jpeg';
            // this.globals.setUser(user);
            this.refreshAvatar()
            loading.dismiss();
        }
      });

        })
        .catch(err => {
          logger.error(err)
          loading.dismiss();
        });
    }
  }
}
