
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  const userId = requestBody.userId;
  const teamId = requestBody.teamId;
  const mainUserId = requestBody.mainUserId;
  
console.log("userId "+userId)
console.log("teamId "+teamId)
console.log("mainUserId "+mainUserId)

  try {
    
     const checkAdminParams = {
      TableName: 'Invitation',
      FilterExpression: 'teamId = :teamId AND userId = :mainUserId',
      ExpressionAttributeValues: {
        ':teamId': teamId,
        ':mainUserId': mainUserId
      }
    };

    const checkAdminResult = await dynamo.scan(checkAdminParams).promise();
    const item = checkAdminResult.Items;
    if(item.length===0){
       const response = {
        statusCode: 404,
        body: JSON.stringify({ error: 'Admin not there' })
      };

      return response;
    }
    else{
      if(item[0].isAdmin ==='false'){
        const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({ message: 'User is not admin' })
    };

    return response;

      }
      console.log(item+"item")
    }
    
    const scanParams = {
      TableName: 'Invitation',
      FilterExpression: 'teamId = :teamId AND userId = :userId',
      ExpressionAttributeValues: {
        ':teamId': teamId,
        ':userId': userId
      }
    };

    const scanResult = await dynamo.scan(scanParams).promise();
    const invitations = scanResult.Items;

    if (invitations.length === 0) {
      const response = {
        statusCode: 404,
        body: JSON.stringify({ error: 'Invitation not found' })
      };

      return response;
    }

    const deletePromises = invitations.map(invitation => {
      const deleteParams = {
        TableName: 'Invitation',
        Key: {
          invitationId: invitation.invitationId
        }
      };
      return dynamo.delete(deleteParams).promise();
    });

    await Promise.all(deletePromises);
     const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({ message: 'Invitations deleted successfully' })
    };

    return response;

    // const response = {
    //   statusCode: 200,
    //   body: JSON.stringify({ message: 'Invitations deleted successfully' })
    // };

    // return response;
  } catch (error) {
    console.error('Error:', error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete invitations' })
    };

    return response;
  }
};
