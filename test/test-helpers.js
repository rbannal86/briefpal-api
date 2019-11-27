const bcrypt = require('bcryptjs')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'testOne',
      password: 'password',
      date_created: '2019-11-25 16:52:50'
    },
    {
      id: 2,
      user_name: 'testTwo',
      password: 'passwordTwo',
      date_created: '2019-11-25 16:52:50'
    },
    {
      id: 3,
      user_name: 'testThree',
      password: 'passwordThree',
      date_created: '2019-11-25 16:52:50'
    },
    {
      id: 4,
      user_name: 'testFour',
      password: 'passwordFour',
      date_created: '2019-11-25 16:52:50'
    },
    {
      id: 5,
      user_name: 'testFive',
      password: 'passwordFive',
      date_created: '2019-11-25 16:52:50'
    }
  ]
}

function makeLettersArray(users) {
  return [
    {
      id: 1,
      content: 'Test One',
      sender: users[0].id,
      recipient: users[1].id,
      date_created: '2019-11-25 16:52:50'
    },
    {
      id: 2,
      content: 'Test Two',
      sender: users[1].id,
      recipient: users[2].id,
      date_created: '2019-11-25 16:52:50'
    },
    {
      id: 3,
      content: 'Test Three',
      sender: users[0].id,
      recipient: users[1].id,
      date_created: '2019-11-25 16:52:50'
    },
    {
      id: 4,
      content: 'Test Four',
      sender: users[1].id,
      recipient: users[2].id,
      date_created: '2019-11-25 16:52:50'
    },
    {
      id: 5,
      content: 'Test Five',
      sender: users[2].id,
      recipient: users[1].id,
      date_created: '2019-11-25 16:52:50'
    },
    {
      id: 6,
      content: 'Test Six',
      sender: users[2].id,
      recipient: users[3].id,
      date_created: '2019-11-25 16:52:50'
    }
  ]
}

function makeConversationsArray(users, letters) {
  return [
    {
      id: 1,
      user_one: users[0].id,
      user_two: users[1].id,
      letter_one: letters[0].id,
      letter_two: letters[1].id,
      letter_three: letters[2].id,
      letter_count: 3,
      date_created: '2019-11-25 16:52:50'
    },
    {
      id: 2,
      user_one: users[1].id,
      user_two: users[2].id,
      letter_one: letters[3].id,
      letter_two: letters[4].id,
      letter_three: null,
      letter_count: 2,
      date_created: '2019-11-25 16:52:50'
    },
    {
      id: 3,
      user_one: users[2].id,
      user_two: users[3].id,
      letter_one: letters[5].id,
      letter_two: null,
      letter_three: null,
      letter_count: 1,
      date_created: '2019-11-25 16:52:50'
    }
  ]
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('briefpal_users').insert(preppedUsers).returning('*')  
    .then(() => {
      
      return db.raw(
        `SELECT setval('briefpal_users_id_seq', ?)`,
        [users[users.length - 1].id]
      ) }
    )
    
}

function seedLettersTable(db, users, letters) {
  return db.transaction(async trx => {
    await trx.into('briefpal_letters').insert(letters)
    await trx.raw(
      `SELECT setval('briefpal_letters_id_seq', ?)`,
      [letters[letters.length - 1].id]
    )
  })
}

function seedConversationsTable(db, users, letters, conversations) {
  return db.transaction(async trx => {
    // await seedUsers(trx, users)
    // await seedLettersTable(trx, users, letters)
    await trx.into('briefpal_conversations').insert(conversations)
    await trx.raw(
      `SELECT setval('briefpal_conversations_id_seq', ?)`,
      [conversations[conversations.length - 1].id]
    )
  })
}

function makeLettersFixtures() {
  const testUsers = makeUsersArray()
  const testLetters = makeLettersArray(testUsers)
  const testConversations = makeConversationsArray(testUsers, testLetters)
  return { testUsers, testLetters, testConversations }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      briefpal_conversations,
      briefpal_letters,
      briefpal_users
      RESTART IDENTITY CASCADE;`
  )
}

module.exports = {
  makeUsersArray,
  makeLettersArray,
  makeConversationsArray,
  seedUsers,
  makeLettersFixtures,
  cleanTables,
  seedLettersTable,
  seedConversationsTable
}