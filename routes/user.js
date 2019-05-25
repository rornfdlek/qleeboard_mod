const express = require('express')
const router = express.Router()
const models = require('../models')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const returnJwt = function (result, secret) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        _id: result.dataValues.user_srl,
        _nickname: result.dataValues.user_nickname,
        _email: result.dataValues.email_address,
        mod: result.dataValues.is_admin ? 1 : 2
      },
      secret,
      {
        expiresIn: '180d',
        issuer: 'Q.lee',
        subject: 'userInfo'
      },
      (err, token) => {
        if (err) reject(err)
        resolve(token)
      }
    )
  })
}

// POST 유저 등록
router.post('/', (req, res, next) => {
  const body = req.body

  console.log(body)

  const secret = req.app.get('jwt-secret')
  const inputPassword = body.password
  const salt = Math.round((new Date().valueOf() * Math.random())) + ''
  const hashPassword = crypto.createHash('sha512').update(inputPassword + salt).digest('hex')

  models.User.create({
    user_id: body.user_id ? body.user_id : body.email_address,
    email_address: body.email_address,
    password: hashPassword,
    user_nickname: body.user_nickname,
    salt: salt
  }).then((result) => {
    returnJwt(result, secret)
      .then((token) => {
        res.json({
          user_id: result.dataValues.user_id,
          user_nickname: result.dataValues.user_nickname,
          email_address: result.dataValues.email_address,
          message: '로그인에 성공하였습니다.',
          token
        })
      })
  }).catch((error) => {
    res.status(403).json({
      message: '회원가입에 실패하였습니다.',
      error: error
    })
  })
})

// GET 유저 정보 보기
// PUT 유저 정보 수정
// DELETE 유저 정보 삭제
router.route('/data/:user_id')
  .get((req, res, next) => { // 보기
    const userId = req.params.user_id

    models.User.find({
      attributes: ['user_srl', 'user_id', 'email_address', 'user_nickname', 'user_color', 'last_login'],
      where: { user_id: userId }
    }).then((result) => {
      if (result !== null) {
        res.json({
          message: 'success',
          result
        })
      } else {
        res.json({
          message: 'no data',
          result
        })
      }
    }).catch((err) => {
      res.status(403).json({
        message: 'error',
        error: err.message
      })
    })
  })
  .put((req, res, next) => { // 수정

  })
  .delete((req, res, next) => { // 삭제

  })

module.exports = router
