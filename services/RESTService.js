/**
 * Async REST API server
 */
var router = require('express').Router();
var DishesService = require('../services/DishesService');

router.post('/add', (req, res, next) => {
    DishesService.on('add', (req.body), (err, dish, data) => {
        res.send(data);
    });
});

router.put('/update', (req, res, next) => {
    DishesService.on('update', (req.body), (err, dish, data) => {
        res.send(data);
    });
});

router.delete('/remove', (req, res, next) => {
    DishesService.on('remove', (req.body), (err, dish, data) => {
        res.send(data);
    });
});

module.exports = router;