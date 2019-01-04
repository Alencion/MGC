var express = require('express');
var router = express.Router();

/* GET article, write page. */
router.get('/', function (req, res, next) {
    res.render('article');
});
router.get('/write', function (req, res, next) {
    res.render('write');
});
/* POST write page. */
router.post('/write', function (req, res, next) {
    res.send('POST request to the homepage');
});

module.exports = router;
