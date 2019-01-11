var AWS = require("aws-sdk");

AWS.config.update( {
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: 'Image',
    Key: {
        Id: 'dynamodb.png'
    }
};

console.log("Calling GetItem");

ppJson(params);

docClient.get(params, (err, data) => {
    if (err) ppJson(err)
    else ppJson(data);
});

function ppJson (msg) {
    console.log(`${JSON.stringify(msg, null, 2)}`);
}