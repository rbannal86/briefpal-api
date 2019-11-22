const express = require('express')
const RegisterService = require('./register-service')
const AuthService = require('../auth/auth-service')

const registerRouter = express.Router()
const jsonBodyParser = express.json()

registerRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    console.log(req.body)
    const { user_name, password } = req.body
    let newUser = { user_name, password }
    newUser = RegisterService.serializeNewUser(newUser)
    AuthService.hashPassword(newUser.password)
      .then(res => {
        return newUser = { user_name, password: res }
      })
      .then(res => {
        return RegisterService.insertUser(req.app.get('db'), res)
      })
      .then(res => {
        if(res.error) {
          throw(res.error)
        } else {
          console.log(res)
          return res
        }
      })
      .then(data => {
        return res.json(data)
      })
      .catch(error =>{
        return res.status(400).json({ error: error.detail })
      })
  })

module.exports = registerRouter