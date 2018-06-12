const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

require('dotenv').config();

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        proxy: true
      },
      (accessToken, refreshToken, profile, cb) => {
        console.log(accessToken);
        console.log(profile);
      }
    ));
}