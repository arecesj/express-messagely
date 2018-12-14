/** Common config for message.ly */

// read .env files and make environmental variables

require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const ACCOUNT_TOKEN = process.env.TWILIO_ACCOUNT_TOKEN;
const PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const MA_PHONE_NUMBER = process.env.PERSONAL_PHONE_NUMBER;

const BCRYPT_WORK_ROUNDS = 10;

module.exports = {
  SECRET_KEY,
  BCRYPT_WORK_ROUNDS,
  ACCOUNT_SID,
  ACCOUNT_TOKEN,
  PHONE_NUMBER,
  MA_PHONE_NUMBER
};
