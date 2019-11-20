const express = require('express')
const path = require('path')
const UsersService = require('./users-services')
const ConversationsService = require('../conversations/conversations-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .route('/:user_name')
  .all(checkUserExists)
  .get((req, res) => {
    res.json(UsersService.serializeUser(res.user))
  })
  // .then(res => {return UsersService.serializeUser(res)})

usersRouter
  .route('/:user_name/conversations')
  .all(checkUserExists)
  .get((req, res) => {
    UsersService.getConversationsForUser(req.app.get('db'), res.user.id)
      .then(data => { let conversations = data.rows[0].json_agg
        res.json(UsersService.serializeConversationArray(conversations))
      })
  })

async function checkUserExists(req, res, next) {
  try {
    const user = await UsersService.getByName(
      req.app.get('db'),
      req.params.user_name
    )

    if(!user)
      return res.status(404).json({
        error: `User doesn't exist`
      })
    
    res.user = user
    next()
  } catch(error) {
    next(error)
  }
}

module.exports = usersRouter