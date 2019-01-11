'use strict'

var AWS = require("aws-sdk");

AWS.config.update( {
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

function ppJson (msg) {
    console.log(`${JSON.stringify(msg, null, 2)}`);
}


var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: 'Image',
    Limit: 5
}

console.log("Calling the Scan API on the Image table");

docClient.scan(params, (err, data) => {
    if (err) ppJson(err);
    else {
        console.log("The Scan call evaluted "  + data.ScannedCount + " items");
        ppJson(data);

    }
});