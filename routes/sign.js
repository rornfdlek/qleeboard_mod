const express = require('express')
const router = express.Router()
const models = require('../models')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const returnJwt = function (result, secret) { // 로그인 한 유저 토큰 발급
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        _srl: result.dataValues.user_srl,
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
      })
  })
}

// POST 회원 로그인
router.post('/in', (req, res, next) => {
  const body = req.body
  const secret = req.app.get('jwt-secret')

  models.User.findOne({
    where: { email_address: body.email_address }
  })
    .then(result => {
      let dbPassword = result.dataValues.password
      let inputPassword = body.password
      let salt = result.dataValues.salt
      let hashPassword = crypto.createHash('sha512').update(inputPassword + salt).digest('hex')

      if (dbPassword === hashPassword) {
        returnJwt(result, secret)
          .then((token) => {
            res.json({
              user_srl: result.dataValues.user_srl,
              user_nickname: result.dataValues.user_nickname,
              email_address: result.dataValues.email_address,
              mod: result.dataValues.is_admin ? 1 : 2,
              message: '로그인에 성공했습니다',
              token
            })
          })
      } else {
        res.status(403).json({
          message: '비밀번호가 일치하지 않습니다.'
        })
      }
    })
    .catch((err) => {
      res.status(403).json({
        message: '등록되지 않은 아이디입니다.',
        error: err.message
      })
    })
})

// POST jwt 회원 로그인
router.post('/jwt', async (req, res, next) => {
  try {
    const user = req.user
    const result = await models.User.findOne({ where: { email_address: user._email } })
    const secret = req.app.get('jwt-secret')

    const token = await returnJwt(result, secret)
    res.json({
      user_srl: result.dataValues.user_srl,
      user_nickname: result.dataValues.user_nickname,
      email_address: result.dataValues.email_address,
      mod: result.dataValues.is_admin ? 1 : 2,
      message: '로그인에 성공했습니다',
      token
    })
  } catch (err) {
    console.log(err)
    res.status(403).json({
      message: '자동로그인에 실패했습ㄴ디ㅏ',
      error: err.message
    })
  }
})

// POST 유저 등록
router.post('/up', (req, res, next) => {
  const body = req.body

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
          user_srl: result.dataValues.user_srl,
          user_nickname: result.dataValues.user_nickname,
          email_address: result.dataValues.email_address,
          mod: result.dataValues.is_admin ? 1 : 2,
          message: '회원가입에 성공하였습니다.',
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

// POST 회원가입
router.post('/up/google', (req, res, next) => {

})

// DELETE 회원 삭제
router.delete('/out', async (req, res, next) => {
  try {
    const user = req.user
    const result = await models.User.destroy({ where: { email_address: user._email } })
    res.json({
      message: '회원 탈퇴에 성공했습니다'
    })
  } catch (e) {
    res.status(403).json({
      message: '회원 탈퇴에 실패했습니다',
      error: e.message
    })
  }
})

module.exports = router
