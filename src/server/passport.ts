import {Express} from 'express'
import {IUserFields, UserModel} from './user'
import {compareHashed} from './utils'

const passport = require('passport')
const Strategy = require('passport-local')

export function configurePassport(app: Express) {
    passport.use(
        new Strategy(
            {
                usernameField: 'name',
                passwordField: 'password'
            },
            async function(username, password, done) {
                let user: IUserFields
                try {
                    user = await UserModel.findOne({name: username})
                    if (!user) {
                        return done(null, false, {message: 'wrong username'})
                    }
                    if (await compareHashed(password, user.password)) {
                        return done(null, user)
                    } else {
                        return done(null, false, {message: 'wrong password'})
                    }
                } catch (err) {
                    return done(null, err)
                }
            }
        )
    )

    passport.serializeUser(function(user, done) {
        done(null, user._id)
    })

    passport.deserializeUser(async function(id, done) {
        try {
            const user = await UserModel.findById(id)
            done(null, user)
        } catch (err) {
            done(err)
        }
    })

    app.use(passport.initialize())
    app.use(passport.session())
}
