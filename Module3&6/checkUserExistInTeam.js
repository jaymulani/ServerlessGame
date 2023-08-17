const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const axios = require('axios');


exports.handler = async (event) => {
  const email= event.email;

  try {
    
      const response = await axios.get('https://5r9064zspc.execute-api.us-east-1.amazonaws.com/default/getUsersLambda');
    // const usersData = JSON.parse(response.data);
    console.log(response.data)
// const userExists = response.data.some(user => user.email === email);
    const foundUser = response.data.find(user => user.email === email);

    let exists;
    let uid;
    if(foundUser){
      exists='yes'
      uid=foundUser.userId;
    }
    else{
      exists='no'
      uid=null;
    }
    const responseFinal = {
      statusCode: 200,
      body: JSON.stringify({ exe: exists, id:uid })
    };

console.log("Ex"+responseFinal)

    return responseFinal;
  } catch (error) {
    console.error('Error:', error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to check user existence' })
    };

    // return responseFinal;
  }
};
