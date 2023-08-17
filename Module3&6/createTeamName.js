// Generates teamname 

const AWS = require('aws-sdk');
const axios = require('axios');


const crypto = require('crypto');
const dynamo = new AWS.DynamoDB.DocumentClient();

function generateRandomToken(length) {
  const token = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  return token;
}

exports.handler = async (event, context) => {
  const requestBody = JSON.parse(event.body);
  const teamName=requestBody.teamName;
  // From frontend
  const userId = requestBody.userId;
  // const teamName='hello';
  // const userId='u1';
  // const teamId = generateRandomToken(4);
  const randomToken = generateRandomToken(6);


  let body;
  let statusCode = '200';

  try {
        // create entry in team table

      const postData = {
      team_name: teamName,
      timeStamp: new Date().toISOString(),
      };
    
    const rep = await axios.post('https://mdlbsby4nd.execute-api.us-east-1.amazonaws.com/dev/team', postData);
    const { id } = rep.data; 
    const teamId=id;

   
    // Put entry of admin user in invitation table
    
    const item2 = {
      userId: userId,
      teamId: teamId,
      invitationId: randomToken,
      // receiverEmail: email,
      invitationStatus: 'accept',
      isAdmin:'true'
    };
    const params2 = {
      TableName: 'Invitation',
      Item: item2
    };
    try {
      await dynamo.put(params2).promise();
      console.log('Item put successfully:123');
    } catch (err) {
      console.error('Error putting item into DynamoDB:', err);
    }


    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify('Hello from Lambda!'),
    };

    return response;
    
    
  } 
  catch (err) {
    statusCode = '400';
    body = err.message;
  } 
  finally {
    body = JSON.stringify(body);
  }

  // return response;
};
