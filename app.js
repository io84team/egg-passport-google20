

const debug = require('debug')('egg-passport-google')
const assert = require('assert')
const Strategy = require('passport-google-oauth20').Strategy

module.exports = app => {
    const config = app.config.passportGoogle20
    config.passReqToCallback = true
    assert(config.key, '[egg-passport-google] config.passportGoogle20.key required')
    assert(config.secret, '[egg-passport-google] config.passportGoogle20.secret required')
    config.clientID = config.key
    config.clientSecret = config.secret
    // must require `req` params
    app.passport.use('google', new Strategy(config, (req, accessToken, refreshToken, params, profile, done) => {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value
        const photo = profile.photos && profile.photos[0] && profile.photos[0].value
        const name = email.split('@')[0]
        // format user
        const user = {
            provider: 'google',
            id: profile.id,
            email,
            givenName: name,
            familyName: '',
            displayName: profile.displayName || name,
            photo,
            accessToken,
            refreshToken,
            params,
            profile,
        }
        debug('%s %s get user: %j', req.method, req.url, user)

        // let passport do verify and call verify hook
        app.passport.doVerify(req, user, done)
    }))
}
