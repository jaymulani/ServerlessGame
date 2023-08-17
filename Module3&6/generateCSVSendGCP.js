const AWS = require('aws-sdk');
const axios = require('axios');
const csvParser = require('papaparse');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const dynamodb = new AWS.DynamoDB.DocumentClient();


const tableName = 'Invitation';
const bucketName = 'analysis-data-serverless';
const secretName = 'gcpCred';



async function fetchUserDataFromDynamoDB() {
    const params = {
        TableName: tableName,
    };

    try {
        const data = await dynamodb.scan(params).promise();
        return data.Items;
    } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        throw error;
    }
    }
    
    
async function getSecret() {
    const secretsManager = new AWS.SecretsManager();
    const secretData = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    return JSON.parse(secretData.SecretString);
}

async function uploadToGCS(csvFile) {
    try {
        const serviceAccountKey = await getSecret();
        const storage = new Storage({ credentials: serviceAccountKey });
        const bucket = storage.bucket(bucketName);

        const uniqueFilename = `test.csv`;
        const file = bucket.file(uniqueFilename);

        const buffer = fs.readFileSync(csvFile);

        await file.save(buffer);

        console.log(`File ${uniqueFilename} uploaded to Google Cloud Storage.`);
    } catch (error) {
        console.error('Error uploading to Google Cloud Storage:', error);
        throw error;
    }
}


async function writeToCsv(data) {
    const d=await fetchUserDataFromDynamoDB();
    console.log(d);
    const csvFile = '/tmp/output.csv'; // Use "/tmp/" as Lambda's writable directory
    const { createObjectCsvWriter } = require('csv-writer');
    const csvWriter = createObjectCsvWriter({
        path: csvFile,
        header: [
            { id: 'id', title: 'teamId' },
            { id: 'team_name', title: 'team_name' },
            { id: 'scores', title: 'scores' },
            { id: 'gamesPlayed', title: 'gamesPlayed' },
            { id: 'gameId', title: 'gameId' },
            { id: 'category', title: 'category' },
            { id: 'timeStamp', title: 'time' },
        ],
    });

    try {
        // Write the data to the CSV file
        // console.log(data);
        await csvWriter.writeRecords(data);

        console.log(`Data exported to ${csvFile}.`);
        return csvFile;
    } catch (error) {
        console.error('Error writing to CSV file:', error);
        throw error;
    }
}



async function generateCSV(data) {
  const csv = csvParser.unparse(data);

  return await fs.writeFileSync('testx', csv);
}




exports.handler = async (event) => {
    try {
        const teamsResponse = await axios.get('https://mdlbsby4nd.execute-api.us-east-1.amazonaws.com/dev/teams');
        const gamesResponse = await axios.get('https://mdlbsby4nd.execute-api.us-east-1.amazonaws.com/dev/games');
        const gameTeamsResponse = await axios.get('https://mdlbsby4nd.execute-api.us-east-1.amazonaws.com/dev/gameteams');

        const teamsData = teamsResponse.data;
        const gamesData = gamesResponse.data;
        const gameTeamsData = gameTeamsResponse.data;

        const teamGameMap = {};

        // Loop through gameTeamsData to create a map of team IDs to their corresponding games
        gameTeamsData.forEach((item) => {
            const { gameId, teamId ,timeStamp } = item;
            if (!teamGameMap[teamId]) {
                teamGameMap[teamId] = [];
            }
           
             const game = gamesData.find((game) => game.id === gameId);
    if (game) {
        teamGameMap[teamId].push({ ...game, timeStamp }); 
    }
        });
        
        const csvRows = [];
        teamsData.forEach((team) => {
            const { id, team_name, scores, gamesPlayed } = team;
            const games = teamGameMap[id] || [];


            games.forEach((game) => {
                const { id: gameId, category, difficulty, desc,timeStamp } = game;
                csvRows.push([id, team_name, scores || 0, gamesPlayed || 0, gameId, category,timeStamp]);
            });
        });


        const jsonData = csvRows.map((row) => {
          const [id, team_name, scores, gamesPlayed, gameId, category, timeStamp] = row;
          return {
            id,
            team_name,
            scores: parseInt(scores), 
            gamesPlayed: parseInt(gamesPlayed), 
            gameId,
            category,
            timeStamp
          };
        });

        const csvData = await writeToCsv(jsonData);
               

        // Upload the CSV file to gcp
        await uploadToGCS(csvData);


        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'CSV data generated successfully' }),
        };
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate CSV data' }),
        };
    }
};
