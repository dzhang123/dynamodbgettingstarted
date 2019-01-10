'use strict'

var AWS = require('aws-sdk');

AWS.config.update( {
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
    UpdateExpression: "remove info.actors[0]",
    ConditionExpression: "size(info.actors) >= :num",
    ExpressionAttributeValues: {
        ":num": 3
    },
    ReturnValues: "UPDATED_NEW"
};
console.log("Attempting a conditional update...");

docClient.update(params, (err, data) => {
    if (err)
        console.log(`Unable to update item. Error JSON: ${JSON.stringify(err, null, 2)}`);
    else 
        console.log(`UpdateItem succeeded: ${JSON.stringify(data, null, 2)}`);
});