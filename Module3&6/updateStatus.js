const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
AWS.config.update({ region: 'us-east-1' });

exports.handler = async (event, context) => {
  const token = event.queryStringParameters.token;
  const status = event.queryStringParameters.status;
  console.log(token+ " "+ status)
  try {
    const params = {
      TableName: 'Invitation',
      Key: {
        'invitationId':token,
      },
      UpdateExpression: 'set invitationStatus = :t',
      ExpressionAttributeValues: {
        ':t': status,
      },
    };

    const result = await docClient.update(params).promise();
    console.log('Success', result);
  } catch (err) {
    console.log('Error', err);
    // Handle the error appropriately
  }

  return {
    statusCode: 200,
    body: 'Update completed',
  };
};
