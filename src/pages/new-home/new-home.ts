import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { NewPostCreatePage } from '../new-post/new-post';
import { Auth, Storage } from 'aws-amplify';
import { GlobalVars } from '../../providers/GlobalVars';
import AWS from 'aws-sdk';


@IonicPage()
@Component({
  selector: 'page-new-home',
  templateUrl: 'new-home.html',
})
export class NewHomePage {
  private userID: string;
  private posts: any;
  private username: string;
  private lambda:any;
  private users:any;
  public loading:any;
  public items:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              public globals: GlobalVars) {

      this.loading = this.loadingCtrl.create({
        content: 'Cooking your posts...'
      });
      this.loading.present();
Auth.currentAuthenticatedUser()
.then(AuthenticatedUser => {
this.username = AuthenticatedUser.username;
this.globals.setUserName(AuthenticatedUser.username);

Auth.currentCredentials()
.then(credentials => {
this.userID = credentials.identityId;
this.lambda = new AWS.Lambda({credentials: credentials, apiVersion: '2015-03-31'});
this.globals.setLambda(this.lambda);
this.refreshPosts();
}
)
.catch(err => console.log(err));
})
.catch(err => console.log(err));
this.items = [];
  }


  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      if (this.posts.length > 10){
      this.items = this.items.concat(this.posts.splice(0,10));
      this.processPosts();
    }
      else
      {
      this.items = this.items.concat(this.posts.splice(0,this.posts.length));
      this.processPosts();
}
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  likePost(post){
    var inis = post.isLiked;
    var inic = post.likecount;
    post.isLiked = !post.isLiked;
    if (!inis)
    post.likecount++;
    else
    post.likecount--;
    var Payload = JSON.stringify({"username":this.username,"postid":post.postid,"timestamp":post.timestamp,"isLiked":!inis});
    var params = {
      FunctionName: 'likeUpdateFunc', /* required */
      InvocationType: "RequestResponse",
      LogType: "None",
      Payload: Payload /* Strings will be Base-64 encoded on your behalf */,
    };
    // var that = this;
    this.lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        post.isLiked = inis;
        post.likecount = inic;
      } // an error occurred
      else    {
      console.log(data);
      if (data.Payload == '200')
      post.isLiked = !inis;
      else{
        post.isLiked = inis;
        post.likecount = inic;
      }

      }                        // successful response
  });
  }

    newpost() {
      let id = this.generateId();
      let addModal = this.modalCtrl.create(NewPostCreatePage, {'userID':this.userID,'id':id,'username': this.username,'lambda':this.lambda});
      addModal.onDidDismiss(post => {
        if (!post) { return; }
        this.refreshPosts();
  });
      addModal.present();

  }
  refreshPosts(){
  this.getPosts();
  }

  getPosts() {
    var Payload = JSON.stringify({"username":this.username});
    var params = {
      FunctionName: 'getPosts2Display', /* required */
      InvocationType: "RequestResponse",
      LogType: "None",
      Payload: Payload /* Strings will be Base-64 encoded on your behalf */,
    };
    var that = this;
    this.lambda.invoke(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else    {                           // successful response
      // console.log(data);
      that.posts = JSON.parse(data.Payload);
      that.sortArray(that.posts);

      if (that.posts.length > 10)
      that.items = that.items.concat(that.posts.splice(0,10));
      else
      that.items = that.items.concat(that.posts.splice(0,that.posts.length));

      var Payload = JSON.stringify({});
      var params = {
        FunctionName: 'getUsers', /* required */
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: Payload /* Strings will be Base-64 encoded on your behalf */,
      };
      // var that = this;
      that.lambda.invoke(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else    {                           // successful response
        // console.log(data);
        that.users = JSON.parse(data.Payload);
        that.globals.setUsers(that.users);
        that.processPosts();
      //   that.items.forEach(function(element){
      //   that.getfromS3(element);
      //   element.postDate = that.formatDate(element.timestamp);
      //   element.TimeElapsed = that.getTimeElapsed(element.timestamp);
      // });


      that.loading.dismiss();
      }
      });
    }
    });
  }

  processPosts(){
    var that = this;
    this.items.forEach(function(element){
    that.getfromS3(element);
    element.postDate = that.formatDate(element.timestamp);
    element.TimeElapsed = that.getTimeElapsed(element.timestamp);
  });
  }

  getfromS3(post){
    post.isLiked = post.likeusers.includes(this.username);
    var user = this.users.find(function(user){
      return user.username == post.username;
    });
    this.globals.setUser(user);
    Storage.get(user.avatarPath, { level: 'public' })
      .then(url => post.avatarPhoto = (url as string))
      .catch(err => console.log(err));

    Storage.get(post.username + '/' + post.postid+'/image_thumb.jpg', {level:'public'})
      .then(result => {
        // console.log(result);
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
  if (days > 0){ return (days + " DAYS AGO")}
  else if (hours > 0){ return (hours + " HOURS AGO")}
  else if (minutes > 0){return (minutes + " MINUTES AGO")}
  else if (seconds > 0){return (seconds + " SECONDS AGO")}
  else {return "JUST NOW"}
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



  ionViewDidLoad() {
    console.log('ionViewDidLoad NewHomePage');
  }

}
