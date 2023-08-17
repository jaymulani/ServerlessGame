
const AWS = require('aws-sdk');
const axios = require('axios');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // const teamId = 'abf2ea98-9014-47e0-b8c3-0daa52070941';
  const requestBody = JSON.parse(event.body);
  const teamId = requestBody.teamId;

  try {
    
    const params = {
      TableName: 'Invitation',
      FilterExpression: 'teamId = :teamId AND invitationStatus = :invitationStatus',
      ExpressionAttributeValues: {
        ':teamId': teamId,
        ':invitationStatus': 'accept',
      },
      ProjectionExpression: 'userId',
    };

    const data = await dynamo.scan(params).promise();
    const invitations = data.Items;
    const userIds = invitations.map(invitation => invitation.userId);
      const userData = await axios.get('https://5r9064zspc.execute-api.us-east-1.amazonaws.com/default/getUsersLambda');
    const matchingUsers = userData.data.filter(user => userIds.includes(user.userId));
    
    const result = matchingUsers.map(user => ({
  userId: user.userId,
  receiverEmail: user.email,
  username: user.firstName+" "+user.lastName,
}));


console.log(userIds+"uid")

console.log(matchingUsers)


    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      // body: JSON.stringify(invitationsWithUsernames),
      body: JSON.stringify(result),

    };

    return response;
  } catch (error) {
    console.error('Error:', error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve invitations' }),
    };

    return response;
  }
};
