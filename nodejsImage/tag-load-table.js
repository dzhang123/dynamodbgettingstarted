var AWS = require("aws-sdk");

AWS.config.update( {
    region: "us-east-1",
    //endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();
function ppJson (msg) {
    console.log(`${JSON.stringify(msg, null, 2)}`);
}

// Populates the Tag table to list all of the tags and each tag's image count

// A map of tag to number of images with that tag
var tags = {
    'SDKs & Tools': 12,
    'Application Services': 7,
    'Deployment & Management': 6,
    'Storage & CDN': 4,
    'Analytics': 3,
    'Compute & Networking': 5,
    'Database': 5,
    'Android': 1,
    'Amazon AppStream': 1,
    'AWS CLI': 1,
    'AWS CloudFormation': 1,
    'Amazon CloudFront': 1,
    'Amazon CloudSearch': 1,
    'AWS CloudTrail': 1,
    'AWS Data Pipeline': 1,
    'AWS Direct Connect': 1,
    '.NET': 1,
    'Amazon DynamoDB': 1,
    'Amazon EC2': 1,
    'Eclipse': 1,
    'Amazon ElastiCache': 1,
    'AWS Elastic Beanstalk': 1,
    'Elastic Load Balancing': 1,
    'Amazon EMR': 1,
    'Amazon Glacier': 1,
    'AWS IAM': 1,
    'iOS': 1,
    'Java': 1,
    'Amazon Kinesis': 1,
    'Node.js': 1,
    'AWS OpsWorks': 1,
    'PHP': 1,
    'PowerShell': 1,
    'Python': 1,
    'Amazon RDS': 1,
    'Amazon Redshift': 1,
    'Amazon Route 53': 1,
    'Ruby': 1,
    'Amazon S3': 1,
    'Amazon SES': 1,
    'Amazon SNS': 1,
    'Amazon SQS': 1,
    'Amazon Storage Gateway': 1,
    'Amazon SWF': 1,
    'Amazon Elastic Transcoder': 1,
    'Visual Studio': 1,
    'Amazon VPC': 1
};

// Kicks off putting the tags into the table
putTag();

// Puts the tags into the Tag table one by one
function putTag() {

    // If there are no more tags in the map, we're done
    if (Object.keys(tags).length === 0) {
        console.log("*** Finished adding tags ***");
        return;
    }
    // Pop off the next tag in the list
    var tag = Object.keys(tags)[0];
    var numImages = tags[tag];
    delete tags[tag];

    // Put the Tag item into the table
    docClient.put({
        TableName: 'Tag',
        Item: {
            Tag: tag,
            ImageCount: numImages
        }
    }, function(err, data) {
        if (err) ppJson(err); // an error occurred
        else {
            console.log("Added the '" + tag + "' tag");
            putTag(); // put the next tag once this one completes
        }
    });
}