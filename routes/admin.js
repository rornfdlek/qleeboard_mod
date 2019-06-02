const express = require('express')
const router = express.Router()
const models = require('../models')
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

// POST 관리자 가입
router.post('/up', async (req, res, next) => {
  const body = req.body
  const secret = req.app.get('jwt-secret')

  const adminPassword = req.app.get('admin-password')
  const user = req.user

  if (adminPassword === body.admin_password) {
    try {
      await models.User.update(
        { is_admin: true },
        { where: { user_srl: user._srl } })
      const result = await models.User.findByPk(user._srl)
      const token = await returnJwt(result, secret)
      res.json({
        user_srl: result.dataValues.user_srl,
        user_nickname: result.dataValues.user_nickname,
        email_address: result.dataValues.email_address,
        mod: result.dataValues.is_admin ? 1 : 2,
        message: '관리자 계정 가입에 성공했습니다',
        token
      })
    } catch (e) {
      console.log(e)
      res.status(403).json({
        message: '비밀번호가 일치하지 않습니다.'
      })
    }
  }
})

module.exports = router
