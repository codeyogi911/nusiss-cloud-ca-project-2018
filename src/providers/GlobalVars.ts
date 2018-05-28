import {Injectable} from '@angular/core';
import { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';


@Injectable()
export class GlobalVars {
  public username:string;
  public lambda:any;

  constructor() {
    // this.myGlobalVar = "";
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

  setMyGlobalVar(value) {
    this.myGlobalVar = value;
  }

  getMyGlobalVar() {
    return this.myGlobalVar;
  }

}
