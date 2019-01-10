'use strict'

var AWS = require('aws-sdk');
AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Querying for movies from 1992 - titles A-L, with genre and lead actor");

var params = {
    TableName : "Movies",
    ProjectionExpression:"#yr, title, info.genres, info.actors[0]",
    KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2",
    ExpressionAttributeNames:{
        "#yr": "year"
    },
    ExpressionAttributeValues: {
        ":yyyy": 1992,
        ":letter1": "A",
        ":letter2": "L"
    }
};

docClient.query(params, (err, data) => {
    if (err) {
        console.log(`Unable to query. Error: ${JSON.stringify(err, null, 2)}`);
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(item => {
            console.log(` - ${JSON.stringify(item.year)}: ${JSON.stringify(item.title)} ... ${JSON.stringify(item.info.genres)} ... ${JSON.stringify(item.info.actors[0])}`);
        })
    }
});