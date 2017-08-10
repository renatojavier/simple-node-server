var router = require('express').Router();
var DishesService = require('../services/DishesService');

router.get('/', (req, res, next) => {
    // Call list `Dish` member from the imported model
    DishesService.on('list', null, (err, dishes) => {
        // render view
        res.render('dishes', {
            title: 'Dish Menu | Simple Node App',
            dishes: dishes,
            _class: 'dishes'
        });
    });
});

router.get('/:action', (req, res, next) => {
    var page = req.params.action;
    if( page !== 's' ){
        res.render(page, {
            title: `${page.toLowerCase()} | Simple Node App`,
            _class: page.toLowerCase()
        });
    }
    next();
});

router.get('/:action/:specific', (req, res, next) => {
    var id = req.params.specific;
    const page = 'update';

    DishesService.on('list', { '_id': id }, (err, dish) => {
        if( err ) throw new Error('Error rendering specific dish page');
        
        res.render('update', {
            title: `${page.toLowerCase()} | Simple Node App`,
            dish: dish[0],
            _class: page.toLowerCase()
        });
    });
});

module.exports = router;