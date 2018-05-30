import { Component } from '@angular/core';
import { NavParams, ViewController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from 'aws-amplify';
import * as $ from 'jquery';
import { GlobalVars } from '../../providers/GlobalVars';


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
  private userID:string;
  constructor(
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
            public globals: GlobalVars) {
                this.post = {};
                this.postID = navParams.get('id');
                this.username = navParams.get('username');
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
    let name = this.username + '/' + this.postID + '/image.jpeg';
  const access = { level: "public" }; // note the access path
  await Storage.put(name, file, access)
  .then (result => {

    loading.setContent('Thinking...');

    this.globals.invokeLambda('createNewPost',
    {"username":this.username,"description":this.post.description,"postid":this.postID,"userID":this.userID})
    .then(data => {
      loading.dismiss();
      this.viewCtrl.dismiss(this.post);
    })
    .catch(err => console.log(err, err.stack));
  })
        .catch(err => {
          console.log(err);
          alert('Something went wrong cannot create post!');
          this.viewCtrl.dismiss();
        });
}
}
}
