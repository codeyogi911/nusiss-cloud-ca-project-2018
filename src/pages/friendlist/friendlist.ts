import { Component } from '@angular/core';
import { Storage } from 'aws-amplify';
import { LoadingController } from 'ionic-angular';
import { GlobalVars } from '../../providers/GlobalVars';

@Component({
  templateUrl: 'friendlist.html'
})
export class friendlistPage {
  private isToggled:boolean;
  private users:any;
  private username:string;
  private lambda:any;
  constructor(public loadingCtrl: LoadingController, public globals: GlobalVars) {
    this.username = this.globals.getUserName();
    this.lambda = this.globals.getLambda();
    this.populatelist();
    // this.isToggled = false;
  }

  public notify(event,followUser) {
    var data;
    if(event.checked == true)
    {
        data = JSON.stringify({
        username: this.username,
        friend: followUser,
        follow: 1
      });
    }
    else
    {
      data = JSON.stringify({
      username: this.username,
      friend: followUser,
      follow: 0
      });
    }

    var params = {
      FunctionName: 'myFollowFriend', /* required */
      InvocationType: "RequestResponse",
      LogType: "None",
      Payload: data /* Strings will be Base-64 encoded on your behalf */,
    };

    // console.log(this.isToggled)
    var that = this;
    this.lambda.invoke(params, function(err, data) {
      if (err)
        {
          console.log(err, err.stack); // an error occurred
        }
      else
        console.log(data);

      });
  }
  populatelist()
  {
    // let loading = this.loadingCtrl.create({
    //   content: 'Retrieving...'
    // });
    // loading.present();
    // this.users = this.globals.getUsers();
    this.users = this.globals.getUsers();
    var that = this;
    var following = this.users.find(function(user){
      return user.username == that.username;
    }).following;

    var removeIndex = this.users.map(function(item) { return item.username; }).indexOf(that.username);
    this.users.splice(removeIndex, 1);

    this.getfromS3(this.users,following);
  //   var Payload = JSON.stringify({});
  //   var params = {
  //     FunctionName: 'getUsers', /* required */
  //     InvocationType: "RequestResponse",
  //     LogType: "None",
  //     Payload: Payload /* Strings will be Base-64 encoded on your behalf */,
  //   };
  //   var that = this;
  //   this.lambda.invoke(params, function(err, data) {
  //     if (err) console.log(err, err.stack); // an error occurred
  //     else    {                           // successful response
  //     console.log(data);
  //     that.users = JSON.parse(data.Payload);
  //     that.getfromS3(that.users);
  //     loading.dismiss();
  //   }
  // });
}
getfromS3(users,following){
  let list = [];
  users.forEach(function(element){
    Storage.get(element.avatarPath, { level: 'public' })
    .then(url => {
      var item = <any>{};
      item.username = element.username;
      item.dp = (url as string);
      if (following.indexOf(element.username) > -1) {
        item.isToggled = true;
      } else {
        item.isToggled = false;
      }
      list.push(item);
    })
    .catch(err =>
      console.log(err)
    );
  });
  this.users = list;
}
}
