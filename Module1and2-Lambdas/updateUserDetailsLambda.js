const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  };
  try {
    // Parse the body from the event
    const body = JSON.parse(event.body);

    // Extract the details from the body
    const { email, firstName, lastName, role, userId } = body;

    // Create parameters for the update operation
    const params = {
      TableName: "csci5409-sdp9-dynamoDB",
      Key: { email },
      UpdateExpression:
        "SET firstName = :fn, lastName = :ln, #r = :role, userId = :ui",
      ExpressionAttributeNames: {
        "#r": "role",
      },
      ExpressionAttributeValues: {
        ":fn": firstName,
        ":ln": lastName,
        ":role": role,
        ":ui": userId,
      },
      ReturnValues: "UPDATED_NEW",
    };

    // Update the user in DynamoDB
    const data = await dynamodb.update(params).promise();

    // Respond with the updated user details
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(data.Attributes),
    };
  } catch (error) {
    console.error(error);

    // Respond with a 500 error if something goes wrong
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: "Failed to update user" }),
    };
  }
};
