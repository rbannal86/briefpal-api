const xss = require('xss')

const LettersService = {
  getById(db, id) {
    return db
      .from('briefpal_letters AS letter')
      .select(
        'letter.id',
        'letter.content',
        'letter.sender',
        'letter.recipient'
      )
      .where('letter.id', id)
      .first()
  },

  serializeLetter(letter) {
    return {
      id: letter.id,
      content: xss(letter.content),
      sender: xss(letter.sender),
      recipient: xss(letter.recipient)
    }
  }
}

module.exports = LettersService