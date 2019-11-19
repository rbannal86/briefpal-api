const express = require('express')
const path = require('path')
const ConversationsService = require('./conversations-service')
const LettersService = require('../letters/letters-service')
const LettersRouter = require('../letters/letters-router')

const conversationsRouter = express.Router()
const jsonBodyParser = express.json()

conversationsRouter
  .route('/:conversation_id')
  .all(checkConversationExists)
  .get((req, res) => {
    res.json(ConversationsService.serializeConversation(res.conversation))
  })

conversationsRouter
  .route('/:conversation_id/reply')
  .all(checkConversationExists)
  .post(jsonBodyParser, (req, res, next) => {
    const { user_id, content } = req.body
    const newLetter = { sender: parseInt(user_id), content }
    let convo

    if(newLetter.content == null)
      return res.status(400).json({
        error: 'Letter must contain content'
      })

    ConversationsService.getById(req.app.get('db'), req.params.conversation_id)
    .then(res => {return convo = res})
    .then(res => {return ConversationsService.checkConversationUsers(res, newLetter)})
    .then(res => {
      if(res.error) {
        throw(res.error)
      } else {
        newLetter.recipient = res
      }})
    // .then(res => {return LettersService.insertLetter(req.app.get('db'), newLetter)})
    .then(res => {return LettersService.insertLetter(req.app.get('db'), newLetter)})
    .then(res => {return ConversationsService.checkConversationStatus(convo, res)})
    .then(res => {
      if(res.error){ 
        let error = res.error
        LettersService.deleteLetter(req.app.get('db'), res.letter.id)
        .then(Promise.reject(new Error('End of conversation')))
      }
      // if(res.error) {
      //   throw(res.error)
      // }
          
        // LettersService.deleteLetter(req.app.get('db'), res.letter.id)
        // throw res.error
       else {
          return ConversationsService.updateConversation(res, req.app.get('db'), req.params.conversation_id)}
        })
    .then(res => {return res})
    .catch()
    // LettersService.insertLetter(req.app.get('db'), newLetter)
    // let convo
    // let letter

    
  })

conversationsRouter
  .route('/:conversation_id/:letter_id')
  .all(checkLetterWithinConversationExists)
  .get((req, res) => {
    res.json(LettersService.serializeLetter(res.letter))
  })

conversationsRouter
  .route('/:user_id/all_conversations')
  .get((req, res) => {
    ConversationsService.getAllConversationsByUser(req.params.user_id, req.app.get('db'))
      res.json(res)
  })

async function checkConversationExists(req, res, next) {
  try {
    const conversation = await ConversationsService.getById(
      req.app.get('db'),
      req.params.conversation_id
    )

    if(!conversation)
      return res.status(404).json({
        error: `Conversation doesn't exist`
      })

    res.conversation = conversation
    next()
  } catch(error) {
    next(error)
  }
}

async function checkLetterWithinConversationExists(req, res, next) {
  try {
    const letter = await LettersService.getById(
      req.app.get('db'),
      req.params.letter_id
    )

    if(!letter)
      return res.status(404).json({
        error: `Letter doesn't exist`
      })
    
    res.letter = letter
    next()
  } catch(error) {
    next(error)
  }
}

module.exports = conversationsRouter