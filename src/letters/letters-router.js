const express = require('express')
const path = require('path')
const LettersService = require('./letters-service')


const lettersRouter = express.Router()
const jsonBodyParser = express.json()

lettersRouter
  .route('/:letter_id')
  .all(checkLetterExists)
  .get((req, res) => {
    res.json(LettersService.serializeLetter(res.letter))
  })


async function checkLetterExists(req, res, next) {
  try {
    console.log(req.params.letter_id)
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