const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    // Parse the body from the event
    const body = JSON.parse(event.body);

    // Extract the details from the body
    const { email, total_points, win_loss_ratio, games_played } = body;

    // Create parameters for the update operation
    const params = {
      TableName: "csci5409-sdp9-dynamoDB",
      Key: { email },
      UpdateExpression:
        "SET total_points = :tp, win_loss_ratio = :wlr, games_played = :gp",
      ExpressionAttributeValues: {
        ":tp": total_points,
        ":wlr": win_loss_ratio,
        ":gp": games_played,
      },
      ReturnValues: "UPDATED_NEW",
    };

    // Update the user in DynamoDB
    const data = await dynamodb.update(params).promise();

    // Respond with the updated user details
    return {
      statusCode: 200,
      body: "Successfully updated user " + email,
    };
  } catch (error) {
    console.error(error);

    // Respond with a 500 error if something goes wrong
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update user" + error }),
    };
  }
};
