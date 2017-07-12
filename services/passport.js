const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const passport = require('passport');

const config = require('../config');
const User = require('../models/user');

// Create local Strategy
const localOption = {
  usernameField: 'email'
};
const localLogin = new LocalStrategy(localOption, function (email, password, done) {
  // Verify these username and password, call done with username if they are correct
  //otherwise call done with false
  User.findOne({email: email}, function (err, user) {
    if (err) {return done(err, false);}
    if (!user) {
      return done(null, false);
    }

    // Compare password
    user.comparePassword(password, function (err, isMatch) {
      if (err) {return done(err, false);}
      if (!isMatch) {return done(null, false);}

      return done(null, user);
    });
  });
});


// Set up options for Jwt Strategy
const jwtOption = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};
// Create JwtStrategy
const jwtLogin = new JwtStrategy(jwtOption, function (payload, done) {
  // See if user ID in the payload exist in the database
  // If it does, call done with that user
  // If not, call done without user
  User.findById(payload.sub, function (err, user) {
    if (err) {return done(err, false);}

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use strategy
passport.use(jwtLogin);
passport.use(localLogin);
