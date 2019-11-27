const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Letters Endpoints', function() {
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

  describe(`GET /api/letters/getletters/:letter_id`, () => {
    context(`Given no letters`, () => {
      it('responds with 404 not found', () => {
        return supertest(app)
          .get('/api/letters/getletters/1')
          .expect(404)
      })
    })

    context(`Given there are letters in the database`, () => {
      beforeEach('insert letters', () => {
        return helpers.seedUsers(db, testUsers)
        .then(() => helpers.seedLettersTable(db, testUsers, testLetters))
        .then(() => helpers.seedConversationsTable(db, testUsers, testLetters, testConversations))
      })
      it('responds with 200 and the correct letter', () => {
        const expectedLetter = {
          id: 1,
          content: 'Test One',
          sender: '1',
          recipient: '2'
        }
        return supertest(app)
          .get('/api/letters/getletters/1')
          .expect(200, expectedLetter)
      })
    })
  })

  describe(`POST /api/letters/newletter`, () => {
    beforeEach('insert conversations', () => {
      return helpers.seedUsers(db, testUsers)
      .then(() => helpers.seedLettersTable(db, testUsers, testLetters))
      .then(() => helpers.seedConversationsTable(db, testUsers, testLetters, testConversations))
    })

    it(`returns 400 when letter content is empty`, () => {
      const testUser = testUsers[0]
      const newLetter = { user_id: testUser.id, content: null }
      return supertest(app)
        .post('/api/letters/newletter')
        .send(newLetter)
        .expect(400, {"error":"Letter must contain content"})
    })

    it(`creates a new letter, responds with 200 and the new letter`, function(){
      const testUser = testUsers[4]
      const newLetter = { user_id: testUser.id, content: 'test' }
      return supertest(app)
        .post('/api/letters/newletter')
        .send(newLetter)
        .expect(200)
        .expect(res => {
          expect(res.recipient).to.not.eql(testUser.id)
        })
    })
  })

})