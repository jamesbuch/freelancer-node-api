const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const prisma = require('../prismaclient')

const router = express.Router()

router.post(
    '/api/v1/signup',
    passport.authenticate('signup', { session: false, failureMessage: true }),

    async (req, res) => {
        
        let user = req.user

        // This is a hack to change to the requested account type on signup
        if (req.body.accountType) {
            let updateData = {}

            // Ensure it's freelancer, client, or agency only
            updateData.userType = req.body.accountType
            
            if (req.body.name) {
                updateData.name = req.body.name
            }

            user = await prisma.user.update({
                where: {
                    id: req.user.sub
                },
                update: {
                    ...updateData
                }
            })
        }

        res.json({
            success: true,
            message: 'Signup successful',
            user: user
        })
})

// TODO: refresh token before it expires in 30 minutes from login?
// Just get rid of the secret/key from memcached, that way the token cannot be verified
router.post(
    '/api/v1/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        return next(err)
                    }

                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error)

                            const milliseconds = Date.now()
                            const three_hours = milliseconds + 10800000
                            const body = { sub: user.id, iss: 'larahelpers.com', email: user.email, iat: milliseconds, exp: three_hours }
                            const token = jwt.sign({ user: body }, process.env.JWT_SECRET)

                            return res.json({ token })
                        }
                    )
                }
                catch (error) {
                    return next(error)
                }
            }
        )(req, res, next)
    }
)

module.exports = router
