import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, LoadingController, ToastController } from 'ionic-angular';


// import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

// import { Platform } from 'ionic-angular/platform/platform';


@Component({
  selector: 'page-newpost-create',
  templateUrl: 'new-post.html'
})
export class NewPostCreatePage {
  imageURI:any;
  imageFileName:any;

  isReadyToSave: boolean;

  item: any;

  isAndroid: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public platform: Platform,
  private transfer: FileTransfer,
  private camera: Camera,
  public loadingCtrl: LoadingController,
  public toastCtrl: ToastController) {
    this.isAndroid = platform.is('android');
    this.item = {
      'taskId': navParams.get('id'),
      'category': 'Todo'
    };
    this.isReadyToSave = true;
  }

  ionViewDidLoad() {

  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    this.viewCtrl.dismiss(this.item);
  }


  getImage() {
    if (this.platform.is('cordova')) {
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  }

  this.camera.getPicture(options).then((imageData) => {
    this.imageURI = imageData;
  }, (err) => {
    console.log(err);
    this.presentToast(err);
  });
}
else {

}
}

presentToast(msg) {
  let toast = this.toastCtrl.create({
    message: msg,
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

uploadFile() {
  let loader = this.loadingCtrl.create({
    content: "Uploading..."
  });
  loader.present();
  const fileTransfer: FileTransferObject = this.transfer.create();

  let options: FileUploadOptions = {
    fileKey: 'ionicfile',
    fileName: 'ionicfile',
    chunkedMode: false,
    mimeType: "image/jpeg",
    headers: {}
  }

  fileTransfer.upload(this.imageURI, 'http://192.168.0.7:8080/api/uploadImage', options)
    .then((data) => {
    console.log(data+" Uploaded Successfully");
    this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
    loader.dismiss();
    this.presentToast("Image uploaded successfully");
  }, (err) => {
    console.log(err);
    loader.dismiss();
    this.presentToast(err);
  });
}
}
