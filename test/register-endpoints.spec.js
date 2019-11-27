const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken')

describe('Register Endpoints', function() {
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

  describe(`POST /api/register/`, () => {
    context(`Given the tables are fully populated`, () => {
      beforeEach('populate tables', () => {
        return helpers.seedUsers(db, testUsers)
        .then(() => helpers.seedLettersTable(db, testUsers, testLetters))
        .then(() => helpers.seedConversationsTable(db, testUsers, testLetters, testConversations))
      })

      it('reponds with jwt token', () => {
        let newUser = { user_name: 'newuser', password: 'testpassword' }
        let expectedToken = jwt.sign(
          { user_id: 6 },
          process.env.JWT_SECRET,
          {
            subject: newUser.user_name,
            algorithm: 'HS256'
          }
        )
        return supertest(app)
          .post(`/api/register/`)
          .send(newUser)
          .expect(200, `"`+expectedToken+`"`)
      })
    })
  })
})