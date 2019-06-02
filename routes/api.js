const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const models = require('../models')
const multer = require('multer')
const crypto = require('crypto')

const verifyToken = (req, token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      resolve({
        _srl: 'guest',
        _nickname: '손님',
        _email: '',
        mod: 3
      }) // 토큰이 없으면 게스트
    }
    if (token.length < 10) {
      resolve({
        _srl: 'guest',
        _nickname: '손님',
        _email: '',
        mod: 3
      })
    } // 잘못된 토큰이면 게스트
    jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
      if (err) reject(err)
      resolve(decoded)
    })
  })
}

/* Route 시작 */
router.all('*', (req, res, next) => { // 토큰 검사
  const token = req.headers['x-access-qlee-token'] || req.query.token
  verifyToken(req, token)
    .then((verify) => {
      req.user = verify
      next()
    })
    .catch((err) => {
      res.status(403).json({
        message: 'verify error',
        error: err.message
      })
    })
})

router.use('/board', require('./board'))
router.use('/auth', require('./auth'))
router.use('/user', require('./user'))
router.use('/sign', require('./sign'))
router.use('/admin', require('./admin'))
router.use('/upload', require('./upload'))

module.exports = router
