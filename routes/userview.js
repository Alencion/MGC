var express = require('express');
var router = express.Router();

/* GET UserView page. */
router.get('/', function (req, res, next) {
    res.render('mypage');
});

module.exports = router;
