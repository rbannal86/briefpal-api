const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken')

describe('Auth Endpoints', function() {
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

  describe(`POSt /api/auth/login`, () => {
    beforeEach('insert letters', () => {
      return helpers.seedUsers(db, testUsers)
      .then(() => helpers.seedLettersTable(db, testUsers, testLetters))
      .then(() => helpers.seedConversationsTable(db, testUsers, testLetters, testConversations))
    })

    context(`Given user exists`, () => {
      it(`returns an authtoken`, () => {
        const testUser = testUsers[0]

        const expectedToken = jwt.sign(
          { user_id: testUser.id },
          process.env.JWT_SECRET,
          {
            subject: testUser.user_name,
            algorithm: 'HS256'
          }
        )
        return supertest(app)
          .post('/api/auth/login')
          .send({ user_name: testUser.user_name, password: testUser.password })
          .expect(200, { authToken: expectedToken})
      })
    })
  })
})