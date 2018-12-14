/** Message class for message.ly */

const db = require('../db');
const { ACCOUNT_SID, ACCOUNT_TOKEN, PHONE_NUMBER } = require('../config');
const client = require('twilio')(ACCOUNT_SID, ACCOUNT_TOKEN);

/** Message on the site. */

class Message {
  static _404Error(results) {
    if (results.rows.length === 0) {
      let error = new Error(`Message does not exist.`);
      error.status = 404;
      throw error;
    }
  }
  /** register new message -- returns
   *    {id, from_username, to_username, body, sent_at}
   */

  static async create({ from_username, to_username, body }) {
    //Create and insert into db
    let newMessage = await db.query(
      `INSERT INTO messages (from_username, to_username, body, sent_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING id, from_username, to_username, body, sent_at`,
      [from_username, to_username, body]
    );
    this._404Error(newMessage);
    return newMessage.rows[0];
  }

  /** Update read_at for message */

  static async markRead(id) {
    let read = await db.query(
      `UPDATE messages
      SET read_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, read_at, to_username`,
      [id]
    );
    return read.rows[0];
  }

  /** Get: get message by id
   *
   * returns {id, from_user, to_user, body, sent_at, read_at}
   *
   * both to_user and from_user = {username, first_name, last_name, phone}
   */

  static async get(id) {
    let getMessage = db.query(
      `SELECT id, from_username, to_username, body, sent_at, read_at
      FROM messages
      WHERE id = $1
      `,
      [id]
    );
    let toUser = db.query(
      `SELECT username, first_name, last_name, phone
      FROM messages JOIN users ON messages.to_username = users.username
      WHERE messages.id = $1
      `,
      [id]
    );

    let fromUser = db.query(
      `SELECT username, first_name, last_name, phone
      FROM messages JOIN users ON messages.from_username = users.username
      WHERE messages.id = $1
      `,
      [id]
    );

    [getMessage, toUser, fromUser] = await Promise.all([
      getMessage,
      toUser,
      fromUser
    ]);

    this._404Error(getMessage);
    this._404Error(toUser);
    this._404Error(fromUser);

    //TODO: Get rid of the extra lines of code and chain rows with map
    let toUserObj = toUser.rows[0];
    let fromUserObj = fromUser.rows[0];
    let getMessagesObj = getMessage.rows[0];

    let { body, sent_at, read_at } = getMessagesObj;

    let finalMessagesObj = {
      id,
      from_user: fromUserObj,
      to_user: toUserObj,
      body,
      sent_at,
      read_at
    };
    return finalMessagesObj;
  }

  static async twilio({ from_username, to_username, body }) {
    let newMessage = await Message.create({ from_username, to_username, body });
    let result = await db.query(
      `SELECT phone FROM users WHERE username = $1
      `,
      [to_username]
    );
    debugger;
    //console.log('wtf', result, Object.keys(result));
    let userPhoneNumber = result.rows[0].phone;
    let twilio = client.messages.create({
      body: newMessage.body,
      from: PHONE_NUMBER,
      to: userPhoneNumber
    });

    return twilio;
  }
}

module.exports = Message;
