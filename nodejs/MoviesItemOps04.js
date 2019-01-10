'use strict'

var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Movies";
var year = 2015;
var title = "The Big New Movie";

var params = {
    TableName: table,
    Key: {
        "year": year,
        "title": title
    },
    UpdateExpression: "set info.rating = info.rating + :val",
    ExpressionAttributeValues: {
        ":val": 1
    },
    ReturnValues: "UPDATED_NEW"
};

console.log("Updating the item...");

docClient.update(params, (err, data) => {
    if (err)
        console.log(`Unable to update item. Error JSON: ${JSON.stringify(err, null, 2)}`);
    else 
        console.log("UpdateItem succeeded: ", JSON.stringify(data, null, 2));
});
