var express = require('express');
var router = express.Router();
var {User} = require('../models');

/* GET board page. */
router.get('/', function (req, res, next) {
    if(req.isAuthenticated()) {
        User = req.user;
    }
    res.render('board',{
        title : '자유게시판',
        isSignedIn: req.isAuthenticated(),
        isNotSignedIn: !req.isAuthenticated(),
        username : User.name,
    });
});
router.get('/university', function (req, res, next) {
    if(req.isAuthenticated()) {
        User = req.user;
    }
    res.render('board',{
        title : '대학게시판',
        isSignedIn: req.isAuthenticated(),
        isNotSignedIn: !req.isAuthenticated(),
        username : User.name,
    });
});

module.exports = router;
