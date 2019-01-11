var AWS = require("aws-sdk");

AWS.config.update( {
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();
function ppJson (msg) {
    console.log(`${JSON.stringify(msg, null, 2)}`);
}

// Queries ImageTag's ImageId index to get all of the tags for the image 'dynamodb.png'
var params = {
    TableName: 'ImageTag',
    IndexName: 'ImageId-index',
    KeyConditionExpression: 'ImageId = :png',
    ExpressionAttributeValues: {
        ':png': 'dynamodb.png'
    }
};
console.log("Querying the ImageTag table's ImageId-index all tags for the image 'dynamodb.png'");
docClient.query(params).eachPage(function(err, data) {
    if (err) ppJson(err); // an error occurred
    else if (data) ppJson(data); // successful response
});