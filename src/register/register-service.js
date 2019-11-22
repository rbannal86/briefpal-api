const xss = require('xss')
const UsersService = require('../users/users-services')

const RegisterService = {
  serializeNewUser(newUser) {
    console.log(newUser)
    return {
      user_name: xss(newUser.user_name),
      password: xss(newUser.password)
    }
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('briefpal_users')
      .returning('*')
      .then(([user]) => user)
      .then(user =>
        UsersService.getByName(db, user.user_name)
      )
  }
}

module.exports = RegisterService