const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { email, answer1, answer2, answer3 } = JSON.parse(event.body);

    const params = {
      TableName: "csci5409-sdp9-dynamoDB",
      Key: { email },
    };
    const { Item } = await dynamodb.get(params).promise();
    const qnaData = Item.qnaData;
    console.log("qnaData:\n", qnaData);
    const qnaAnswers = {
      answer1: qnaData["Question 1: What is your favorite color?"],
      answer2: qnaData["Question 2: What is your pet's name?"],
      answer3: qnaData["Question 3: Where were you born?"],
    };
    console.log("qnaAnswers : \n" + qnaAnswers.answer1 + "\n" + answer1 + "\n");
    console.log("Game Over");
    const isVerified =
      qnaAnswers.answer1 == answer1 &&
      qnaAnswers.answer2 == answer2 &&
      qnaAnswers.answer3 == answer3;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({ verified: isVerified }),
    };
  } catch (error) {
    console.log("Error verifying answers:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({
        message: "Error verifying answers. The error is : " + error,
      }),
    };
  }
};
