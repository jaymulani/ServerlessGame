const AWS = require("aws-sdk");
const s3 = new AWS.S3();

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

    // Extract the userEmail from the body
    const { userEmail } = body;

    // Form the object key
    const Key = `${userEmail}_user_icon`;

    // Set up the params config
    const getParams = {
      Bucket: "user-icon-trivia",
      Key,
    };

    // Get the file from the bucket
    const result = await s3.getObject(getParams).promise();

    // Convert the file data to a Base64 string
    const base64 = Buffer.from(result.Body).toString("base64");

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ base64 }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ error: "" }),
    };
  }
};
