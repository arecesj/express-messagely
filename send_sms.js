const {
  ACCOUNT_SID,
  ACCOUNT_TOKEN,
  PHONE_NUMBER,
  MA_PHONE_NUMBER
} = require('./config');
const client = require('twilio')(ACCOUNT_SID, ACCOUNT_TOKEN);

client.messages.create({
  body: 'DONT FORGET TO CLEAN THE BATHROOM THIS WEEKEND',
  from: PHONE_NUMBER,
  to: MA_PHONE_NUMBER
});
