

const UsersService = {
  getById(db, id) {
    return db
      .from('briefpal_users AS user')
      // .join('briefpal_conversations AS convo', 'user.id', '=', 'convo.user_one')
      // .join('briefpal_conversations AS convo', 'user.id', '=', 'convo.user_two')
      .select(
        'user.id'
        // 'convo.letter_one',
        // 'convo.letter_two',
        // 'convo.letter_three'
      )
      .where('user.id', id)
      .first()
  },
  getConversationsForUser(db, id) {
    return db
      .raw('SELECT json_agg(id) FROM briefpal_conversations AS convo WHERE convo.user_one = ? OR convo.user_two = ?', [id, id])
  },

  serializeConversationArray(array) {
    return {
      conversations: array
    }
  },

  getByName(db, name) {
    return db
      .from('briefpal_users as user')
      .select('user.id')
      .where('user_name', name)
      .first()
  },
  serializeUser(user) {
    return {
      id: user.id,
    }
  }
}

module.exports = UsersService