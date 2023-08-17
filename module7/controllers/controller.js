const uuid = require('uuid')
const appName = global.appName
const { getItem, putItem, deleteItem, filter, describeTable, createDynamoDBTable } = require('../helpers/db.helper')

const get = async (req, res, componentName) => {
    let tableName = `${appName}.${componentName}s`
    try {
        const { Item } = await getItem(tableName, req.params.id)
        if (Item) {
            res.json(Item);
        } else {
            res
                .status(404)
                .json({ error: `Could not find ${componentName} with provided id - ${req.params.id}` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: `Could not retreive ${componentName} with provided id - ${req.params.id}` });
    }
}

const create = async (req, res, componentName) => {
    let tableName = `${appName}.${componentName}s`
    const body = { ...req.body, id: uuid.v4() };
    try {
        await putItem(tableName, body)
        res.json(body);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: `Could not create ${componentName}` });
    }
};


const update = async (req, res, componentName) => {
    let tableName = `${appName}.${componentName}s`
    const body = req.body;
    try {
        const { Item } = await getItem(tableName, req.params.id)
        if (Item) {
            await putItem(tableName, { ...Item, ...body })
            res.json({ message: `update to ${componentName} successful` })
        } else {
            res
                .status(404)
                .json({ error: `Could not find ${componentName} with provided id - ${req.params.id}` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: `Could not update ${componentName} with provided id - ${req.params.id}` });
    }
};

const remove = async (req, res, componentName) => {
    let tableName = `${appName}.${componentName}s`
    try {
        await deleteItem(tableName, req.params.id)
        res.json({ message: `Deleteion of the ${componentName} with provided id - ${req.params.id}` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: `Could not remove ${componentName} with provided id - ${req.params.id}` });
    }
}

const getAll = async (req, res, componentName) => {
    let tableName = `${appName}.${componentName}s`
    try {
        console.log(JSON.stringify(req.query))
        const resp = await filter(tableName, req.query)
        if (resp) {
            res.json(resp);
        } else {
            res
                .status(404)
                .json({ error: `Could not find ${componentName} with provided filter - ${JSON.stringify(req.query)}` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: `Could not retreive ${componentName} with provided filter - ${JSON.stringify(req.query)}` });
    }
}

const createTable = async (tableName) => {
    try {
        await describeTable(tableName);
        console.log('Table already exists:', tableName);
    } catch (error) {
        if (error.name === 'ResourceNotFoundException') {
            console.log(`Table ${tableName} does not exist, creating...`);
            await createDynamoDBTable(tableName);
        } else {
            console.error('Error describing table:', error);
            throw error;
        }
    }
}

module.exports = {
    get,
    create,
    update,
    remove,
    getAll,
    createTable
}
