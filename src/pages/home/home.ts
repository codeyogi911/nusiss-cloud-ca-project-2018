import { Component } from '@angular/core';
import {ModalController} from 'ionic-angular';
import {NewPostCreatePage} from '../new-post/new-post';
import { Auth, Logger } from 'aws-amplify';
const aws_exports = require('../../aws-exports').default;
import { DynamoDB } from '../../providers/providers';
const logger = new Logger('Tasks');

import Amplify, { API } from 'aws-amplify';
Amplify.configure(aws_exports);

@Component({
  templateUrl: 'home.html'
})
export class Home {
//   state = {
//   apiResponse: null,
//   noteId: ''
//      };
//
//   handleChangeNoteId = (event) => {
//         this.setState({noteId: event});
// }
  public items: any;
  public refresher: any;
  // private taskTable: string = aws_exports.aws_resource_name_prefix + '-tasks';
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
    let id = this.generateId();
    let addModal = this.modalCtrl.create(NewPostCreatePage, { 'id': id });
    addModal.onDidDismiss(post => {
      if (!post) { return; }
      let newPost = {
        body: {
    "userID": this.userId,
    "imagePath": id +'/image.jpeg',
    "description": post.description,
    "postID": id,
    "timestamp": (new Date().getTime() / 1000)
  }
      }
      const path = "/postdir";
      if(post.isReadyToSave){
        try {
        const apiResponse = API.put("postdirCRUD", path, newPost)
        console.log("response from saving note: " + apiResponse);
        // this.setState({apiResponse});
      } catch (e) {
        console.log(e);
      }}

    });
    addModal.present();


    // Use the API module to save the note to the database

  }
 }
