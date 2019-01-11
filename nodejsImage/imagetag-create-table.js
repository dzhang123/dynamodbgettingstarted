var AWS = require("aws-sdk");

AWS.config.update( {
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var dynamodb = new AWS.DynamoDB();
function ppJson (msg) {
    console.log(`${JSON.stringify(msg, null, 2)}`);
}

// This CreateTable request will create the ImageTag table.
var params = {
    TableName: 'ImageTag',
    KeySchema: [
        {
            AttributeName: 'Tag',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'ImageId',
            KeyType: 'RANGE'
        }
    ],
    GlobalSecondaryIndexes: [{
            IndexName: 'ImageId-index',
            KeySchema: [
                {
                    AttributeName: 'ImageId',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'Tag',
                    KeyType: 'RANGE'
                }
            ],
            Projection: {
                ProjectionType: 'KEYS_ONLY'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        }
    ],
    LocalSecondaryIndexes: [{
            IndexName: 'VoteCount-index',
            KeySchema: [
                {
                    AttributeName: 'Tag',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'VoteCount',
                    KeyType: 'RANGE'
                }
            ],
            Projection: {
                ProjectionType: 'ALL'
            }
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'Tag',
            AttributeType: 'S'
        },
        {
            AttributeName: 'ImageId',
            AttributeType: 'S'
        },
        {
            AttributeName: 'VoteCount',
            AttributeType: 'N'
        }
    ],
    ProvisionedThroughput:  {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};
console.log("Creating the ImageTag table");
dynamodb.createTable(params, function(err, data) {
        if (err) ppJson(err); // an error occurred
        else ppJson(data); // successful response
        console.log("CreateTable returned");
    });
    
