const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op

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
router.get('/:board_id/post/list', async (req, res, next) => {
  try {
    const boardId = req.params.board_id
    const limit = req.query.limit ? req.query.limit * 1 : 10000
    const pageno = req.query.page ? req.query.page : 1
    const pageoffset = limit * (pageno - 1)
    const where = [{ board_id: boardId }]
    if (req.query.searchKeyword) {
      const searchKeyword = req.query.searchKeyword.split(' ')
      for (let keyword of searchKeyword) {
        let searchSubjectKey = {}
        searchSubjectKey = { subject: { [Op.like]: '%' + keyword + '%' } }
        let searchContentsKey = {}
        searchContentsKey = { contents: { [Op.like]: '%' + keyword + '%' } }
        const opOr = { [Op.or]: [searchSubjectKey, searchContentsKey] }
        where.push(opOr)
      }
    }
    const result = await models.Post.findAndCountAll({
      order: [['id', 'DESC']],
      limit: limit,
      offset: pageoffset,
      where: where
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

// post list
router.get('/post/list/:board_id', async (req, res, next) => {
  try {
    const boardId = req.params.board_id
    const limit = req.query.limit ? req.query.limit * 1 : 10000
    const pageno = req.query.page ? req.query.page : 1
    const pageoffset = limit * (pageno - 1)
    const where = [{ board_id: boardId }]
    if (req.query.searchKeyword) {
      const searchKeyword = req.query.searchKeyword.split(' ')
      for (let keyword of searchKeyword) {
        let searchSubjectKey = {}
        searchSubjectKey = { subject: { [Op.like]: '%' + keyword + '%' } }
        let searchContentsKey = {}
        searchContentsKey = { contents: { [Op.like]: '%' + keyword + '%' } }
        const opOr = { [Op.or]: [searchSubjectKey, searchContentsKey] }
        where.push(opOr)
      }
    }
    const result = await models.Post.findAndCountAll({
      order: [['id', 'DESC']],
      limit: limit,
      offset: pageoffset,
      where: where
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
  return new Promise(async (resolve, reject) => {
    for (let image of images) {
      await models.Image.create({
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

// DELETE 게시글 삭제
router.delete('/post/:post_id', async (req, res, next) => {
  try {
    const params = req.params
    const postId = params.post_id

    const user = req.user

    const postData = await models.Post.findByPk(postId)
    if (postData.getDataValue('user_srl') !== user._srl && user.mod !== 1) {
      res.status(403).json({
        message: 'auth error'
      })
      return
    }

    const result = await models.Post.destroy({ where: { id: postId } })
    res.json({
      message: '게시글 삭제에 성공했습니다'
    })
  } catch (e) {
    res.status(403).json({
      message: '게시글 삭제에 실패했습니다',
      error: e.message
    })
  }
})

// DELETE 댓글 삭제
router.delete('/comment/:comment_id', async (req, res, next) => {
  try {
    const params = req.params
    const commentId = params.comment_id
    const user = req.user

    const postData = await models.PostComment.findByPk(commentId)
    if (postData.getDataValue('user_srl') !== user._srl && user.mod !== 1) {
      res.status(403).json({
        message: 'auth error'
      })
      return
    }

    const result = await models.PostComment.destroy({ where: { id: commentId } })

    await models.Post.update(
      { comments_count: models.sequelize.literal('comments_count - 1') },
      { where: { id: postData.getDataValue('post_id') } }
    )

    res.json({
      message: '댓글 삭제에 성공했습니다'
    })
  } catch (e) {
    res.status(403).json({
      message: '댓글 삭제에 실패했습니다',
      error: e.message
    })
  }
})

// DELETE 게시판 삭제
router.delete('/:board_id', async (req, res, next) => {
  try {
    const params = req.params
    const boardId = params.board_id

    const user = req.user

    const postData = await models.Board.findByPk(boardId)
    if (user.mod !== 1) {
      res.status(403).json({
        message: 'auth error'
      })
      return
    }

    const result = await models.Board.destroy({ where: { id: boardId } })
    res.json({
      message: '게시판 삭제에 성공했습니다'
    })
  } catch (e) {
    res.status(403).json({
      message: '게시판 삭제에 실패했습니다',
      error: e.message
    })
  }
})

module.exports = router
