const express = require('express')
const router = express.Router()
const models = require('../models')
const authInfo = require('../config/config')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const makeid = () => {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 10; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

  return text
}

// 닉네임 변경
router.post('/nickname/', async (req, res, next) => {
  try {
    const user = req.user
    const userNickname = user._nickname
    const userSrl = user._srl
    const mod = user.mod
    const body = req.body
    const changeNickname = body.changeNickname

    if (mod === 3) {
      res.status(401).json({
        message: 'auth error'
      })
      return
    }

    const isNotOverlapData = await models.User.findAndCountAll({ where: { user_nickname: changeNickname } })
    if (isNotOverlapData.count > 0) {
      res.status(205).json({
        message: '이미 있는 닉네임입니다'
      })
      return
    }

    const updateNick = await models.User.update(
      { user_nickname: changeNickname },
      { where:
          {
            user_srl: userSrl
          }
      })

    console.log(updateNick)
    res.json({
      message: 'success'
    })
  } catch (e) {
    res.status(403).json({
      message: 'error',
      error: e.message
    })
  }
})

// 비밀번호 찾기
router.post('/password/', async (req, res, next) => {
  try {
    const email = req.body.email

    const userResult = await models.User.findOne({ where: { email_address: email } })
    const randomPassword = makeid()
    const salt = userResult.dataValues.salt
    const hashPassword = crypto.createHash('sha512').update(randomPassword + salt).digest('hex')

    models.User.update(
      { password: hashPassword },
      { where: { email_address: email } }
    )

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: authInfo.GMAIL_ID, // gmail 계정 아이디를 입력
        pass: authInfo.GMAIL_PASSWORD // gmail 계정의 비밀번호를 입력
      }
    })

    let mailOptions = {
      from: authInfo.GMAIL_ID, // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
      to: email, // 수신 메일 주소
      subject: '비밀번호 찾기 이메일', // 제목
      html: '당신의 비밀번호는 ' + randomPassword + '입니다' + '<br/>' + '비밀번호를 변경해주세요' // 내용
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(403).json({
          message: 'error',
          error: error.message
        })
      } else {
        console.log(info)
        res.json({
          result: 'success'
        })
      }
    })
  } catch (e) {
    res.status(403).json({
      message: 'error',
      error: e.message
    })
  }
})

// 비밀번호 변경
router.put('/password/', async (req, res, next) => {
})

module.exports = router
