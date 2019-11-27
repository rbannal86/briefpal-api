const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
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

  describe(`GET /api/users/:user_name`, () => {
    context(`Given the tables are fully populated`, () => {
      beforeEach('populate tables', () => {
        return helpers.seedUsers(db, testUsers)
        .then(() => helpers.seedLettersTable(db, testUsers, testLetters))
        .then(() => helpers.seedConversationsTable(db, testUsers, testLetters, testConversations))
      })

      it('reponds with 200 and the correct user_id', () => {
        let expectedId = { id: testUsers[0].id }
        
        return supertest(app)
          .get(`/api/users/${testUsers[0].user_name}`)
          .expect(200, expectedId)
      })
    })
  })

  describe(`GET /api/users/:user_name/conversations`, () => {
    context(`Given the tables are fully populated`, () => {
      beforeEach('populate tables', () => {
        return helpers.seedUsers(db, testUsers)
        .then(() => helpers.seedLettersTable(db, testUsers, testLetters))
        .then(() => helpers.seedConversationsTable(db, testUsers, testLetters, testConversations))
      })

      it('reponds with 200 and the correct conversations', () => {
        let expectedConversations = { conversations: [1] }
        
        return supertest(app)
          .get(`/api/users/${testUsers[0].user_name}/conversations`)
          .expect(200, expectedConversations)
      })
    })
  })
})