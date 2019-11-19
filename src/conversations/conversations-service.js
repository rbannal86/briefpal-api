const xss = require('xss')
const LettersService = require('../letters/letters-service')

const ConversationsService = {
  getById(db, id) {
    return db
      .from('briefpal_conversations AS convo')
      .select(
        'convo.id',
        'convo.user_one',
        'convo.user_two',
        'convo.letter_one',
        'convo.letter_two',
        'convo.letter_three'
      )
      .where('convo.id', id)
      .first()
  },
  insertConversation(db, newConversation) {
    return db
      .insert(newConversation)
      .into('briefpal_conversations')
      .returning('*')
      .then(([conversation]) => conversation)
      .then(conversation => 
        ConversationsService.getById(db, conversation.id)  
      )
  },
  serializeConversation(conversation) {
    return {
      id: conversation.id,
      user_one: conversation.user_one,
      user_two: conversation.user_two,
      letter_one: conversation.letter_one,
      letter_two: conversation.letter_two,
      letter_three: conversation.letter_three
    }
  },
  checkConversationStatus(convo, letter) {
    if(convo.letter_three !== null) {
      return {
        letter,
        error: 'End of conversation'
      }
    } else {
      if(convo.letter_two !== null) {
        convo.letter_three = letter.id
        return convo
      } else {
        convo.letter_two = letter.id
        return convo
      }}
  },
  checkConversationUsers(convo, letter) {
    if(convo.user_one !== letter.sender && convo.user_two !== letter.sender) {
      return {
        error: 'Unauthorized user'
      }} else {
        if(convo.user_one === letter.sender) {
          return convo.user_two
        } else {
          return convo.user_one
        }
    }
  },
  updateConversation(newConvo, db, id) {
    return db
      .from('briefpal_conversations AS convo')
      .where('convo.id', id)
      .update({ letter_two: newConvo.letter_two, letter_three: newConvo.letter_three})
      .returning('*')
      .then(([conversation]) => conversation)
      .then(conversation => 
        ConversationsService.getById(db, conversation.id)
        )
  },
  getAllConversationsByUser(user, db) {
    console.log(user)
    return db
      .raw('SELECT * FROM briefpal_conversations WHERE user_one = ? OR user_two = ?;', [user])
      // .from('briefpal_conversations AS convo')
      // .where(function () {
      //   this.where('convo.user_one', user)
      //     .orWhere('convo.user_two', user)
      // })
      // .select('*')
      // .returning('*')
      // .then(([conversations]) => conversations)
      // .then(conversations => conversations.map( conversation =>
      //   ConversationsService.getById(db, conversation)
      // ))
  }
}


module.exports = ConversationsService