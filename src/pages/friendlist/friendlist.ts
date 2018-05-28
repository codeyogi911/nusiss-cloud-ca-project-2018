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
    // this.globals.getUserName()
    // .then(username => this.username = username);
    this.lambda = this.globals.getLambda();

      this.populatelist();

    this.isToggled = false;
  }

  public notify() {
    // isToggled = !isToggled;
    console.log("Hello Toggled: "+ this.isToggled);
  }
  populatelist()
{
  let loading = this.loadingCtrl.create({
    content: 'Retrieving...'
  });
  loading.present();
  var Payload = JSON.stringify({'username':this.username});
  var params = {
    FunctionName: 'getUsers', /* required */
    InvocationType: "RequestResponse",
    LogType: "None",
    Payload: Payload /* Strings will be Base-64 encoded on your behalf */,
  };
  var that = this;
  this.lambda.invoke(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else    {                           // successful response
    console.log(data);
    that.users = JSON.parse(data.Payload);
    that.getfromS3(that.users);
    loading.dismiss();
  }
  });
}
getfromS3(users){
  let list = [];
  users.forEach(function(element){
    Storage.get(element.avatarPath, { level: 'public' })
      .then(url => {
        var item = <any>{};
        item.username = element.username;
        item.dp = (url as string);
        list.push(item);
      })
      .catch(err =>
        console.log(err)
      );
  });
  this.users = list;
}
}
