var AWS = require("aws-sdk");

AWS.config.update( {
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();

// The BatchWriteItem takes up to 25 requests, some of which may succeed,
// and others needing to be retried. This example program takes in a list of requests
// that is larger than the batch size, and calls BatchWriteItem multiple times until
// all of the items have been written.
var params = {
    // RequestItems is a map of TableName to Requests
    RequestItems: {
        Image: [
            {
                PutRequest: {
                    Item: {
                        Id: 'sqs.png',
                        DateAdded: new Date().toISOString(),
                        VoteCount: 0 
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        Id: 'kinesis.png',
                        DateAdded: new Date().toISOString(),
                        VoteCount: 0
                    }
                }
            }
        ]
    }
};

// Generate some more requests and add them to the params map
var urls = [ 'android.png', 'appstream.png', 'cli.png', 'cloudformation.png',
    'cloudfront.png', 'cloudsearch.png', 'cloudtrail.png', 'cloudwatch.png', 'data-pipeline.png',
    'direct-connect.png', 'dotnet.png', 'dynamodb.png', 'ec2.png', 'eclipse.png', 'elasticache.png',
    'elastic-beanstalk.png', 'elb.png', 'emr.png', 'glacier.png', 'iam.png', 'ios.png', 'java.png',
    'nodejs.png', 'opsworks.png', 'php.png', 'powershell.png', 'python.png', 'rds.png', 'redshift.png',
    'route53.png', 'ruby.png', 's3.png', 'ses.png', 'sns.png', 'storage-gateway.png', 'swf.png',
    'transcoding.png', 'visual-studio.png', 'vpc.png'
];

// Iterate over all of the additional URLs and keep kicking off batches of up to 25 items
while (urls.length > 0) {

    // Pull off up to 25 items from the list
    for (var i = params.RequestItems.Image.length; i < 25; i++) {

        // Nothing else to add to the batch if the input list is empty
        if (urls.length === 0) {
            break;
        }

        // Take a URL from the list and add a new PutRequest to the list of requests
        // targeted at the Image table
        url = urls.pop();
        params.RequestItems.Image.push(
            {
                PutRequest: {
                    Item: {
                        Id: url,
                        DateAdded: new Date().toISOString(),
                        VoteCount: 0
                    }
                }
            }
        );
    }
    // Kick off this batch of requests
    console.log("Calling BatchWriteItem with a new batch of "
            + params.RequestItems.Image.length + " items");
    docClient.batchWrite(params, doBatchWriteItem);

    // Initialize a new blank params variable
    params = {
        RequestItems: {
            Image: []
        }
    };
}

// A callback that repeatedly calls BatchWriteItem until all of the writes have completed
function doBatchWriteItem(err, data) {
    if (err) {
        ppJson(err); // an error occurred
    } else {
        if ('UnprocessedItems' in data && 'Image' in data.UnprocessedItems) {
            // More data. Call again with the unprocessed items.
            var params = {
                RequestItems: data.UnprocessedItems
            };
            console.log("Calling BatchWriteItem again to retry "
                + params.RequestItems.Image.length + "UnprocessedItems");
            docClient.batchWrite(params, doBatchWriteItem);
        } else {
            console.log("BatchWriteItem processed all items in the batch");
        }
    }
}

function ppJson (msg) {
    console.log(`${JSON.stringify(msg, null, 2)}`);
}


