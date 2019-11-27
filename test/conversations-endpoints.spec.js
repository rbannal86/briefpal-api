const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Conversations Endpoints', function() {
  let db

  const {
    testUsers,
    testLetters,
    testConversations,
  } = helpers.makeLettersFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))


  describe(`GET /api/conversations/:conversation_id`, () => {
    context(`Given there are conversations, letters, and users in the database`, () => {
      beforeEach('populate tables', () => {
        return helpers.seedUsers(db, testUsers)
        .then(() => helpers.seedLettersTable(db, testUsers, testLetters))
        .then(() => helpers.seedConversationsTable(db, testUsers, testLetters, testConversations))
      })
      it('responds with 200 and the correct conversation info', () => {
        const expectedConversation = {id: 
          testConversations[0].id, 
          letter_count: testConversations[0].letter_count,
          letter_one: testConversations[0].letter_one,
          letter_two: testConversations[0].letter_two,
          letter_three: testConversations[0].letter_three,
          user_one: testConversations[0].user_one,
          user_two: testConversations[0].user_two,
        }
        return supertest(app)
          .get('/api/conversations/1')
          .expect(200, expectedConversation)
      })
    })
  })

  describe(`POST /api/:conversation_id/reply`, () => {
    context(`Given there are conversations, letters, and users in the database`, () => {
      beforeEach('populate tables', () => {
        return helpers.seedUsers(db, testUsers)
        .then(() => helpers.seedLettersTable(db, testUsers, testLetters))
        .then(() => helpers.seedConversationsTable(db, testUsers, testLetters, testConversations))
      })

      it('Creates a reply in a conversation and responds with 200 and the correct, updated conversation', () => {
        let testLetter = { user_id: testUsers[1].id, content: 'test'}
        let expectedConversation = {
          id: 2,
          user_one: testUsers[1].id,
          user_two: testUsers[2].id,
          letter_one: testLetters[3].id,
          letter_two: testLetters[4].id,
          letter_three: 7,
          letter_count: 3
        }

        return supertest(app)
          .post('/api/conversations/2/reply')
          .send(testLetter)
          .expect(200, expectedConversation)
      })
    })
  })
    
  describe(`GET /api/:conversation_id/:letter_id`, () => {
    context(`Given there are conversations, letters, and users in the database`, () => {
      beforeEach('populate tables', () => {
        return helpers.seedUsers(db, testUsers)
        .then(() => helpers.seedLettersTable(db, testUsers, testLetters))
        .then(() => helpers.seedConversationsTable(db, testUsers, testLetters, testConversations))
      })
      it(`responds with 200 and returns the correct letter`, () => {
        let expectedLetter = {
          id: testLetters[0].id,
          content: testLetters[0].content,
          sender: testLetters[0].sender.toString(10),
          recipient: testLetters[0].recipient.toString(10)
        }

        return supertest(app)
          .get('/api/conversations/1/1')
          .expect(200, expectedLetter)
      })
    })
  })
})