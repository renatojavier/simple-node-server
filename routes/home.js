var router = require('express').Router();

router.get('/', (req, res, next) => {
    res.render('home', {
        title: 'Home | Simple Node App',
        _class: 'home'
    });
});

module.exports = router;