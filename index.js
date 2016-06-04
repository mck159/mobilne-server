var async = require('async');
var noble = require('noble');

var ignoreuuids = process.argv[2] || '';

function getIgnored() {
  return ignoreuuids.split(',');
}

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    console.log('Started scanning');
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
    console.log('Discovered');

    if(getIgnored().some(id => id == peripheral.id)) {
      return;
    }
    
    console.log('peripheral with ID ' + peripheral.id + ' found');

    var advertisement = peripheral.advertisement;

    var localName = advertisement.localName;
    var txPowerLevel = advertisement.txPowerLevel;
    var manufacturerData = advertisement.manufacturerData;
    var serviceData = advertisement.serviceData;
    var serviceUuids = advertisement.serviceUuids;

    if (localName) {
      console.log('  Local Name        = ' + localName);
    }

    if (txPowerLevel) {
      console.log('  TX Power Level    = ' + txPowerLevel);
    }

    if (manufacturerData) {
      console.log('  Manufacturer Data = ' + manufacturerData.toString('hex'));
    }

    if (serviceData) {
      console.log('  Service Data      = ' + serviceData);
    }

    if (serviceUuids) {
      console.log('  Service UUIDs     = ' + serviceUuids);
    }

    console.log();

    explore(peripheral);
    
    createNewProcess(peripheral.id);
});

function explore(peripheral) {
  console.log('services and characteristics:');

  peripheral.on('disconnect', function() {
    console.log(peripheral.id + ' disconnected');
  });

  peripheral.connect(function(error) {
    peripheral.discoverServices([], function(error, services) {

      for(service in services) {
        console.log(service.uuid + ' ' + service.name);

        service.discoverCharacteristics([], function(error, characteristics) {
          for(characteristic in characteristics) {
            if(error) {
              console.log('Characteristic error: ' + error);
            } else {
              console.log(characteristic.uuid + ' ' + characteristic.name);
            }
          }
        });

      

    }
  },
        function (err) {
          console.log('Disconnecting ' + err);
          peripheral.disconnect();
        }
      );
    });
}

function createNewProcess(ignored) {
  ignoreuuids += ',' + ignored;
  
  const spawn = require('child_process').spawn;
  const ls = spawn('node', ['index.js', ignoreuuids]);

  ls.stdout.on('data', (data) => {
    console.log(data);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

