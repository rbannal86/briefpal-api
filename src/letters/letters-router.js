const express = require('express')
const path = require('path')
const LettersService = require('./letters-service')
const { requireAuth } = require('../middleware/jwt-auth')
const ConversationsService = require('../conversations/conversations-service')

const lettersRouter = express.Router()
const jsonBodyParser = express.json()

lettersRouter
  .route('/newletter')
  .post(jsonBodyParser, (req, res, next) => {
    const { user_id, content } = req.body
    const newLetter = { content }
    console.log('posting new letter')
    if(newLetter.content == null)
      return res.status(400).json({
        error: 'Letter must contain content'
      })
      
    let newRecipient
    let newConversation = {}

    function saveRecipient(result){
      newRecipient = result
      newLetter.recipient = newRecipient
      console.log(newLetter)
    }

    newLetter.sender = user_id

    LettersService.findRecipient(req.app.get('db'), newLetter.sender)
      .then(recipient => {
        saveRecipient(recipient)
        return newRecipient = res.json({recipient}).recipient})
      .then(res => LettersService.insertLetter(req.app.get('db'), newLetter))
      .then(res => {
        newConversation.user_one = parseInt(res.sender)
        newConversation.user_two = res.recipient
        newConversation.letter_one = res.id
        return newConversation
      })
      .then(res => ConversationsService.insertConversation(req.app.get('db'), res))
      .catch(next)
  })


lettersRouter
  .route('/getletters/:letter_id')
  .all(checkLetterExists)
  .get((req, res) => {
    res.json(LettersService.serializeLetter(res.letter))
  })


async function checkLetterExists(req, res, next) {
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

module.exports = lettersRouter