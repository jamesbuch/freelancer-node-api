require('dotenv').config()

const express = require('express')
const path = require('path')
const cors = require('cors')
const argon2 = require('argon2')
const helmet = require('helmet')
const passport = require('passport')
const JWTstrategy = require('passport-jwt').Strategy
const localStrategy = require('passport-local').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const prisma = require('./prismaclient')

const { body, validationResult } = require('express-validator')
const { memcached } = require('./memcache')

const app = express()

if (process.env.NODE_ENV === 'production') {
	app.use(helmet)
}

app.use(express.json({ limit: process.env.REQUEST_LIMIT || '6mb' }))
app.use(express.urlencoded({ extended: false }))
// app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

// doesn't really matter, just make sure not a privileged port
// and not in use by anything else
const port = process.env.PORT || 3000

// default prefix
const ROUTE_PREFIX = '/api/v1'

app.all('*', function (req, res, next) {
	console.log('Logging application request event...')
	next()
})

passport.use(
	new JWTstrategy(
		{
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
		},
		async (token, done) => {
			try {
				return done(null, token.user)
			} catch (error) {
				done(error)
			}
		}
	)
)

passport.use(
	'signup',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const hash = await argon2.hash(password, { type: argon2.argon2id })
				// Reassigned later
				let user = await prisma.user.findUnique({ where: { email: email } })

				// user already exists on signup
                // Investigate a better way to get message to user that
                // the email used is already taken rather than just "Unauthorized"
				if (user !== null) {
					return done(null, false)
				}

                // Need a way to pass in the freelancer type here, but it's handled fine
                // in the /signup route
				user = await prisma.user.create({ data: { email: email, password_hash: hash, userType: 'freelancer' } })
				return done(null, user)

			}
            catch (error) {
				done(error)
			}
		}
	)
)

passport.use(
	'login',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const user = await prisma.user.findUnique({ where: { email: email } })

				if (!user) {
					return done(null, false, { success: false, message: 'Incorrect email or password' })
				}

				let validate = await argon2.verify(user.password_hash, password)

				if (!validate) {
					return done(null, false, { success: false, message: 'Incorrect email or password' })
				}

				return done(null, user, { success: true, message: 'Logged in successfully' })
			}
            catch (error) {
				return done(error)
			}
		}
	)
)

const preauth = require('./routes/preauth')
app.use(preauth)

// Post routes include categories for posts
const postRoutes = require('./routes/posts')

// Also allow the PATCH /api/v1/user route
const profileRoutes = require('./routes/profile')

// const applicationRoutes = require('./routes/application')
const jobsRoutes = require('./routes/jobs')
const servicesRoutes = require('./routes/services')
// const invoicesRoutes = require('./routes/invoices')
// const ratingsRoutes = require('./routes/ratings')
// const paymentsRoutes = require('./routes/payments')
// const adminRoutes = require('./routes/admin')
// const searchRoutes = require('./routes/search')

// Plug in the JWT strategy as a middleware so only verified users can access this route
// Unprotect /register, /login/, /forgot-password and the default route
app.use(passport.authenticate('jwt', { session: false }), postRoutes)
app.use(passport.authenticate('jwt', { session: false }), profileRoutes)
app.use(passport.authenticate('jwt', { session: false }), jobsRoutes)
app.use(passport.authenticate('jwt', { session: false }), servicesRoutes)

app.get('/', (req, res) => {
	res.json({ info: `Node.js, Express, and MySQL API ENV = ${process.env.NODE_ENV} port ${port}` })
})

app.listen(port, () => {
	console.log(`server listening on port ${port}`)
})
