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

    // Extract the userEmail and base64 from the body
    const { userEmail, base64 } = body;

    // Form the object key
    const Key = `${userEmail}_user_icon`;

    // Convert base64 to binary
    const base64Data = new Buffer.from(base64, "base64");

    // Set up the params config
    const uploadParams = {
      Bucket: "user-icon-trivia",
      Key,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
    };

    // Try to get the existing file
    try {
      const existingFile = await s3
        .getObject({
          Bucket: "user-icon-trivia",
          Key,
        })
        .promise();

      // If the file exists, delete it
      if (existingFile) {
        await s3
          .deleteObject({
            Bucket: "user-icon-trivia",
            Key,
          })
          .promise();
      }
    } catch (error) {
      // If the error is NoSuchKey, the file does not exist and we can continue
      if (error.code !== "NoSuchKey") {
        throw error;
      }
    }

    // Upload the new file
    const result = await s3.upload(uploadParams).promise();

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: "Failed to process request" }),
    };
  }
};
