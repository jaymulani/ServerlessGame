

const AWS = require('aws-sdk');
const axios = require('axios');
const dynamo = new AWS.DynamoDB.DocumentClient();


exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  const userId = requestBody.userId;
  // const userId = event.userId;
  console.log(userId + "userId");

  try {
    const params = {
      TableName: 'Invitation',
      FilterExpression: 'userId = :userId AND invitationStatus = :invitationStatus',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':invitationStatus': 'accept', // Only accepted invitations
      },
    };

    const data = await dynamo.scan(params).promise();
    const response = await axios.get('https://mdlbsby4nd.execute-api.us-east-1.amazonaws.com/dev/teams');
// console.log(data)
    const teamsData = response.data;

        const teamIds = data.Items.map(item => item.teamId);

    // Filter the teamsData array 
    // const teams = teamsData.filter(team => teamIds.includes(team.id));
    const teams = teamsData
      .filter(team => teamIds.includes(team.id))
      .map(({ id, team_name }) => ({ id, team_name }));


console.log(teams)
    const apiResponse = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({ teams }),
    };

    return apiResponse;
  } catch (error) {
    console.error('Error:', error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve teams' }),
    };

    return response;
  }
};
