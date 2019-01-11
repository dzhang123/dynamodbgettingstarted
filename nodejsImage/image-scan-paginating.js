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

// This example repeatedly scans a number of items at a time, following the pagination token until
// the scan reaches the end of the table.
var params = {
    TableName: 'Image',
    Limit: 15  // Limits the number of results per page
};

// A callback that paginates through an entire DynamoDB table
function doScan(err, data) {
    if (err) {
        ppJson(err); // an error occurred
    } else {
        // Print the results
        console.log("Last scan processed " + data.ScannedCount + " items: ");
        var images = [];
        for (var i = 0; i < data.Items.length; i++ ) {
            images.push(data.Items[i].Id);
        }
        console.log(" "  + images.join(", "));

        // More data.  Keep calling scan.
        if ('LastEvaluatedKey' in data) {
            console.log("Last Scan evaluated " + data.ScannedCount + " items. "
                + "Calling Scan again for another page of results");

            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, doScan);
        } else {
            console.log("*** Finished the scan ***");
        }
    }
}

// Kick off the scan
console.log("Starting a Scan of the Image table");
docClient.scan(params, doScan);