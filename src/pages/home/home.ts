import { Component } from '@angular/core';

import {ModalController} from 'ionic-angular';

import {NewPostCreatePage} from '../new-post/new-post';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Auth, Logger } from 'aws-amplify';
const aws_exports = require('../../aws-exports').default;
import { DynamoDB } from '../../providers/providers';
const logger = new Logger('Home');

import Amplify, { API } from 'aws-amplify';
Amplify.configure(aws_exports);

@Component({
  templateUrl: 'home.html'
})
export class Home {

  public items: any;
  public refresher: any;
  private userId: string;

  constructor(public modalCtrl: ModalController,public db: DynamoDB) {
    Auth.currentCredentials()
      .then(credentials => {
        this.userId = credentials.identityId;
        // this.refreshTasks();
      })
      .catch(err => logger.debug('get current credentials err', err));
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
    let addModal = this.modalCtrl.create(NewPostCreatePage, { 'id': id });
    addModal.onDidDismiss(post => {
      if (!post) { return; }

        var params = {
          TableName:table,
          Item:{
          "userID": this.userId,
          "description": post.description,
          "postID": id,
          "timestamp": (new Date().getTime() / 1000)
        }
  };
    console.log("Adding a new item...");
    this.db.getDocumentClient()
    .then(client => (client as DocumentClient).put(params).promise())
        .then(data => this.refreshTasks())
        .catch(err => logger.debug('add task error', err));
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
}
