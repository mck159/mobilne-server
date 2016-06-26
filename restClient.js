var http = require('http');
var _ = require('underscore');

var exports = module.exports = {};

<<<<<<< HEAD
var _url = 'http://192.168.137.58';
=======
var _url = 'https://morning-journey-48476.herokuapp.com';
>>>>>>> 55aef1907cb8212255873210c759d4079260931f

var connectedDevices = [];

exports.sendConnectedInfo = function(deviceInfo) {
  console.log('Sending connected info: ' + JSON.stringify(deviceInfo));
  connectedDevices.push(deviceInfo);
  sendData('/peripheralData/connected', deviceInfo);
};

exports.sendDisconnectedInfo = function(deviceId) {
  var device = _.find(connectedDevices, dev => dev.uuid == deviceId);
  if(device) {
    console.log('Sending disconnected info: ' + deviceId);
    sendData('/peripheralData/disconnected', device);
  }
};

function sendData(path, jsonData) {
  var options = {
    host: _url,
<<<<<<< HEAD
    port: 8080,
=======
    port: 443,
>>>>>>> 55aef1907cb8212255873210c759d4079260931f
    path: path,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonData)
    }
  };

  var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log("body: " + chunk);
      });
  });

  req.write(JSON.stringify(jsonData));
  req.end();
}