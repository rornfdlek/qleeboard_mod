const express = require('express')
const router = express.Router()
const models = require('../models')

const boardTypeChecker = (boardType) => {
  if (boardType === 'checking') return 0
  else if (boardType === 'checked') return 1
  else return 0
}

router.get('/view/:id', function (req, res, next) {
  const params = req.params
  const id = params.id

  models.Post.findOne({
    where: {
      id: id
    }
  }).then((result) => {
    const boardViewData = result
    models.Image.findAll({
      where: {
        board_id: id
      }
    }).then((result) => {
      if (result !== null) { // 결과
        res.json({
          images: result,
          boardViewData,
          message: 'success'
        })
      } else {
        res.json({
          result,
          message: 'no more data'
        })
      }
    })
  }).catch((err) => {
    res.status(403).json({
      message: 'error',
      error: err.message
    })
  })
})

router.get('/list/:board_type/', function (req, res, next) {
  const params = req.params
  const query = req.query
  const boardType = params.board_type

  const pageno = query.page
  const limit = query.offset * 1
  const pageoffset = limit * (pageno - 1)

  models.Post.findAndCountAll({
    order: [['id', 'DESC']],
    offset: pageoffset,
    limit: limit,
    where: {
      board_type: boardTypeChecker(boardType)
    }
  }).then((result) => {
    if (result !== null) { // 결과
      res.json({
        result,
        message: 'success'
      })
    } else {
      res.json({
        result,
        message: 'no more data'
      })
    }
  }).catch((err) => {
    res.status(403).json({
      message: 'error',
      error: err.message
    })
  })
})

function insertImages (images, boardId) {
  // new Promise() 추가
  return new Promise(function (resolve, reject) {
    for (image of images) {
      models.Image.create({
        board_id: boardId,
        img_url: image
      })
    }
    resolve()
  })
}

router.post('/', function (req, res, next) {
  const body = req.body
  const userId = body.userId
  const images = body.images

  models.Post.create({
    user_id: userId,
    contents: body.contents,
    brand_code: body.brand,
    shoes_status: body.shoesStat,
    size: body.size,
    title: body.name,
    board_type: 0
  }).then((result) => {
    const boardId = result.dataValues.id
    insertImages(images, boardId)
      .then(() => {
        res.json({
          result,
          message: 'success'
        })
      })
  }).catch((err) => {
    res.status(403).json({
      message: 'error',
      error: err.message
    })
  })
})

router.get('/comments/:board_id', function (req, res, next) {
  const params = req.params
  const id = params.board_id

  models.Comment.findAndCountAll({
    where: {
      board_id: id
    }
  }).then((result) => {
    if (result !== null) { // 결과
      res.json({
        result,
        message: 'success'
      })
    } else {
      res.json({
        result,
        message: 'no more data'
      })
    }
  }).catch((err) => {
    res.status(403).json({
      message: 'error',
      error: err.message
    })
  })
})

router.post('/comments/:board_id', function (req, res, next) {
  const params = req.params
  const boardId = params.board_id

  const body = req.body
  const userId = body.userId
  const data = body.data

  models.Comment.create({
    user_id: userId,
    board_id: boardId,
    contents: data
  }).then((result) => {
    if (result !== null) { // 결과
      res.json({
        result,
        message: 'success'
      })
    } else {
      res.json({
        result,
        message: 'no more data'
      })
    }
  }).catch((err) => {
    res.status(403).json({
      message: 'error',
      error: err.message
    })
  })
})

module.exports = router
