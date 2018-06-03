'use strict';

console.log('Loading function');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();
const rekognition = new AWS.Rekognition({region: 'us-west-2' ,apiVersion: '2016-06-27'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
exports.likeUpdateFunc = (event, context, callback) => {

    console.log('Received event:', JSON.stringify(event, null, 2));

    var params = {
  Key: {
  postid: event.postid,
  timestamp: event.timestamp
  },
  TableName: process.env.TABLE_NAME
 };
    dynamo.get(params).promise()
    .then(data => {
        if (event.isLiked)
        {
            if (!data.Item.likeusers.includes(event.username))
            data.Item.likeusers.push(event.username);
        }
        else
        {
            const index = data.Item.likeusers.indexOf(event.username);
            data.Item.likeusers.splice(index, 1);
            console.log(data.Item.likeusers);
        }

        data.Item.likecount = data.Item.likeusers.length;
        var setValueParams = {
          TableName : process.env.TABLE_NAME,
          Item: data.Item
        };

        console.log(data);
        dynamo.put(setValueParams, function(err, data) {
          if (err) {
              console.log(err);
              callback(err,null);
          }
          else {
              console.log(data);
              callback(null,200);
          }
        });
    })
    .catch(err => {
        console.log(err);
        callback(err,null);
    });
};

exports.updateAvatar = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    resizeAvatar(event,callback);
};




function resizeAvatar(event,callback) {
  var srcKey = 'public/'+ event.username + '/avatar.jpeg';
    var Payload = JSON.stringify({"srcKey":srcKey});
    var params = {
      FunctionName: 'imagePlumber', /* required */
      InvocationType: "RequestResponse",
      LogType: "None",
      Payload: Payload /* Strings will be Base-64 encoded on your behalf */,
    };
    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        callback(err);    // an error occurred
      }
      else    {                           // successful response
      console.log(data);
      console.log("Resize was successful")

      updateRecord(event,callback);
    }
    });
}

function updateRecord(event,callback) {
    var params = {
  Key: {
  "username": event.username
  },
  TableName: process.env.TABLE_NAME
 };

    dynamo.get(params).promise()
    .then(data => {
        data.Item.avatarPath =  event.username + '/avatar_thumb.jpg';


        var setValueParams = {
          TableName : process.env.TABLE_NAME,
          Item: data.Item
        };

        console.log(data);
        dynamo.put(setValueParams, function(err, data) {
          if (err) {
              console.log(err);
              callback(err,null);
          }
          else {
              console.log(data);
              callback(null,200);
          }
        });



    })
    .catch(err => {
        console.log(err);
        callback(err,null);
    });


}

exports.imagetagging = (event, context, callback) => {
      console.log('Received event:', JSON.stringify(event, null, 2));
      var srcBucket = process.env.bucket_name;
      var srcKey    = event.srcKey;

      var params = {
                  Bucket: srcBucket,
                  Key: srcKey
                  };

      s3.getObject(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else   {
              console.log(data);
              var params1 ={
                          Image: { /* required */
                          Bytes: data.Body /* Strings will be Base-64 encoded on your behalf */,
                          },
                          MaxLabels: 10,
                          MinConfidence: 70.0
                  };
            rekognition.detectLabels(params1, function(err,data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else     {
                  console.log(data);           // successful response
                  var stringres ='';

                  data.Labels.forEach(function(element){
                      stringres = stringres +' #' + element.Name;
                  });
                  callback(null,stringres);
                  }
                  });
                  }});
};
