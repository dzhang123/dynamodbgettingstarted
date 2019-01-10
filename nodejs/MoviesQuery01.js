'use strict'

var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Querying for movies from 1985.");

var params = {
    TableName: "Movies",
    KeyConditionExpression: "#yr = :yyyy",
    ExpressionAttributeValues: {
        ":yyyy": 1985
    },
    ExpressionAttributeNames: {
        "#yr": "year"
    }
};

docClient.query(params, (err, data) => {
    if (err) {
        console.log(`Unable to query. Error: ${JSON.stringify(err, null, 2)}`);
    } else {
        console.log("Qery succeeded.");
        data.Items.forEach((item) => {
            console.log(` - ${item.year} : ${item.title}`);
        });
    }
});