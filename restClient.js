var _ = require('underscore');
var request = require('request');

var exports = module.exports = {};

var _url = 'https://morning-journey-48476.herokuapp.com';

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
  request.post(_url + path, { json: jsonData }, function(error, response, body) {
    console.log("response: " + response.statusCode + " body: " + body);
  });
}