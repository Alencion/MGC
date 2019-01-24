var express = require('express');
var router = express.Router();

/* GET **** listing. */
router.get('/', function (req, res, next) {
    req.send('respond');
});

module.exports = router;
