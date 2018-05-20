import { Component } from '@angular/core';
import Amplify, {Auth,Logger,API} from 'aws-amplify';
const logger = new Logger('Profile');
import aws_exports from '../../aws-exports';
Amplify.configure(aws_exports);
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DynamoDB } from '../../providers/providers';
@Component({
  templateUrl: 'profile.html'
})
export class ProfilePage {
  private postTable:string;
private userId: string;
// state = {
// apiResponse: null,
// postID: '5ippfryb0pu9l4qi'
//  };
//
// handleChangepostID = (event) => {
//     this.setState({postID: event});
// }
public items:any;
public refresher: any;
  constructor(public db: DynamoDB) {

    Auth.currentCredentials()
      .then(credentials => {
        this.userId = credentials.identityId;
        // this.refreshTasks();
        this.refreshTasks();
      })
      .catch(err => logger.debug('get current credentials err', err));

  }
  refreshData(refresher) {
    this.refresher = refresher;
    this.refreshTasks()
  }

async refreshTasks(){
  var docClient = this.db.getDocumentClient();
  this.postTable = 'postdir';
  var params = {
    TableName : this.postTable,
    IndexName : 'userid-index',
    KeyConditionExpression : 'userID = :IDVal',
    ExpressionAttributeValues : {
        ':IDVal' : this.userId
        // ':IDVal' : '5ippfryb0pu9l4qi'
    }
};
}
// const path = "/Notes/userID/" + 'hx7ksarkbugsahyv';
//       try {
//         const apiResponse = await API.get("postdirCRUD", path);
//         console.log("response from getting note: " + apiResponse);
//         // this.setState({apiResponse});
//       } catch (e) {
//         console.log(e);
//       }

// docClient.then(client => (client as DocumentClient)
// .query(params, function(err, data) {
//     if (err) {
//         console.error("Unable to read item. Error JSON:", JSON.stringify(err,
//                 null, 2));
//     } else {
//         console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
//     }
// }));
  // const params = {
  //       'TableName': this.postTable,
  //       // 'IndexName': 'DateSorted',
  //       'KeyConditionExpression': "#userID = :userId",
  //       'ExpressionAttributeNames': { '#userID': 'userId' },
  //       'ExpressionAttributeValues': { ':userId': this.userId },
  //       // 'ScanIndexForward': false
  //     };
      // this.db.getDocumentClient()
      //   .then(client => (client as DocumentClient).query(params).promise())
      //   .then(data => { this.items = data.Items; })
      //   .catch(err => logger.debug('error in refresh tasks', err))
      //   .then(() => { this.refresher && this.refresher.complete() });



  // noteId is the primary key of the particular record you want to fetch
    // async getPost() {
    //   const path = "/postdir/object/" + + this.state.postID;
    //   try {
    //     const apiResponse = await API.get("postdirCRUD", path);
    //     console.log("response from getting note: " + apiResponse);
    //     this.setState({apiResponse});
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
}
