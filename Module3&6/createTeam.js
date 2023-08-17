const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();
const sns = new AWS.SNS();


const crypto = require('crypto');

function generateRandomToken(length) {
  const token = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  return token;
}

exports.handler = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body);
    const emailId = requestBody.email;
    let userId = requestBody.userId;
    const teamId = requestBody.teamId;
    // const emailId = 'jaymulani26@gmail.com';
    // let userId = 'u2';
    // const teamId = '9b81';
    const randomToken = generateRandomToken(6);


    //Check if the user exists in the database
    const paramsy = {
      FunctionName: 'checkUserExistInTeam', 
      Payload: JSON.stringify({ email: emailId }),
    };

    const responsey = await lambda.invoke(paramsy).promise();
    const datay = JSON.parse(responsey.Payload);
    const dat = JSON.parse(datay.body);
    
    userId=dat.id;
    const exeValue = dat.exe;
    console.log(userId+"@"+exeValue+dat)
    if (exeValue === 'no') {
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        body: JSON.stringify(exeValue),
      };
      return response;
    }
    
    

    //Check if an invitation already exists for the user and team
    const paramsx = {
      TableName: 'Invitation',
      FilterExpression: 'userId = :userId AND teamId = :teamId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':teamId': teamId,
      },
    };
    const existingEntries = await dynamo.scan(paramsx).promise();

    if (existingEntries.Count === 0) {
      // If no invitation exists, create a new invitation entry
      const item = {
        userId: userId,
        teamId: teamId,
        invitationId: randomToken,
        // receiverEmail: emailId,
        invitationStatus: 'pending',
        isAdmin: 'false',
      };
      const params2 = {
        TableName: 'Invitation',
        Item: item,
      };

      dynamo.put(params2, (err, data) => {
        if (err) {
          console.error('Error putting item into DynamoDB:', err);
        } else {
          console.log('Item put successfully:', data);
        }
      });
    }

    let message = 'To accept the invitation click here.\n';
    message +=
      'https://xipywinvrj.execute-api.us-east-1.amazonaws.com/default/updateStatus?token=' +
      randomToken +
      '&status=accept'; 
    message += '\n\nTo decline the invitation click here.\n';
    message +=
      'https://xipywinvrj.execute-api.us-east-1.amazonaws.com/default/updateStatus?token=' +
      randomToken +
      '&status=decline'; 
      
      const params2 = {
      Message: message,
      Subject: 'Invitation Link',
      TopicArn: 'arn:aws:sns:us-east-1:893061098969:getMailSNS', 
      MessageAttributes: {
        'email': {
          DataType: 'String',
          StringValue: emailId 
        }
      },
    };

    await sns.publish(params2).promise();

    const lambdaFunctionName = 'nm'; 
    const params = {
      FunctionName: lambdaFunctionName,
      InvocationType: 'Event',
      Payload: JSON.stringify({ message, emailId }),
    };

    await lambda.invoke(params).promise();

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify('Successful'),
    };
    return response;
  } catch (error) {
    console.error('Error processing messages:', error);
    const response = {
      statusCode: 500,
      body: JSON.stringify('Error processing messages.'),
    };
    return response;
  }
};
