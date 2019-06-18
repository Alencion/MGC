/*Login Strategy라고 불리는, 로그인 전략에 관한 모듈입니다.
* db에서 입력된 정보를 통해 user를 찾고, id가 존재하지 않는 경우, 비밀번호가 틀린 경우, login성공 3가지에 대한 전략을 다룹니다.*/

var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'client_id',
        passwordField: 'client_pw',
    }, async (client_id, client_pw, done) => {
        try {
            var exUser = await User.findOne({ where: { client_id } }); // 입력된id를 통해 db를 조회합니다.
            if (exUser) {
                var result = await bcrypt.compare(client_pw, exUser.client_pw); // 존재한다면, 암호화된 pwd를 풀어옵니다.
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' }); // 비밀번호의 일치여부를 확인. 틀렸다면 메세지 표시
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' }); // db에 id가 존재하지 않는다면, 메시지 표시.
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
