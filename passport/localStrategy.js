var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'client_id',
        passwordField: 'client_pw',
    }, async (client_id, client_pw, done) => {
        try {
    var exUser = await User.find({ where: { client_id } });
    if (exUser) {
        var result = await bcrypt.compare(client_pw, exUser.client_pw);
        if (result) {
            done(null, exUser);
        } else {
            done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
    } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
    }
} catch (error) {
        console.error(error);
        done(error);
    }
}));
};
