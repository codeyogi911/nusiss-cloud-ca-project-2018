import { Component, ViewChild } from '@angular/core';

import {ModalController} from 'ionic-angular';

import {NewPostCreatePage} from '../new-post/new-post';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Auth, Logger, Storage } from 'aws-amplify';
const aws_exports = require('../../aws-exports').default;
import { DynamoDB } from '../../providers/providers';
const logger = new Logger('Home');

// import { Component, ViewChild } from '';
import { updateImgs } from 'ionic-angular/components/content/content';
import { Img } from 'ionic-angular/components/img/img-interface';
import { Content } from 'ionic-angular';



import Amplify, { API } from 'aws-amplify';
Amplify.configure(aws_exports);

@Component({
  templateUrl: 'home.html'
})
export class Home{
  public items: any;
  public refresher: any;
  private userID: string;
  private posts: any;
  private username: string;
  private newPost:any;
  constructor(public modalCtrl: ModalController,public db: DynamoDB) {
    Auth.currentAuthenticatedUser()
    .then(AuthenticatedUser => {
      console.log(AuthenticatedUser);
      this.username = AuthenticatedUser.username;
      Auth.currentCredentials()
        .then(credentials => {
          this.userID = credentials.identityId;
          this.getPosts();
        })
        .catch(err => logger.debug('get current credentials err', err));
    });

      this.posts = [];
  }



  newpost() {
    let id = this.generateId();
    let addModal = this.modalCtrl.create(NewPostCreatePage, { 'id': id , 'username': this.username});
    addModal.onDidDismiss(post => {
      if (!post) { return; }
      this.refreshPosts();
// this.savePost(id, post.description);

});
    addModal.present();

}
refreshPosts(){
this.getPosts();
}
// async savePost(id, desc) {
//   // const posts = this.posts;
//   // const postid = id;
//   // const description = desc;
//   // const timestamp = new Date().getTime();
//   // this.newPost = {'username': this.username, postid, description, timestamp, 'likes':0};
//   const params = {
//         'TableName': 'nuscloudca-mobilehub-726174774-postdir',
//         'Item': this.newPost,
//         'ConditionExpression': 'attribute_not_exists(id)'
//       };
//   // await API.post('postDir1CRUD', '/postDir1', { body: this.newPost });
//   this.db.getDocumentClient()
//   .then(client => (client as DocumentClient).put(params).promise())
//   .then(data => this.refreshPosts())
//         .catch(err => console.log(err));
//
//   // this.getfromS3(this.newPost);
//   // this.newPost.postDate = this.formatDate(this.newPost.timestamp);
//   // this.newPost.TimeElapsed = this.getTimeElapsed(this.newPost.timestamp);
//   // posts.push(this.newPost);
//   // this.sortArray(posts);
//   // this.posts = posts;
// }

async getPosts() {
  let queryParams = {
    TableName: 'nuscloudca-mobilehub-726174774-postdir',
    KeyConditionExpression: "#username = :username",
    ExpressionAttributeNames:{
        "#username": "username"
    },
    ExpressionAttributeValues: {
        ":username":this.username
    }
  }

  this.db.getDocumentClient()
  .then(client => (client as DocumentClient).query(queryParams, (err, data) => {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");

    var that = this;
    data.Items.forEach(function(element){
    that.getfromS3(element);
    element.postDate = that.formatDate(element.timestamp);
    element.TimeElapsed = that.getTimeElapsed(element.timestamp);
  });
    this.posts = data.Items;
    this.sortArray(this.posts);
              }
  }));
}

getfromS3(post){
  Storage.get(this.username + '/avatar_thumb.jpg', { level: 'public' })
    .then(url => post.avatarPhoto = (url as string))
    .catch(err => console.log(err));;
  Storage.get(post.postid+'/image_thumb.jpg', { level: 'protected' })
    .then(result => {console.log(result);
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
@ViewChild(Content) _content: Content;
ngAfterViewInit() : void
   {
      if (this._content)
      {
         this._content.imgsUpdate = () =>
         {
            if (this._content._scroll.initialized && this._content._imgs.length && this._content.isImgsUpdatable())
            {
               // Reset cached bounds
               this._content._imgs.forEach((img: Img) => (<any>img)._rect = null);

               // Use global position to calculate if an img is in the viewable area
               updateImgs(this._content._imgs, this._content._cTop * -1, this._content.contentHeight, this._content.directionY, 1400, 400);
            }
         };
      }
   }





}
