import {Injectable} from '@angular/core';
import { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';


@Injectable()
export class GlobalVars {
  public username:string;
  public lambda:any;
  public users:any;
  constructor() {
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
