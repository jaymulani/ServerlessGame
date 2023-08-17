async function getAllItemsWithFilter(filterAttributes, tableName) {
    if (!Object.keys(filterAttributes).length) {
        return {
            TableName: tableName
        }
    }
    const filterExpressionParts = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    Object.keys(filterAttributes).forEach((attribute, index) => {
        const placeholder = `:val${index}`;
        filterExpressionParts.push(`#${attribute} = ${placeholder}`);
        expressionAttributeNames[`#${attribute}`] = attribute;
        expressionAttributeValues[placeholder] = filterAttributes[attribute];
    });

    const filterExpression = filterExpressionParts.join(' AND ');

    let params = {
        FilterExpression: filterExpression,
        ExpressionAttributeNames: expressionAttributeNames,//getExpressionAttributeNames(filterAttributes),
        ExpressionAttributeValues: expressionAttributeValues
    };
    params = { ...params, TableName: tableName }
    return params

}

module.exports = {
    getAllItemsWithFilter
}
