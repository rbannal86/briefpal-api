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

    if(newLetter.content === null || newLetter.content === '')
      return res.status(400).json({
        error: 'Letter must contain content'
      })

    ConversationsService.getById(req.app.get('db'), req.params.conversation_id)
      .then(res => {
        console.log('checking count')
        if(res.letter_count === 3) {
          throw( 'End of conversation' )
        } else { return convo = res }}
      )
      .then(res => {return ConversationsService.checkConversationUsers(res, newLetter)})
      .then(res => {
        if(res.error) {
          throw(res.error)
        } else {
          newLetter.recipient = res
        }})
      .then(res => {return LettersService.insertLetter(req.app.get('db'), newLetter)})
      .then(res => {newLetter.id = res.id 
        return res
      })
      .then(res => { return ConversationsService.checkConversationStatus(convo, res) })
      .then(res => { return ConversationsService.updateConversation(res, req.app.get('db'), req.params.conversation_id) })
      .then(conversation => {return res.json(ConversationsService.serializeConversation(conversation))})
      .catch(error => {
        return res.status(400).json({error: error})})   
  })

conversationsRouter
  .route('/:conversation_id/:letter_id')
  .all(checkLetterWithinConversationExists)
  .get((req, res) => {
    res.json(LettersService.serializeLetter(res.letter))
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