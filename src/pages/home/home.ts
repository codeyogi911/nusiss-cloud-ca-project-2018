import { Component } from '@angular/core';

import {ModalController, LoadingController} from 'ionic-angular';

import {NewPostCreatePage} from '../new-post/new-post';
import { Auth, Logger, Storage } from 'aws-amplify';
// const aws_exports = require('../../aws-exports').default;
const logger = new Logger('Home');
// import { Content } from 'ionic-angular';

import AWS from 'aws-sdk';

@Component({
  templateUrl: 'home.html'
})
export class Home{

  // private userID: string;
  private posts: any;
  private username: string;
  private lambda:any;
  constructor(public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
    Auth.currentAuthenticatedUser()
    .then(AuthenticatedUser => {
      console.log(AuthenticatedUser);
      this.username = AuthenticatedUser.username;
      Auth.currentCredentials()
        .then(credentials => {
          this.lambda = new AWS.Lambda({credentials: credentials, apiVersion: '2015-03-31'});
          // this.userID = credentials.identityId;
          this.getPosts();
        })
        .catch(err => logger.debug('get current credentials err', err));
    });
  }



  newpost() {
    let id = this.generateId();
    let addModal = this.modalCtrl.create(NewPostCreatePage, { 'id': id , 'username': this.username});
    addModal.onDidDismiss(post => {
      if (!post) { return; }
      this.refreshPosts();
});
    addModal.present();

}
refreshPosts(){
this.getPosts();
}

getPosts() {
  let loading = this.loadingCtrl.create({
    content: 'Downloading love...'
  });
  loading.present();
  var Payload = JSON.stringify({"username":this.username});
  var params = {
    FunctionName: 'getPosts2Display', /* required */
    InvocationType: "RequestResponse",
    LogType: "None",
    Payload: Payload /* Strings will be Base-64 encoded on your behalf */,
  };
  var that = this;
  this.lambda.invoke(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else    {                           // successful response
    // console.log(data);
    that.posts = JSON.parse(data.Payload);

    that.posts.forEach(function(element){
    that.getfromS3(element);
    element.postDate = that.formatDate(element.timestamp);
    element.TimeElapsed = that.getTimeElapsed(element.timestamp);
  });
  that.sortArray(that.posts);
  loading.dismiss();
  }
  });
}

getfromS3(post){
  Storage.get(post.username + '/avatar_thumb.jpg', { level: 'public' })
    .then(url => post.avatarPhoto = (url as string))
    .catch(err => console.log(err));;
  Storage.get(post.postid+'/image_thumb.jpg', { level: 'protected' })
    .then(result => {
      // console.log(result);
      post.image = result;
  })
    .catch(err => console.log(err));
}

sortArray(inArray){
  inArray.sort(function compare(a,b) {
  if (a.timestamp > b.timestamp)
  return -1;
  if (a.timestamp < b.timestamp)
  return 1;
  return 0;
  });
}

formatDate(date){
  var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};
  var formattedDate = new Date(date);
  return formattedDate.toLocaleTimeString("en-us", options);
}

getTimeElapsed(date){
  // Set the unit values in milliseconds.
var msecPerMinute = 1000 * 60;
var msecPerHour = msecPerMinute * 60;
var msecPerDay = msecPerHour * 24;
var dateMsec = new Date().getTime();
var interval = dateMsec - date;

// Calculate how many days the interval contains. Subtract that
// many days from the interval to determine the remainder.
var days = Math.floor(interval / msecPerDay );
interval = interval - (days * msecPerDay );

// Calculate the hours, minutes, and seconds.
var hours = Math.floor(interval / msecPerHour );
interval = interval - (hours * msecPerHour );

var minutes = Math.floor(interval / msecPerMinute );
interval = interval - (minutes * msecPerMinute );

var seconds = Math.floor(interval / 1000 );

// Display the result.
if (days > 0){ return (days + " days ago")}
else if (hours > 0){ return (hours + "h ago")}
else if (minutes > 0){return (minutes + "min ago")}
else if (seconds > 0){return (seconds + "sec ago")}
else {return "just now"}
}

generateId() {
  var len = 16;
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charLength = chars.length;
  var result = "";
  let randoms = window.crypto.getRandomValues(new Uint32Array(len));
  for(var i = 0; i < len; i++) {
    result += chars[randoms[i] % charLength];
  }
  return result.toLowerCase();
}
}
