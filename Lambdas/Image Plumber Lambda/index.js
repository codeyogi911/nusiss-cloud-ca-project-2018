/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

// const awsServerlessExpress = require('aws-serverless-express')
'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});
const Sharp = require('sharp');
var util = require('util');

exports.handler = function(event, context, callback) {
    // Read options from the event.
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    // var srcBucket = event.Records[0].s3.bucket.name;
    var srcBucket = 'nuscloudca-userfiles-mobilehub-726174774';
    // Object key may have spaces or unicode non-ASCII characters.
    // var srcKey    =
    // decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    var srcKey    = event.srcKey;
    var dstBucket = srcBucket;

    var typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        callback("Could not determine the image type.");
        return;
    }
    var imageType = typeMatch[1];
    if (imageType != "jpeg" && imageType != "png") {
        callback('Unsupported image type: ${imageType}');
        return;
    }
    // Sanity check: validate that source and destination are different buckets.
    // if (srcKey.includes("_thumb")) {
    //     callback("Job already done!");
    //     return;
    // }
    if (srcKey.includes("avatar")){
      var dstKey  = srcKey.replace("avatar.jpeg", "avatar_thumb.jpg");
      var dim = 200;
      var request = S3.getObject({Bucket: srcBucket, Key: srcKey}).promise()
        .then(data => Sharp(data.Body)
          .resize(dim, dim)
          .min()
          .jpeg()
          // .webp({ lossless: true })
          // .toFormat('webp')
          .toBuffer()
        );
    }
    else {
      var dstKey    = srcKey.replace("image.jpeg", "image_thumb.jpg");
      var dim = 500;
      var request =S3.getObject({Bucket: srcBucket, Key: srcKey}).promise()
        .then(data => Sharp(data.Body)
          .resize(dim, dim)
          // .min()
          // .webp({ lossless: true })
          .jpeg()
          // .toFormat('webp')
          .toBuffer()
        );
    }
    // Infer the image type.


    // Download the image from S3, transform, and upload to a different S3 bucket.
            request
              .then(buffer => S3.putObject({
                  Body: buffer,
                  Bucket: srcBucket,
                  ContentType: 'image/jpg',
                  Key: dstKey,
                }).promise()
              )
              .then(() => {
                // S3.
                console.log(
                    'Successfully resized ' + srcBucket + '/' + srcKey +
                    ' and uploaded to ' + dstBucket + '/' + dstKey
                );
                callback(null, "Resize Successfully");
              })
              .catch(err => {
                    console.error(
                        'Unable to resize ' + srcBucket + '/' + srcKey +
                        ' and upload to ' + dstBucket + '/' + dstKey +
                        ' due to an error: ' + err
                    );
                    callback(err);
              });
}
