import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { Auth, Storage } from 'aws-amplify';
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
  private users_copy:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public loadingCtrl: LoadingController, public globals: GlobalVars, public app: App) {

  }

  getItems(event)  {
    // set val to the value of the searchbar
    let val = event.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.users = this.users_copy;
      this.users = this.users.filter((item) => {
        return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else{
      this.users = this.users_copy;
      return this.users;
    }
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
    this.loading = this.loadingCtrl.create({
      content: 'Retrieving...'
    });
    this.loading.present();
    this.globals.invokeLambda('getUsers',{})
    .then(data => {
          this.users = JSON.parse(data.Payload);
          // this.globals.setUsers(this.users);
    // this.users = this.globals.getUsers();
    var that = this;
    var following = this.users.find(function(user){
      return user.username == that.username;
    }).following;

    var removeIndex = this.users.map(function(item) { return item.username; }).indexOf(that.username);
    this.users.splice(removeIndex, 1);

    this.getfromS3(this.users,following);
    this.users_copy = this.users;
    this.loading.dismiss();
    });
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


  ionViewWillEnter() {
    Auth.currentCredentials()
    .then(() => {
      this.username = this.globals.getUserName();
      this.lambda = this.globals.getLambda();
      this.populatelist();
    })
  .catch(err => this.app.getRootNav().setRoot('NewLoginPage'));
  }

}
