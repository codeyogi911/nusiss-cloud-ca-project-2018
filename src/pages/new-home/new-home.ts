import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, App } from 'ionic-angular';
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
  private users:any;
  public loading:any;
  public items:any;
  private NoPostText:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              public globals: GlobalVars, public app: App) {
  }

  doRefresh(refresher) {

      console.log('Begin async operation', refresher);
      setTimeout(() => {
        console.log('Async operation has ended');
        this.refreshPosts();
        refresher.complete();
      }, 2000);
    }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      if (this.posts.length > 10){
      this.items = this.items.concat(this.processPosts(this.posts.splice(0,10)));
      // this.processPosts();
    }
      else
      {
      this.items = this.items.concat(this.processPosts(this.posts.splice(0,this.posts.length)));
      // this.processPosts();
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
    this.globals.invokeLambda('likeUpdateFunc',{"username":this.username,"postid":post.postid,"timestamp":post.timestamp,"isLiked":!inis})
    .then(data => {
      console.log(data);
      if (data.Payload == '200')
      post.isLiked = !inis;
      else{
        post.isLiked = inis;
        post.likecount = inic;
      }
    })
    .catch(err => {
      console.log(err, err.stack);
      post.isLiked = inis;
      post.likecount = inic;
    });
  }

  newpost() {
      let id = this.generateId();
      let addModal = this.modalCtrl.create(NewPostCreatePage, {'userID':this.userID,'id':id,'username': this.username});
      addModal.onDidDismiss(post => {
        if (!post) { return; }
        this.refreshPosts();
  });
      addModal.present();
  }

  refreshPosts(){
    this.items = [];
  this.getPosts();
  }

  getPosts() {
    this.loading = this.loadingCtrl.create({
      content: 'Cooking your posts...'
    });
    this.loading.present();
    this.globals.invokeLambda('getPosts2Display',{"username":this.username})
    .then(data => {
        this.posts = JSON.parse(data.Payload);
        if (this.posts.length < 1){
          this.loading.dismiss();
          this.NoPostText = true;   
        }
        else
        {
          this.NoPostText = false;
        this.globals.invokeLambda('getUsers',{})
        .then(data => {
              this.users = JSON.parse(data.Payload);
              this.globals.setUsers(this.users);
              if (this.posts.length > 10)
                this.items = this.items.concat(this.processPosts(this.posts.splice(0,10)));
              else
                this.items = this.items.concat(this.processPosts(this.posts.splice(0,this.posts.length)));
              this.loading.dismiss();
        })
        .catch(err => console.log(err, err.stack));
      }
    })
    .catch(err => console.log(err, err.stack));
  }

  processPosts(inArray){
    var that = this;
    inArray.forEach(function(element){
    that.getfromS3(element);
    element.postDate = that.formatDate(element.timestamp);
    element.TimeElapsed = that.getTimeElapsed(element.timestamp);
  });
  return inArray;
  }

  getfromS3(post){
    post.isLiked = post.likeusers.includes(this.username);
    var user = this.users.find(function(user){
      return user.username == post.username;
    });
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
  ionViewWillEnter() {
    Auth.currentCredentials()
    .then(credentials => {
      Auth.currentAuthenticatedUser()
      .then(AuthenticatedUser => {
      this.username = AuthenticatedUser.username;
      this.globals.setUserName(AuthenticatedUser.username);
      this.getPosts();
    });
    this.userID = credentials.identityId;
    this.globals.setLambda(new AWS.Lambda({credentials: credentials, apiVersion: '2015-03-31'}));
  })
  .catch(err => this.app.getRootNav().setRoot('NewLoginPage'));
  this.items = [];
  }
}
