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
  },

  randomizeRecipient(db, sender) {
    return db
      .raw('SELECT id FROM briefpal_users OFFSET random() * (SELECT COUNT(*) - 1 from briefpal_users) LIMIT 1;')
  },

  findRecipient(db, sender) {
    return this.randomizeRecipient(db, sender)
      .then(result => { 
        if(parseInt(sender) === result.rows[0].id) {
          console.log('STARTING OVER RECIPIENT SEARCH')
          return this.findRecipient(db, sender)
        }
        else {
          return result.rows[0].id
        } 
    })
  },
  
  insertLetter(db, newLetter) {
    return db
      .insert(newLetter)
      .into('briefpal_letters')
      .returning('*')
      .then(([letter]) => letter)
      .then(letter =>
        LettersService.getById(db, letter.id)
      )
  },

  deleteLetter(db, id) {
    console.log(id)
    return db
      .from('briefpal_letters AS letter')
      .where('letter.id', id)
      .del()
  }
}

module.exports = LettersService