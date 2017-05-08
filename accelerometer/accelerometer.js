// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
CheWWise
*********************************************/
var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);

var account_sid = "AC8385efc832257823279df58cdf714fc7";
var auth_token = "94f13a3c09f8d9a08d992b079d59b19c";
var twilio_num = "+12014264151"; 
var number = "+12012187547"; // The number you want to text the information to

var last_movement = 0.0;
var last_movement_time = Date.now();
var minutes;
var moveCount = 0;
var fork = '🍴'
var snowman = '☃';
var stop = '🚫';

var sendText = require('./twilio');

// Initialize the accelerometer
accel.on('ready', function () {
  sendText( number, twilio_num, "You're eating with CheWWise. Bon Appetit! " + fork);
  // Stream accelerometer data
  accel.setOutputRate(1.56, function rateSet() {
    accel.setScaleRange( 8, function scaleSet() {
      accel.on('data', function (xyz) {
      		// tessel has moved
      		if (last_movement !== xyz[0].toFixed(1)) {
      			if (Math.abs(last_movement - xyz[0].toFixed(1)) > 0.1) {
      				moveCount++;
      			}
      			last_movement = xyz[0].toFixed(1);
      			minutes = ((Date.now() - last_movement_time)/1000) / 60;
      			last_movement_time = Date.now();

      			console.log('You have moved your fork ' + moveCount + ' times');
      			if (moveCount > 10 && minutes < 0.1) {
      				console.log('Sent SMS: WARNING: YOU ARE EATING TOO FAST!');
      				sendText(number, twilio_num, 'WARNING: YOU ARE EATING TOO FAST! ' + stop);
      				moveCount = 0;
      			} else if (moveCount > 10) {
      				moveCount = 0;
      			}
      			
      		// no movement
      		} else {
      			minutes = ((Date.now() - last_movement_time)/1000) / 60;
      			// console.log(minutes)

      			if (minutes > 0.1) {
      				console.log('Sent SMS: Your food\'s getting cold!')
      				sendText(number, twilio_num, 'Your food\'s getting cold! ' + snowman);
      				minutes = 0;
      				last_movement_time = Date.now();
      			}
      		}
        })
      });
    });
  });

accel.on('error', function(err){
  console.log('Error:', err);
});


