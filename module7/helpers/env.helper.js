const config = require("../config/config.json")
global.appName = process.env.APP_NAME || config.appName
global.components = process.env.COMPONENT_LIST || config.components
