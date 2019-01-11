var AWS = require("aws-sdk");

AWS.config.update( {
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();
function ppJson (msg) {
    console.log(`${JSON.stringify(msg, null, 2)}`);
}

// Queries for all items in the ImageTag table for images with the tag 'Database'
var params = {
    TableName: 'ImageTag',
    KeyConditionExpression: 'Tag = :db',
    ExpressionAttributeValues: {
        ':db' : 'Database'
    }
};
console.log("Querying the ImageTag table for all images with the tag 'Database'");
docClient.query(params).eachPage(function(err, data) {
    if (err) ppJson(err); // an error occurred
    else if (data) ppJson(data); // successful response
});