var express = require('express');
var router = express.Router();
var {User} = require('../models');

/* GET article, write page. */
router.get('/id=:id' , function (req, res, next) {
    if(req.isAuthenticated()) {
        User = req.user;
    }
    res.render('article',{
        isSignedIn: req.isAuthenticated(),
        isNotSignedIn: !req.isAuthenticated(),
        username : User.name,
    });
});
router.get('/write', function (req, res, next) {
    if(req.isAuthenticated()) {
        User = req.user;
    }
    res.render('write', {
        isSignedIn: req.isAuthenticated(),
        isNotSignedIn: !req.isAuthenticated(),
        username : User.name,
    });
});
/* POST write page. */
router.post('/write', function (req, res, next) {
    res.send('POST request to the homepage');
});

module.exports = router;
