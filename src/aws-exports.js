// WARNING: DO NOT EDIT. This file is Auto-Generated by AWS Mobile Hub. It will be overwritten.

// Copyright 2017-2018 Amazon.com, Inc. or its affiliates (Amazon). All Rights Reserved.
// Code generated by AWS Mobile Hub. Amazon gives unlimited permission to
// copy, distribute and modify it.

// AWS Mobile Hub Project Constants
const awsmobile = {
    'aws_app_analytics': 'enable',
    'aws_cognito_identity_pool_id': 'us-east-1:1619101a-813a-4af1-93c0-ad2bbbdad562',
    'aws_cognito_region': 'us-east-1',
    'aws_content_delivery': 'enable',
    'aws_content_delivery_bucket': 'nusisscloudca-hosting-mobilehub-1796201548',
    'aws_content_delivery_bucket_region': 'us-east-1',
    'aws_content_delivery_cloudfront': 'enable',
    'aws_content_delivery_cloudfront_domain': 'd1cvvmk42ih7v7.cloudfront.net',
    'aws_dynamodb': 'enable',
    'aws_dynamodb_all_tables_region': 'us-east-1',
    'aws_dynamodb_table_schemas': [{"tableName":"nusisscloudca-mobilehub-1796201548-postDir1","attributes":[{"name":"userID","type":"S"},{"name":"timestamp","type":"N"},{"name":"description","type":"S"},{"name":"postID","type":"S"}],"indexes":[],"region":"us-east-1","hashKey":"userID","rangeKey":"timestamp"},{"tableName":"nusisscloudca-mobilehub-1796201548-AWSMobileTable","attributes":[{"name":"teamId","type":"S"},{"name":"personId","type":"S"},{"name":"email","type":"S"},{"name":"personName","type":"S"},{"name":"phone","type":"S"}],"indexes":[{"indexName":"personName-index","hashKey":"teamId","rangeKey":"personName"}],"region":"us-east-1","hashKey":"teamId","rangeKey":"personId"},{"tableName":"nusisscloudca-mobilehub-1796201548-postDir","attributes":[{"name":"userID","type":"S"},{"name":"postID","type":"S"},{"name":"desc","type":"S"},{"name":"description","type":"S"},{"name":"time","type":"N"},{"name":"timestamp","type":"N"}],"indexes":[],"region":"us-east-1","hashKey":"userID","rangeKey":"postID"}],
    'aws_mobile_analytics_app_id': 'abe2a75a299543a6aa71462790786eb1',
    'aws_mobile_analytics_app_region': 'us-east-1',
    'aws_project_id': '52a031b7-c242-4e72-89f8-2cff1e9c53fb',
    'aws_project_name': 'nusiss-cloud-ca',
    'aws_project_region': 'us-east-1',
    'aws_resource_name_prefix': 'nusisscloudca-mobilehub-1796201548',
    'aws_sign_in_enabled': 'enable',
    'aws_user_files': 'enable',
    'aws_user_files_s3_bucket': 'nusisscloudca-userfiles-mobilehub-1796201548',
    'aws_user_files_s3_bucket_region': 'us-east-1',
    'aws_user_pools': 'enable',
    'aws_user_pools_id': 'us-east-1_vR7Gm4oKu',
    'aws_user_pools_mfa_type': 'ON',
    'aws_user_pools_web_client_id': '6lveq7ukgghusbu6tajpvsml93',
}

export default awsmobile;
