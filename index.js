var async = require('async');
var noble = require('noble');
var _ = require('underscore');

var ignoredIdsParam = (process.argv[2] || '');// + ',6b64fb1445cc';
var specificIdParam = process.argv[3];

function getIgnored() {
  return ignoredIdsParam.split(',');
}

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    console.log('Stopped scanning');
    noble.stopScanning();
  }
});

noble.on('warning', function(msg) {
  console.log('warning ' + msg);
});
noble.on('discover', function(peripheral) {

    if(specificIdParam && specificIdParam != peripheral.id) {
      return;
    } else if(getIgnored().some(id => id == peripheral.id)) {
      return;
    }
    console.log('peripheral with ID ' + peripheral.id + ' found');

    var advertisement = peripheral.advertisement;

    var localName = advertisement.localName;
    var txPowerLevel = advertisement.txPowerLevel;
    var manufacturerData = advertisement.manufacturerData;
    var serviceData = advertisement.serviceData;
    var serviceUuids = advertisement.serviceUuids;

    console.log();

    explore(peripheral);
    
    createNewProcessIgnorigPeripheral(peripheral.id);
});

function explore(peripheral) {
  peripheral.on('disconnect', function() {
    console.log(peripheral.id + ' disconnected');
    createNewProcessForSpecificPeripheral(peripheral.id);
  });

  peripheral.connect(function(error) {
    if(error) {
      console.log(peripheral.id + ' connecting error' + error);
      return;
    }
    console.log(peripheral.id + ' connected');
    peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics) {
        if(error) {
          console.log('Error: ' + error);
        }
        
        getDataForCharacteristic(characteristics, '2a00', deviceName => console.log('Device name: ' + deviceName));
        getDataForCharacteristic(characteristics, '00002a1900001000800000805f9b34f3', value => console.log('Custom: ' + value));
        
      },
      function (err) {
        console.log('Disconnecting ' + err);
        peripheral.disconnect();
      });
  });
}

function getDataForCharacteristic(characteristics, characteristicId, callback) {
  var characteristic = _.find(characteristics, charact => charact.uuid.toString() == characteristicId);
  if(characteristic) {
    characteristic.read(function(error, data) {
        callback(data);
    });
  }
}

function createNewProcessIgnorigPeripheral(ignored) {
  createNewProcess(ignored, null);
}

function createNewProcessForSpecificPeripheral(specific) {
  createNewProcess(null, specific);
}

function createNewProcess(ignored, specific) {
  if(ignored) {
    ignoredIdsParam += ',' + ignored;
  }
  
  //console.log('Create process with args ' + ignoredIdsParam);
  
  const spawn = require('child_process').spawn;
  const ls = spawn('node', ['index.js', ignoredIdsParam, specific]);

  ls.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

