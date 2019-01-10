'use strict';

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
    }
};

console.log("Attempting a conditional delete...");

docClient.delete(params, (err, data) => {
    if (err)
        console.log(`Unable to delete item. Error JSON: ${JSON.stringify(err, null, 2)}`);
    else {
        console.log(`DeleteItem succeeded: ${JSON.stringify(data, null, 2)}`);
    }
});