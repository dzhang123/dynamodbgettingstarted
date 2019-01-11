var AWS = require("aws-sdk");

AWS.config.update( {
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();
function ppJson (msg) {
    console.log(`${JSON.stringify(msg, null, 2)}`);
}

// Queries ImageTag's VoteCount index to get up to 5 images with the 'Database' tag, ordered by popularity
var params = {
    TableName: 'ImageTag',
    IndexName: 'VoteCount-index',
    KeyConditionExpression: 'Tag = :db',
    ExpressionAttributeValues: {
        ':db' : 'Database'
    },
    Limit: 5,
    ScanIndexForward: false
};
console.log("Querying the ImageTag table's VoteCount-index "
    + "for up to 5 images with the tag 'Database', ordered by VoteCount (descending)");
docClient.query(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else if (data) ppJson(data); // successful response
});