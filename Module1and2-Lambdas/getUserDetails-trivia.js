const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  };

  const { email } = JSON.parse(event.body);

  try {
    // Fetch the data from DynamoDB based on the email
    const params = {
      TableName: "csci5409-sdp9-dynamoDB",
      ExpressionAttributeValues: {
        ":email": email,
      },
      KeyConditionExpression: "email = :email",
      ProjectionExpression:
        "email, firstName, lastName, #rl, games_played, win_loss_ratio, total_points, userId",
      ExpressionAttributeNames: {
        "#rl": "role",
      },
    };

    const result = await dynamodb.query(params).promise();
    const record = result.Items[0];

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(record),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({
        message: "Error fetching data from DynamoDB" + error,
      }),
    };
  }
};
