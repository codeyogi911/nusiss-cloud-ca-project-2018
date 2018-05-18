import { Component } from '@angular/core';
import {ModalController} from 'ionic-angular';
import {NewPostCreatePage} from '../new-post/new-post';
import { Auth, Logger } from 'aws-amplify';
const aws_exports = require('../../aws-exports').default;
import { DynamoDB } from '../../providers/providers';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
const logger = new Logger('Tasks');
@Component({
  templateUrl: 'home.html'
})
export class Home {
  public items: any;
  public refresher: any;
  private taskTable: string = aws_exports.aws_resource_name_prefix + '-tasks';
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
  uploadphoto(){
    let id = this.generateId();
    let addModal = this.modalCtrl.create(NewPostCreatePage, { 'id': id });
    addModal.onDidDismiss(item => {
      if (!item) { return; }
      item.userId = this.userId;
      item.created = (new Date().getTime() / 1000);
      const params = {
        'TableName': this.taskTable,
        'Item': item,
        'ConditionExpression': 'attribute_not_exists(id)'
      };
      this.db.getDocumentClient()
      // .then(client => (client as DocumentClient).query(params).promise())
      .then(client => (client as DocumentClient).put(params).promise());
      // .then(client => (client as DocumentClient).delete(params).promise());
    });
    addModal.present();
  }
 }
