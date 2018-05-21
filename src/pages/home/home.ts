import { Component } from '@angular/core';

import {ModalController} from 'ionic-angular';

import {NewPostCreatePage} from '../new-post/new-post';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Auth, Logger, Storage } from 'aws-amplify';
const aws_exports = require('../../aws-exports').default;
import { DynamoDB } from '../../providers/providers';
const logger = new Logger('Home');

import Amplify, { API } from 'aws-amplify';
Amplify.configure(aws_exports);

@Component({
  templateUrl: 'home.html'
})
export class Home{
// state = { userID: "", posts: [] };
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

  newpost() {
    var docClient = this.db.getDocumentClient();
    var table = "postDir1";
    let id = this.generateId();
    let addModal = this.modalCtrl.create(NewPostCreatePage, { 'id': id , 'username': this.username});
    addModal.onDidDismiss(post => {
      if (!post) { return; }
this.savePost(id, post.description);
  //       var params = {
  //         TableName:table,
  //         Item:{
  //         "userID": this.state.userID,
  //         "description": post.description,
  //         "postID": id,
  //         "timestamp": (new Date().getTime() / 1000)
  //       }
  // };
  //   console.log("Adding a new item...");
  //   console.log(this.db.list-tables);
  //   this.db.getDocumentClient()
  //   .then(client => (client as DocumentClient).put(params).promise())
  //       .then(data => this.refreshTasks())
  //       .catch(err => logger.debug('add task error', err));
//     .then(client => (client as DocumentClient).put(params, function(err, data) {
//     if (err) {
//         console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Added item:", JSON.stringify(data, null, 2));
//     }
// }));
});
    addModal.present();

}

async savePost(id, description) {
  // event.preventDefault();

  // const { userID, posts } = this.state;
  const posts = this.posts;
  // const userID = this.username;
  const postID = id;
  const desc = description;
  const timestamp = new Date().getTime();
  this.newPost = {'userID': this.username, postID, desc, timestamp};
  await API.post('postDir1CRUD', '/postDir1', { body: this.newPost });
  this.newPost.image = this.getfromS3(this.newPost);
  this.newPost.postDate = this.formatDate(this.newPost.timestamp);
  this.newPost.TimeElapsed = this.getTimeElapsed(this.newPost.timestamp);
  this.newPost.avatarPhoto = this.getAvatar(this.userID);
  posts.push(this.newPost);
  // this.refs.newTodo.value = '';
  this.posts = posts;
  // this.setState({ posts, userID });
}

async getPosts() {
  let queryParams = {
    TableName: 'nusisscloudca-mobilehub-1796201548-postDir1',
    KeyConditionExpression: "#userID = :userID",
    ExpressionAttributeNames:{
        "#userID": "userID"
    },
    ExpressionAttributeValues: {
        ":userID":this.username
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
    // that.getAvatar(element);
    // var t = that.getAvatar(that.userID);
  });
    this.posts = data.Items;
    // this.getfromS3();
// }

              // data.Items.forEach(function(item) {
              //     console.log(" -", item.year + ": " + item.title);
              // });
                }
  }));

  // let posts = await API.get('postDir1CRUD', `/nusisscloudca-mobilehub-1796201548-postDir1/${this.userID}`);
  // this.posts =posts;
  // this.setState({ posts });
}
getAvatar(id){
  Storage.get(id + '/avatar.jpeg', { level: 'public' })
    // .then(url => this.avatarPhoto = (url as string));
    .then(url => {
    console.log('avatarPhoto ' + url as string);
    var ret = (url as string);
    // return ret;
  });
}

getfromS3(post){
  Storage.get(this.userID + '/avatar.jpeg', { level: 'public' })
    .then(url => post.avatarPhoto = (url as string));
    // .then(url => {
    // console.log('avatarPhoto ' + url as string);
    // var ret = (url as string);
    // return ret;
  // });
  Storage.get(post.postID+'/image.jpeg', { level: 'protected' })
    .then(result => {console.log(result);
      post.image = result;
    return result;
  })
    .catch(err => console.log(err));
// }
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

// Set a date and get the milliseconds
// var date = new Date('6/15/1990');
var dateMsec = new Date().getTime();

// // Set the date to January 1, at midnight, of the specified year.
// date.setMonth(0);
// date.setDate(1);
// date.setHours(0, 0, 0, 0);

// Get the difference in milliseconds.
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
// return(days + " days ago" + hours + " hours, " + minutes + " minutes, " + seconds + " seconds.");

//Output: 164 days, 23 hours, 0 minutes, 0 seconds.

}
}
