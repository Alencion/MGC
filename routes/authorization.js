var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt');
var {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var {User} = require('../models');

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
router.post('/signup',isNotLoggedIn, async(req, res, next)=>{
    var {client_id, client_pw, name, e_mail} = req.body;
    try {
        var exUser = await User.find({where: {client_id}});
        if (exUser) {
            req.flash('signError', '이미 가입된 아이디입니다.');
            return res.redirect('/signup');
        }
        var hash = await bcrypt.hash(client_pw, 12);
        await User.create({
            client_id,
            client_pw: hash,
            name,
            e_mail,
        });
        return res.redirect('/');
    }
    catch(error){
    //     console.error(error);
    //     return next(error);
    }
    res.send('POST request to the homepage');
});

module.exports = router;
