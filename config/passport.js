const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

require('dotenv').config();

const User = mongoose.model('users');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        proxy: true
    },
        (accessToken, refreshToken, profile, done) => {
            const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.FamilyName,
                email: profile.emails[0].value,
                image: image
            }

            User.findOne({
                googleID: profile.id
            }).then(user => {
                if (user) {
                   done(null, user);
                } else {
                    new User(newUser)
                        .save()
                        .then(user => done(null, user));
                }
            })
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user));
    });
}