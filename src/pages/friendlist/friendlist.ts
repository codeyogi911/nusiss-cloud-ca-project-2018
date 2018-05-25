import { Component } from '@angular/core';
// import {AWS} from 'aws-sdk';
import { Auth } from 'aws-amplify';
import { DynamoDB } from '../../providers/providers';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Storage } from 'aws-amplify';
// import Amplify, {Auth,Logger,API} from 'aws-amplify';
// const logger = new Logger('friendlist');
// import aws_exports from '../../aws-exports';
// Amplify.configure(aws_exports);
// import { DocumentClient } from 'aws-sdk/clients/dynamodb';
// import { DynamoDB } from '../../providers/providers';
@Component({
  templateUrl: 'friendlist.html'
})
export class friendlistPage {
private isToggled:boolean;
private friends:any;
private defaultavatar:string;
private username:string;
  constructor(public db: DynamoDB) {
    Storage.get('defaultdp' + '/generic-user-purple.png', { level: 'public' })
      .then(url => this.defaultavatar = (url as string))
      .catch(err => console.log(err));
      Auth.currentAuthenticatedUser()
      .then(AuthenticatedUser => {
        console.log(AuthenticatedUser);
        this.username = AuthenticatedUser.username;});
    this.populatelist();
    this.isToggled = false;
  }
  public notify() {
    // isToggled = !isToggled;
    console.log("Hello Toggled: "+ this.isToggled);
  }
  populatelist()
{
  var that = this;
  this.db.getDocumentClient().
  then(client => (client as DocumentClient).scan({TableName: "nuscloudca-mobilehub-726174774-postdir"}).promise()).
  then(data => {
    console.log(data);
    var list = data.Items;
    var grouped = that.groupBy(list, list => list.username);
    // console.log(grouped);
    this.friends = Array.from( grouped.keys() );
    this.friends.splice(this.friends.indexOf(this.username),1);
    this.getfromS3(this.friends);
  }).
  catch(err => console.log(err));

}
getfromS3(friends){
  let list = [];
  friends.forEach(function(element){
    Storage.get(element + '/avatar_thumb.jpg', { level: 'public' })
      .then(url => {
        var item = <any>{};
        item.username = element;
        item.dp = (url as string);
        list.push(item);
      })
      .catch(err =>
        console.log(err)
      );
  });
  this.friends = list;
}
 groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}
}
