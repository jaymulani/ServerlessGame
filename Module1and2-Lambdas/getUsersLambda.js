const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: "us-east-1" });

// Create the DynamoDB service object
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  };

  try {
    const params = {
      TableName: "csci5409-sdp9-dynamoDB",
    };

    const data = await dynamodb.scan(params).promise();

    // Return the fetched items
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: "Failed to fetch users" }),
    };
  }
};
