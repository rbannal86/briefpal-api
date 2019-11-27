Name: briefPal server

Server url: https://nameless-peak-53265.herokuapp.com

App url: https://briefpal-client.now.sh/userpage

API documentation:
  Endpoints:
    /api/auth:
      /login: { user_name, password } POST
        returns { user_id: id }

    /api/letters:
      /newletter: { user_id, content } POST
        returns { recipent: id }
      /getletters/:letter_id: {} GET
        returns { id: id, content: "content", sender: id, recipient: id}

    /api/register:
      /: { user_name, password } POST
        returns JWT

    /api/conversations:
      /:conversation_id {} GET
        returns { id: id, user_one: id, user_two: id, letter_one: id, letter_two: id, letter_three: id, letter_count: num }
      /:conversation_id/reply { user_id, content } POST
        returns { id: id, user_one: id, user_two: id, letter_one: id, letter_two: id, letter_three: id, letter_count: num }
      /:conversation_id/:letter_id {} GET
        returns { id: id, content: "content", sender: id, recipient: id }

    /api/users:
      /:user_name {} GET
        returns { id: id }
      /:user_name/conversations {} GET
        returns { conversations: [id...] }

Summary: This is the api for the briefPal app. It connects to the briefpal database which has three tables: briefpal_users, briefpal_letters, and briefpal_conversations. The users table saves a user name and a bcrypt'd password and assigns an id when created. The letter database manages individual letters, saving the content, the sender, the recipient, and an automatically assigned id. The sender and the recipient refer to the id of users in the user table. The conversation table has columns for two user id's (user_one and user_two), three letter id's (letter_one, letter_two, letter_three) and a letter_count column. The user id's and letter id's refer back to the user table and the letter table, respectively. When posting a new letter that is not attached to conversation (the first letter in a conversation), the endpoint will randomly assign the recipient value in the new letter data to an existing user_id. If that user_id is the same id as the sender, it will search again until an appropriate user is found.