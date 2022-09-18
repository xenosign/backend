const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const NaverStrategy = require('passport-naver').Strategy;

const mongoClient = require('./mongo');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      async (id, password, cb) => {
        const client = await mongoClient.connect();
        const userCursor = client.db('kdt1').collection('users');
        const result = await userCursor.findOne({ id });
        if (result !== null) {
          if (result.password === password) {
            cb(null, result);
          } else {
            cb(null, false, { message: '비밀번호가 다릅니다.' });
          }
        } else {
          cb(null, false, { message: '해당 id 가 없습니다.' });
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_CLIENT,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL: process.env.FB_CB_URL,
      },
      async (accessToken, refreshToken, profile, cb) => {
        const client = await mongoClient.connect();
        const userCursor = client.db('kdt1').collection('users');
        const result = await userCursor.findOne({ id: profile.id });
        if (result !== null) {
          cb(null, result);
        } else {
          const newFBUser = {
            id: profile.id,
            name: profile.displayName,
            provider: profile.provider,
          };
          const dbResult = await userCursor.insertOne(newFBUser);
          if (dbResult.acknowledged) {
            cb(null, newFBUser);
          } else {
            cb(null, false, { message: '페북 회원 생성 에러' });
          }
        }
      }
    )
  );

  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: process.env.NAVER_CB_URL,
      },
      async (accessToken, refreshToken, profile, cb) => {
        const client = await mongoClient.connect();
        const userCursor = client.db('kdt1').collection('users');
        const result = await userCursor.findOne({ id: profile.id });
        if (result !== null) {
          cb(null, result);
        } else {
          console.log(profile.displayName);
          const newNaverUser = {
            id: profile.id,
            name:
              profile.displayName !== undefined
                ? profile.displayName
                : profile.emails[0]?.value,
            provider: profile.provider,
          };
          const dbResult = await userCursor.insertOne(newNaverUser);
          if (dbResult.acknowledged) {
            cb(null, newNaverUser);
          } else {
            cb(null, false, { message: '페북 회원 생성 에러' });
          }
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser(async (id, cb) => {
    const client = await mongoClient.connect();
    const userCursor = client.db('kdt1').collection('users');
    const result = await userCursor.findOne({ id });
    if (result) cb(null, result);
  });
};
