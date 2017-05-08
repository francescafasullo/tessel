var twilio = require('twilio');
var account_sid = "AC8385efc832257823279df58cdf714fc7";
var auth_token = "94f13a3c09f8d9a08d992b079d59b19c";
var twilio_num = "+12014264151"; 
var number = "+12012187547"; // The number you want to text the information to

var client = twilio(account_sid, auth_token);

function sendText(to, from, msg) {
  client.messages.create({
    to: to,
    from: from,
    body: msg
  }, function(error, message) {
    if (!error) {
      console.log('Success! The SID for this SMS message is:');
      console.log(message.sid);
      console.log('Message sent on:');
      console.log(message.dateCreated);
    } else {
      console.log('Oops! There was an error.', error);
    }
  });
}

module.exports = sendText;