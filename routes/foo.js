var router = require('express').Router();

router.get('/', (req, res, next) => {
    res.render('foo', {
        title: 'foo | Simple Node App',
        _class: 'foo'
    });
});

module.exports = router;