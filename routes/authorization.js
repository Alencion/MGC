var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt');
var {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var {User} = require('../models');
var {tmpUser} = require('../models');
//var asyncc = require('async');
//var crypto = require('crypto');
//var nodemailer = require('nodemailer');


var router = express.Router();

/* GET SignIn, SignUp page. */
router.get('/signin', function (req, res, next) {
    res.render('signin',{
        loginError:req.flash('loginError'),
    });
});
router.get('/signup', function (req, res, next) {
    res.render('signup',{
        signError:req.flash('signError'),
    });
});
router.get('/signout', isLoggedIn, (req, res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
});
router.get('/signout', isLoggedIn, (req, res)=>{
    req.logout();
req.session.destroy();
res.redirect('/');
});

/* POST SignIn, SignUp page. */
router.post('/signin', isNotLoggedIn, (req, res, next)=>{
    passport.authenticate('local', (authError, user ,info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            req.flash('loginError',info.message);
            return res.redirect('/auth/signin');
        }
        return req.login(user, (loginError)=>{

            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
    //res.redirect('/');
});


router.post('/signup',isNotLoggedIn, async(req, res, next)=>{
    var {client_id, client_pw, name, e_mail} = req.body;
    try {
        var exUser = await User.find({where: {client_id}});
        if (exUser) {
            req.flash('signError', '이미 가입된 아이디입니다.');
            return res.redirect('/auth/signup');
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
         console.error(error);
         return next(error);
    }
    res.send('POST request to the homepage');
});
// Forgot Password
router.get('/lostpw', function (req, res, next) {
    res.render('lostpw',{
        user:req.user
    });
});
router.get('/reset', function(req, res, next){
    console.log(tmpUser.client_id);
    res.render('reset',{
        user:req.user
    });

});

router.post('/lostpw',isNotLoggedIn,  async (req, res, next)=> {
    try {
        exUser = await User.find({where: {e_mail: req.body.e_mail}});
        //console.log(exUser);
        if (!exUser) {
            req.flash('loginError', '존재하지 않는 계정입니다.');
            return res.redirect('/auth/signin');
        }
        tmpUser = exUser;
        return res.redirect('/auth/reset');
    }catch(error){
        console.error(error);
        return next(error);
    }(req,res,next);
});
router.post('/reset', isNotLoggedIn, async(req,res,next)=>{
    try {
        if (!tmpUser) {
            req.flash('loginError', '삐용삐용 에러입니다');
            return res.redirect('/auth/signin');
        }
        var hash = await bcrypt.hash(req.body.password, 12);
        User.update({
            client_pw:hash,
        },{
            where:{id:tmpUser.id},
        });
        req.flash('loginError', '비밀번호가 성공적으로 변경되었습니다!');
        return res.redirect('/auth/signin');
    }catch(error){
        console.error(error);
        return next(error);
    }
})
/*

router.post('/lostpw', function(req, res, next) {
    asyncc.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        async function(token, done) {
            //const exUser = await User.findOne({where:{e_mail:req.body.e_mail}});
             exUser = await User.findOne({where:{ e_mail: req.body.e_mail }})
                .then((user) => {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/lostpw');
                }
                //console.log('\nbb\n');
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save(function(err) {
                    done(err, token, exUser);
                });
            });
            console.log(exUser);
        },
        function(token, exUser , done) {
            //console.log(exUser);
            var smtpTransport = nodemailer.createTransport( {
                service: 'Gmail',
                auth: {
                    user: 'nodejsrinha7@gmail.com',
                    pass: 'qwe15987*'
                }
            });
            var mailOptions = {
                to: exUser.e_mail,
                from: 'nodejsrinha7@gmail.com',
                subject: 'Steam Community Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('info', 'An e-mail has been sent to ' + exUser.e_mail + ' with further instructions.');
                done(err, 'info');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/lostpw');
    });
});
router.get('/reset:/token', function(req, res){
    User.findOne({resetPasswordToken : req.params.token, resetPasswordExpires: {$gt : Date.now()}}, function(err, user){
        if(!user){
            req.flash('error', 'Password reset token is invalid or has expired');
            return res.redirect('/lostpw');
        }
        res.render('reset',{
            user:req.user
        });
    });
});
router.post('/reset/:token', function(req, res) {
    asyncc.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                    req.logIn(user, function(err) {
                        done(err, user);
                    });
                });
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'SendGrid',
                auth: {
                    user: '!!! YOUR SENDGRID USERNAME !!!',
                    pass: '!!! YOUR SENDGRID PASSWORD !!!'
                }
            });
            var mailOptions = {
                to: user.e_mail,
                from: 'passwordreset@demo.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.e_mail + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
               req.flash('success', 'Success! Your password has been changed.');
               done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
});

*/


module.exports = router;
