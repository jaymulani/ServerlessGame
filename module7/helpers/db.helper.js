const { DynamoDBClient,
    CreateTableCommand,
    DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    DeleteCommand,
    ScanCommand,

} = require("@aws-sdk/lib-dynamodb");
const helper = require('./helper')
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const describeTable = async (tableName) => {
    try {
        let params = { TableName: tableName }
        await client.send(new DescribeTableCommand(params))
    } catch (error) {
        throw error;
    }
}

const createDynamoDBTable = async (tableName) => {
    try {
        let params = {
            TableName: tableName,
            AttributeDefinitions: [
                {
                    AttributeName: "id",
                    AttributeType: "S"
                }],
            KeySchema: [
                {
                    AttributeName: "id",
                    KeyType: "HASH"
                }
            ],
            BillingMode: "PAY_PER_REQUEST"

        }
        await client.send(new CreateTableCommand(params));
        console.log('Table created:', tableName);
    } catch (error) {
        console.error('Error creating table:', error);
        throw error;
    }
}

const getItem = (tableName, id) => {
    const params = {
        TableName: tableName,
        Key: {
            id: id,
        },
    };
    return dynamoDbClient.send(new GetCommand(params))
}

const putItem = (tableName, body) => {
    const params = {
        TableName: tableName,
        Item: body,
    };

    return dynamoDbClient.send(new PutCommand(params))
}

const deleteItem = (tableName, id) => {
    const params = {
        TableName: tableName,
        Key: {
            id: id
        }
    }
    return dynamoDbClient.send(new DeleteCommand(params))
}

const filter = async (tableName, filter) => {
    console.log(tableName)
    try {
        let params = await helper.getAllItemsWithFilter(filter, tableName)
        console.log(JSON.stringify(params))
        const result = await dynamoDbClient.send(new ScanCommand(params))
        console.log(result)
        return result.Items;
    } catch (error) {
        console.error('Error retrieving items from DynamoDB:', error);
        throw error;
    }
}

module.exports = {
    getItem,
    putItem,
    deleteItem,
    filter,
    describeTable,
    createDynamoDBTable
};
