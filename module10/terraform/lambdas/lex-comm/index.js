const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  console.log(event)
  const lexRuntime = new AWS.LexRuntime({
    region: 'us-east-1'
  });

  const userInput = JSON.parse(event.body).message;

  try {

    const lexResponse = await lexRuntime.postText({
      botName: 'TriviaBot',
      botAlias: 'TriviaBotAlias',
      userId: 'YourUserId',
      inputText: userInput
    }).promise();

    const responseMessage = lexResponse.message;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*'
      },
      body: JSON.stringify({
        intentName: lexResponse.intentName,
        reply: responseMessage,
        link: responseMessage.includes("/") ? `/${responseMessage.split('/')[1]}` : null
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*'
      },
      body: `Error querying Lex: ${error.message}`
    };
  }
};
