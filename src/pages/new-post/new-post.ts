import { Component } from '@angular/core';
import { NavParams, ViewController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from 'aws-amplify';
import * as $ from 'jquery';
// import { DynamoDB } from '../../providers/providers';
// import { DocumentClient } from 'aws-sdk/clients/dynamodb';
// import AWS from 'aws-sdk';


@Component({
  selector: 'page-newpost-create',
  templateUrl: 'new-post.html'
})
export class NewPostCreatePage {

  postID:any;
  imageFileName:any;
  post: any;
  username:string;
  selectedFile: File;
  private lambda:any;
  private userID:string;
  constructor(
    // public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
                this.post = {};
                this.postID = navParams.get('id');
                this.username = navParams.get('username');
                this.lambda = navParams.get('lambda');
                this.userID = navParams.get('userID')
  }
  cancel() {
    this.viewCtrl.dismiss();
  }

  getImage() {
$('#input').click();
}

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
  let loading = this.loadingCtrl.create({
    content: 'Uploading...'
  });
  loading.present();
  const file = this.selectedFile;
  if(file == null){
    return alert('No file selected.');
  }
  else
  {
    let name = this.postID+'/image.jpeg';
  const access = { level: "protected" }; // note the access path
  await Storage.put(name, file, access)
  .then (result => {


    var Payload = JSON.stringify({"username":this.username,"description":this.post.description,
    "postid":this.postID,"userID":this.userID});
    var params = {
      FunctionName: 'createNewPost', /* required */
      InvocationType: "RequestResponse",
      LogType: "None",
      Payload: Payload /* Strings will be Base-64 encoded on your behalf */,
    };
    var that = this;
    this.lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } // an error occurred
      else    {                           // successful response
      console.log(data);
    loading.dismiss();
    that.viewCtrl.dismiss(that.post);
    }
    });
  })
        .catch(err => {
          console.log(err);
          alert('Something went wrong cannot create post!');
          this.viewCtrl.dismiss();
        });
}
}
}
