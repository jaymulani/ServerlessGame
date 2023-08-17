const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = "csci5409-sdp9-dynamoDB";

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  };

  try {
    const body = JSON.parse(event.body);
    console.log(body);
    // Extract data from event
    const {
      email,
      firstName,
      lastName,
      role,
      qnaData,
      games_played,
      win_loss_ratio,
      total_points,
      userId,
    } = body;

    // Create parameters for the put operation
    const params = {
      TableName: tableName,
      Item: {
        firstName,
        lastName,
        role,
        qnaData,
        email,
        games_played,
        win_loss_ratio,
        total_points,
        userId,
      },
    };

    // Put the data in DynamoDB
    await dynamodb.put(params).promise();
    console.log("QnA answers saved successfully.");

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: "QnA answers saved successfully." }),
    };
  } catch (error) {
    console.error("Error saving QnA answers:", error);

    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: "Error saving QnA answers" + error }),
    };
  }
};
