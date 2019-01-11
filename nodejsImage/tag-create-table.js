'use strict'

var AWS = require('aws-sdk');

AWS.config.update( {
    region: 'us-east-1',
    endpoint: 'http://localhost:3306'
});

var dynamodb = new AWS.DynamoDB();

function ppJson (msg) {
    console.log(msg);
};

var params = {
    TableName: 'Tag',
    KeySchema: [
        { AttributeName: 'Tag', KeyType: 'HASH'}
    ],
    AttributeDefinitions: [
        { AttributeName: 'Tag', AttributeType: 'S'}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};
console.log("Creating the Tag table");

dynamodb.createTable(params, (err, data) => {
    if (err) ppJson(err);
    else ppJson(data);
    console.log("CreateTable returned");
});