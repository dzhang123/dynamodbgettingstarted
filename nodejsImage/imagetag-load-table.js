var AWS = require("aws-sdk");

AWS.config.update( {
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();
function ppJson (msg) {
    console.log(`${JSON.stringify(msg, null, 2)}`);
}

// This short program will load in a bunch of example data into the ImageTag table.

// A map of image id to the tags to attach to the image.
var images = {
    'android.png': ['SDKs & Tools', 'Android'],
    'appstream.png': ['Application Services', 'Amazon AppStream'],
    'cli.png': ['SDKs & Tools', 'AWS CLI'],
    'cloudformation.png': ['Deployment & Management', 'AWS CloudFormation'],
    'cloudfront.png': ['Storage & CDN', 'Amazon CloudFront'],
    'cloudsearch.png': ['Application Services', 'Amazon CloudSearch'],
    'cloudtrail.png': ['Deployment & Management', 'AWS CloudTrail'],
    'cloudwatch.png': ['Deployment & Management', 'Amazon CloudWatch'],
    'data-pipeline.png': ['Analytics', 'AWS Data Pipeline'],
    'direct-connect.png': ['Compute & Networking', 'AWS Direct Connect'],
    'dotnet.png': ['SDKs & Tools', '.NET'],
    'dynamodb.png': ['Database', 'Amazon DynamoDB'],
    'ec2.png': ['Compute & Networking', 'Amazon EC2'],
    'eclipse.png': ['SDKs & Tools', 'Eclipse'],
    'elasticache.png': ['Database', 'Amazon ElastiCache'],
    'elastic-beanstalk.png': ['Deployment & Management', 'AWS Elastic Beanstalk'],
    'elb.png': ['Compute & Networking', 'Elastic Load Balancing'],
    'emr.png': ['Analytics', 'Amazon EMR'],
    'glacier.png': ['Storage & CDN', 'Amazon Glacier'],
    'iam.png': ['Deployment & Management', 'AWS IAM'],
    'ios.png': ['SDKs & Tools', 'iOS'],
    'java.png': ['SDKs & Tools', 'Java'],
    'kinesis.png': ['Analytics', 'Amazon Kinesis'],
    'nodejs.png': ['SDKs & Tools', 'Node.js'],
    'opsworks.png': ['Deployment & Management', 'AWS OpsWorks'],
    'php.png': ['SDKs & Tools', 'PHP'],
    'powershell.png': ['SDKs & Tools', 'PowerShell'],
    'python.png': ['SDKs & Tools', 'Python'],
    'rds.png': ['Database', 'Amazon RDS'],
    'redshift.png': ['Database', 'Amazon Redshift'],
    'route53.png': ['Compute & Networking', 'Amazon Route 53'],
    'ruby.png': ['SDKs & Tools', 'Ruby'],
    's3.png': ['Storage & CDN', 'Amazon S3'],
    'ses.png': ['Application Services', 'Amazon SES'],
    'sns.png': ['Application Services', 'Amazon SNS'],
    'sqs.png': ['Application Services', 'Amazon SQS'],
    'storage-gateway.png': ['Storage & CDN', 'Amazon Storage Gateway'],
    'swf.png': ['Application Services', 'Amazon SWF'],
    'transcoding.png': ['Application Services', 'Amazon Elastic Transcoder'],
    'visual-studio.png': ['SDKs & Tools', 'Visual Studio'],
    'vpc.png': ['Compute & Networking', 'Amazon VPC']
};

// Pulls off the next image to tag mapping in the above map, and
// processes all of the tags for that image.
function processImage() {

    // If there aren't any images left, we're done (pending any in-flight requests)
    if (Object.keys(images).length === 0) {
        console.log("*** Finished tagging all images ***");
        return;
    }

    // Get the first image and its tags
    var image = Object.keys(images)[0];
    var tags = images[image];
    delete images[image];

    // Random vote count for each image...kind of.
    voteCount = ("dynamodb.png" == image) ? 1000 : Math.floor((Math.random() * 20) + 80);

    // Always tag images with 'Amazon Web Services'
    tags.push('Amazon Web Services');

    // Submit the requests in parallel and wait for them to complete
    inFlightRequests = tags.length;

    // Update the Image item to include a vote count
    docClient.update({
        TableName: 'Image',
        Key: {
            Id: image,
        },
        UpdateExpression: 'ADD VoteCount :voteCount',
        ExpressionAttributeValues: {
            ':voteCount': voteCount
        }
    }).on('complete', function (response) {
        //var image = response.request.params.Key.ImageId;
        var image = response.request.params.Key.Id.S;
        if (response.error) {
            console.log("ERROR with updating vote count for image " + image + ": " + err);
        } else {
            console.log("Updated VoteCount for " + image);
        }
        /*
        inFlightRequests--;
        if(inFlightRequests === 0) {
            console.log("Done with writes for image " + image);
            processImage();
        }
        */
    }).send();

    // Now insert a new tag item for each ImageTag relationship
    for (i = 0; i < tags.length; i++) {
        var tag = tags[i];
        var imageId = image;

        // Write the ImageTag item for this image+tag combination
        docClient.put({
            TableName: 'ImageTag',
            Item: {
                Tag: tag,
                ImageId: imageId,
                VoteCount: voteCount,
            }
        }, function (err, data) {
            if (err) {
                console.log("ERROR with tagging " + imageId + " with " + tag + ": " + err);
            } else {
                console.log("Tagged " + imageId + " with " + tag);
            }
            inFlightRequests--;
            if(inFlightRequests === 0) {
                console.log("Done with writes for image " + imageId);
                processImage();
            }
        }); // FIXME disregard this style warning. Working on disabling that feature of editor.
    }
}

// Kick off the process
processImage();
