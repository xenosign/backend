const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoClient = require('./mongo');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      async (id, password, done) => {
        const client = await mongoClient.connect();
        const userCursor = client.db('kdt1').collection('users');
        const idResult = await userCursor.findOne({ id });
        if (idResult !== null) {
          const result = await userCursor.findOne({
            id,
            password,
          });
          if (result !== null) {
            done(null, result);
          } else {
            done(null, false, { message: '비밀번호가 다릅니다.' });
          }
        } else {
          done(null, false, { message: '해당 id 가 없습니다.' });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const client = await mongoClient.connect();
    const userCursor = client.db('kdt1').collection('users');
    const result = await userCursor.findOne({ id });
    if (result) done(null, result);
  });
};
