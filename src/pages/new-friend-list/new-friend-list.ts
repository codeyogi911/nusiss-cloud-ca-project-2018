import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from 'aws-amplify';
import { GlobalVars } from '../../providers/GlobalVars';


@IonicPage()
@Component({
  selector: 'page-new-friend-list',
  templateUrl: 'new-friend-list.html',
})
export class NewFriendListPage {
  private users:any;
  private username:string;
  private lambda:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public loadingCtrl: LoadingController, public globals: GlobalVars) {
    this.username = this.globals.getUserName();
    this.lambda = this.globals.getLambda();
    this.populatelist();
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
    // var that = this;
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
    this.users = this.globals.getUsers();
    var that = this;
    var following = this.users.find(function(user){
      return user.username == that.username;
    }).following;

    var removeIndex = this.users.map(function(item) { return item.username; }).indexOf(that.username);
    this.users.splice(removeIndex, 1);

    this.getfromS3(this.users,following);
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


  ionViewDidLoad() {
    console.log('ionViewDidLoad NewFriendListPage');
  }

}
