const AWS = require('aws-sdk');
const navigationTable = process.env.NAVIGATION_TABLE || "trivia.navigations"
const teamScoreTable = process.env.TEAM_SCORE_TABLE || "trivia.teams"
exports.handler = async (event) => {
    let intent = event.currentIntent
    let response_message = ""
    console.log(event)
    if (intent.name === "navigation") {
        let value = await fetch(navigationTable, "page", intent.slots.page)
        response_message = value?`here you with the navigation for ${intent.slots.page} - ${value.link}`:"Unable to find the page you are looking for"
    } else if (intent.name === "teamScore") {
        let value = await fetch(teamScoreTable, "team_name", intent.slots.teamName)
        response_message = value?`${intent.slots.teamName} scored ${value.score}`:"Unable to find the team!"
    }

    return {
        "dialogAction": {
            "type": "Close",
            "fulfillmentState": "Fulfilled",
            "message": {
                "contentType": "PlainText",
                "content": response_message
            }
        }
    }
};

const fetch = async (tableName, key, value) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const filterExpression = `${key} = :value`;
    const expressionAttributeValues = {
        ":value": value
    };

    try {
        const response = await dynamoDB.scan({
            TableName: tableName,
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttributeValues
        }).promise();

        return response.Items[0];

    } catch (error) {
        console.log("Error while fetching for ",error)
    }
}
