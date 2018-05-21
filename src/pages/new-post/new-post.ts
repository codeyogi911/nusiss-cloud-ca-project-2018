import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, LoadingController, ToastController } from 'ionic-angular';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from 'aws-amplify';
import * as $ from 'jquery';

@Component({
  selector: 'page-newpost-create',
  templateUrl: 'new-post.html'
})
export class NewPostCreatePage {
  // imageURI:any;

  postID:any;
  imageFileName:any;

  // isReadyToSave: boolean;

  post: any;

  // isAndroid: boolean;

  selectedFile: File;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public platform: Platform,
              // private transfer: FileTransfer,
              // private camera: Camera,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
                this.post = {};
                this.postID = navParams.get('id');
    // this.isAndroid = platform.is('android');


    // if (!platform.is('cordova')){
    //   (() => {
    //     document.getElementById('input').onchange = this.uploadFile();
    // })();
    // }
  }

  // function initUpload(){
  //     const files = document.getElementById('file-input').files;
  //     const file = files[0];
  //     if(file == null){
  //       return alert('No file selected.');
  //     }
  //     // getSignedRequest(file);
  //   }


  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    this.viewCtrl.dismiss(this.post);
  }


  getImage() {
  //   if (this.platform.is('cordova')) {
  // const options: CameraOptions = {
  //   quality: 100,
  //   destinationType: this.camera.DestinationType.FILE_URI,
  //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  // }
  //
  // this.camera.getPicture(options).then((imageData) => {
  //   this.imageURI = imageData;
  // }, (err) => {
  //   console.log(err);
  //   this.presentToast(err);
  // });
// }
// else {
$('#input').click();
// }
}

// presentToast(msg) {
//   let toast = this.toastCtrl.create({
//     message: msg,
//     duration: 3000,
//     position: 'bottom'
//   });
//
//   toast.onDidDismiss(() => {
//     console.log('Dismissed toast');
//   });
//
//   toast.present();
// }

previewfile(event){
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    this.selectedFile = event.target.files[0];
    reader.onload = (event:any) => {
      this.imageFileName = event.target.result;
    }

    reader.readAsDataURL(event.target.files[0]);
  }
}

async uploadFile() {
  const file = this.selectedFile;
  if(file == null){
    return alert('No file selected.');
  }
  else
  {
    let name = this.postID+'/image.jpeg';
  const access = { level: "protected" }; // note the access path
  Storage.put(name, file, access)
  .then (result => {
    this.post.isReadyToSave = true;
    this.viewCtrl.dismiss(this.post);
    console.log(result);
  })
        .catch(err => {
          console.log(err);
          alert('Something went wrong cannot create post!')
        });
  // this.isReadyToSave = true;

}
}

// uploadFile() {
//   let loader = this.loadingCtrl.create({
//     content: "Uploading..."
//   });
//   loader.present();
//   const fileTransfer: FileTransferObject = this.transfer.create();
//
//   let options: FileUploadOptions = {
//     fileKey: 'ionicfile',
//     fileName: 'ionicfile',
//     chunkedMode: false,
//     mimeType: "image/jpeg",
//     headers: {}
//   }
//
//   fileTransfer.upload(this.imageURI, 'http://192.168.0.7:8080/api/uploadImage', options)
//     .then((data) => {
//     console.log(data+" Uploaded Successfully");
//     this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
//     loader.dismiss();
//     this.presentToast("Image uploaded successfully");
//   }, (err) => {
//     console.log(err);
//     loader.dismiss();
//     this.presentToast(err);
//   });
// }
}
