require('dotenv').config();
const express =require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const lettersRouter = require('./letters/letters-router')
const conversationsRouter = require('./conversations/conversations-router')
const authRouter = require('./auth/auth-router')
const userRouter = require('./users/users-router')
const registerRouter = require('./register/register-router')

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';
  
app.use(cors());
app.use(helmet());
app.use(morgan(morganOption));


app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/letters', lettersRouter)
app.use('/api/conversations', conversationsRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/register', registerRouter)

app.use(function errorHandler(error, req, res, next){
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;