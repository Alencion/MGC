var express = require('express');
var router = express.Router();

/* GET SignIn, SignUp page. */

router.get('/signin', function (req, res, next) {
    res.render('signin');
});
router.get('/signup', function (req, res, next) {
    res.render('signup');
});

/* POST SignIn, SignUp page. */
router.post('/signin', function (req, res, next){
    res.send('POST request to the homepage');
});
router.post('/signup', function (req, res, next){
    res.send('POST request to the homepage');
});

module.exports = router;
