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
  constructor(public modalCtrl: ModalController,public db: DynamoDB) {
    Auth.currentAuthenticatedUser()
    .then(AuthenticatedUser => {
      console.log(AuthenticatedUser);
      this.username = AuthenticatedUser.username;
    });
    Auth.currentCredentials()
      .then(credentials => {
        this.userID = credentials.identityId;
        this.getPosts();
      })
      .catch(err => logger.debug('get current credentials err', err));
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
  const userID = this.username;
  const postID = id;
  const desc = description;
  const timestamp = (new Date().getTime() / 1000);
  const newPost = {userID, postID, desc, timestamp};
  await API.post('postDir1CRUD', '/postDir1', { body: newPost });
  posts.push(newPost);
  // this.refs.newTodo.value = '';
  this.posts = posts;
  // this.setState({ posts, userID });
}

async getPosts() {
  // this.db.getDocumentClient()
  // .then(client => (client as DocumentClient).scan({ TableName: 'nusisscloudca-mobilehub-1796201548-postDir1' }, function(err, data) {
  //       if (err) {
  //           console.log(err)
  //           res.status(500).json({
  //               message: "Could not load restaurants"
  //           }).end()
  //       } else {
  //           res.json(data['Items'])
  //       }
  //   }));

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

//       var i;
// for (i = 0; i < data.Items.length; i++) {
    // text += cars[i] + "<br>";
    var that = this;
    data.Items.forEach(function(element){
    that.getfromS3(element);
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

getfromS3(post){
  // var i;
  // for (i = 0; i < this.posts.length; i++){
  Storage.get(post.postID+'/image.jpeg', { level: 'protected' })
    .then(result => {console.log(result);
      post.image = result;
    return result;
  })
    .catch(err => console.log(err));
// }
}

}
