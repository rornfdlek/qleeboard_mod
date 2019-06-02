let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
let config = require('./config/config.json')
let history = require('connect-history-api-fallback')

let app = express()

// use history mode setting
app.use(history({
  verbose: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'client/dist')))

app.use('/upload', express.static('upload'))

// custom setting start
const apiRouter = require('./routes/api')

// jwtauth를 위한 세팅
const secretkey = config['JWT_SECRET']

// admin password
const adminPW = config['ADMIN_PASSWORD']

// set the secret key variable for jwt
app.set('jwt-secret', secretkey)

// set the secret key variable admin
app.set('admin-password', adminPW)

app.use('/api', apiRouter)

// custom setting end

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
