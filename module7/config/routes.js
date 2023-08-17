const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')
const componentList = global.components
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now(), ' - ', req);
    next();
});

const createRoutes = (componentName) => {
    controller.createTable(`trivia.${componentName}s`)
    router.get(`/${componentName}/:id`, (req, res) => controller.get(req, res, componentName))
    router.get(`/${componentName}s`, (req, res) => controller.getAll(req, res, componentName))
    router.post(`/${componentName}`, (req, res) => controller.create(req, res, componentName))
    router.put(`/${componentName}/:id`, (req, res) => controller.update(req, res, componentName))
    router.get(`/${componentName}/delete/:id`, (req, res) => controller.remove(req, res, componentName))
}

componentList.map(component => {
    console.log(`creating table and routes for ${component}`)
    createRoutes(component)
})

module.exports = router;
