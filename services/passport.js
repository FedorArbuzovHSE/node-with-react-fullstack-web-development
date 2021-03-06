const passport = require('passport')
const GoogleStartegy = require('passport-google-oauth20').Strategy

const mongoose = require('mongoose')

User = mongoose.model('users')

const keys = require('../config/keys')


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                done(null, user)
            })
})

passport.use(new GoogleStartegy({
        clientID: keys.googleClientId,
        clientSecret: keys.clientSecret,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)
        console.log('profile', profile)

        User.findOne({googleId: profile.id})
            .then(existingUser =>{
                if(existingUser){
                    done(null, existingUser)
                }
                else{
                    new User({ googleId: profile.id})
                        .save()
                        .then(user => done(null, user))
                }
            })


    }
))