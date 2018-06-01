import {Injectable} from '@angular/core';
// import { NavController } from 'ionic-angular';
import { Auth } from 'aws-amplify';
// import AWS from 'aws-sdk';


@Injectable()
export class GlobalVars {
  public username:string;
  public lambda:any;
  public users:any;
  public user:any;
  constructor() {
  }

  // Authorize() {
  //   return Auth.currentCredentials()
  //   // .then(() => {
  //   //   Auth.currentAuthenticatedUser()
  //   //   .catch(err => console.log(err));
  //   // })
  //   .catch(err => this.navCtrl.setRoot('NewLoginPage'));
  // }

  invokeLambda(FunctionName,payload){
    var Payload = JSON.stringify(payload);
    var params = {
      FunctionName: FunctionName,
      InvocationType: "RequestResponse",
      LogType: "None",
      Payload: Payload,
    };
    return this.lambda.invoke(params).promise();
  }

setUser(user){
  this.user = user;
}
getUser(){
  return this.user;
}

getUserName(){
  return this.username;
}

setUserName(username){
  this.username = username;
}
  getLambda(){
     return this.lambda;
  }

  setLambda(lambda){
    this.lambda = lambda;
  }
  setUsers(users){
    this.users = users;
  }

  getUsers(){
    return this.users;
  }
}
