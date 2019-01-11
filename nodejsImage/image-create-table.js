var AWS = require("aws-sdk");

AWS.config.update( {
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName: 'Image',
    KeySchema: [
        {
            AttributeName: 'Id',
            KeyType: 'HASH'
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'Id',
            AttributeType: 'S'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};

console.log("Creating the Image table.");
dynamodb.createTable(params, (err, data) => {
    if (err) ppJson(err);
    else ppJson(data)
});

function ppJson (msg) {
    console.log(`${JSON.stringify(msg, null, 2)}`);
}