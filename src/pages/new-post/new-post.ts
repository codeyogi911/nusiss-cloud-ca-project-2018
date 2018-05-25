import { Component } from '@angular/core';
import { NavParams, ViewController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from 'aws-amplify';
import * as $ from 'jquery';
import { DynamoDB } from '../../providers/providers';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

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

  constructor(
    // public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
            public db: DynamoDB) {
                this.post = {};
                this.postID = navParams.get('id');
                this.username = navParams.get('username');
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

    let newPost = {
      'username': this.username,
      'postid':this.postID,
      'description':this.post.description,
      'timestamp': new Date().getTime(),
      'likecount':0,
      'likeusers':[],
  };

    const params = {
          'TableName': 'posts',
          'Item': newPost,
          'ConditionExpression': 'attribute_not_exists(postname)'
        };

        this.db.getDocumentClient()
        .then(client => (client as DocumentClient).put(params).promise())
        .then(data => {

          var that = this;
          setTimeout(function() {
  loading.dismiss();
that.viewCtrl.dismiss(that.post);
}, 2000);

      })
        .catch(err => console.log(err));
  })
        .catch(err => {
          console.log(err);
          alert('Something went wrong cannot create post!');
          this.viewCtrl.dismiss();
        });
}
}
}
