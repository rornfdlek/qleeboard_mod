const express = require('express')
const router = express.Router()
const models = require('../models')

// board list
router.get('/list', async (req, res, next) => {
  try {
    const limit = req.query.limit ? req.query.limit * 1 : 10000
    const result = await models.Board.findAndCountAll({ limit: limit })
    res.json({
      result,
      message: 'success'
    })
  } catch (e) {
    console.log(e)
    res.json({
      message: 'fail'
    })
  }
})

// board list
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const result = await models.Board.findOne({ where: { id: id } })
    res.json({
      result,
      message: 'success'
    })
  } catch (e) {
    console.log(e)
    res.json({
      message: 'fail'
    })
  }
})

// post list
router.get('/post/list/:id', async (req, res, next) => {
  try {
    const boardId = req.params.id
    const limit = req.query.limit ? req.query.limit * 1 : 10000
    const result = await models.Post.findAndCountAll({
      order: [['id', 'DESC']],
      limit: limit,
      where: { board_id: boardId }
    })
    res.json({
      result,
      message: 'success'
    })
  } catch (e) {
    console.log(e)
    res.json({
      message: 'fail'
    })
  }
})

// post view
router.get('/view/:postId', async (req, res, next) => {
  try {
    const params = req.params
    const id = params.postId

    const postResult = await models.Post.findOne({
      where: {
        id: id
      }
    })

    // 권한 체크 로직
    const boardId = postResult.dataValues.board_id
    const boardCheckData = await models.Board.findOne({ where: { id: boardId } })
    const requireAuth = boardCheckData.dataValues.require_auth

    console.log(req.user)

    if (req.user.mod === 3 && requireAuth === true) {
      res.status(401).json({
        message: 'error'
      })
      return
    }
    // 조회수 업데이트
    models.Post.update(
      { read_count: models.sequelize.literal('read_count + 1') },
      { where: { id: id } }
    )

    const boardViewData = postResult
    const imgRes = await models.Image.findAll({
      where: {
        post_id: id
      }
    })

    if (imgRes !== null) { // 결과
      res.json({
        images: imgRes,
        boardViewData,
        message: 'success'
      })
    } else {
      res.json({
        imgRes,
        message: 'no more data'
      })
    }
  } catch (e) {
    res.status(403).json({
      message: 'error',
      error: e
    })
  }
})

router.get('/list/:boardId/', function (req, res, next) {
  const params = req.params
  const query = req.query
  const boardId = params.boardId

  const pageno = query.page
  const limit = query.offset * 1
  const pageoffset = limit * (pageno - 1)

  models.Post.findAndCountAll({
    order: [['id', 'DESC']],
    offset: pageoffset,
    limit: limit,
    where: {
      board_id: boardId
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

function insertImages (images, postId) {
  // new Promise() 추가
  return new Promise(function (resolve, reject) {
    for (let image of images) {
      models.Image.create({
        post_id: postId,
        img_url: image
      })
    }
    resolve()
  })
}

router.post('/', function (req, res, next) {
  const body = req.body

  const images = body.images

  const user = req.user
  if (user.mod === 3) {
    res.status(403).json({
      message: 'auth error'
    })
    return
  }

  const userId = user._email
  const userNickname = user._nickname
  const userSrl = user._srl

  models.Post.create({
    user_id: userId,
    user_nickname: userNickname,
    user_srl: userSrl,
    contents: body.contents,
    subject: body.subject,
    board_id: body.boardId
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
    console.log(err)
    res.status(403).json({
      message: 'error',
      error: err.message
    })
  })
})

router.get('/comments/:post_id', function (req, res, next) {
  const params = req.params
  const id = params.post_id

  models.PostComment.findAndCountAll({
    where: {
      post_id: id
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

router.post('/comments/:post_id', function (req, res, next) {
  const params = req.params
  const postId = params.post_id

  const body = req.body

  const data = body.data

  const user = req.user
  if (user.mod === 3) {
    res.status(403).json({
      message: 'auth error'
    })
    return
  }

  const userId = user._email
  const userNickname = user._nickname
  const userSrl = user._srl

  models.PostComment.create({
    user_id: userId,
    user_nickname: userNickname,
    user_srl: userSrl,
    post_id: postId,
    contents: data
  }).then((result) => {
    models.Post.update(
      { comments_count: models.sequelize.literal('comments_count + 1') },
      { where:
          {
            id: postId
          }
      }
    )

    res.json({
      result,
      message: 'success'
    })
  }).catch((err) => {
    res.status(403).json({
      message: 'error',
      error: err.message
    })
  })
})

// 이제 안쓰는 부분
const boardTypeChecker = (boardType) => {
  if (boardType === 'checking') return 0
  else if (boardType === 'checked') return 1
  else return 0
}

const summaryBoard = () => {
  return new Promise((resolve, reject) => {
    models.Board.findAll({
      limit: 5
    })
      .then(result => {
        resolve(JSON.parse(JSON.stringify(result)))
      })
  })
}

const summaryPosts = (boardId) => {
  return new Promise((resolve, reject) => {
    models.Post.findAll({
      limit: 10,
      where: {
        board_id: boardId
      }
    })
      .then(result => {
        resolve(JSON.parse(JSON.stringify(result)))
      })
  })
}

const buildSummaryObject = (boardData) => {
  return new Promise((resolve, reject) => {
    let result = {
      boardName: '',
      postData: []
    }
    result.boardName = boardData.name
    summaryPosts(boardData.id)
      .then(res => {
        result.boardName = boardData.name
        result.postData = res
        resolve(result)
      })
  })
}

module.exports = router
