const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'upload/')
  },
  filename: function (req, file, callback) {
    let extention = path.extname(file.originalname)
    callback(null, 'image' + Date.now() + (Math.floor(Math.random() * 1000000) + 1) + extention)
  }
})

let upload = multer({
  storage: storage
})

// 파일 업로드 처리
router.post('/images', upload.array('img'), function (req, res, next) {
  console.log(req.files)
  res.json({
    result: req.files,
    message: 'success'
  })
})

module.exports = router
