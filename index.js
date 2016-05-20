var bleno = require('bleno');

bleno.on('stateChange', function(state) {
  console.log('state changed to ' + state);
  if(state == 'poweredOn') {
    var name = 'name';
    var serviceUuids = ['fffffffffffffffffffffffffffffff0']
    bleno.startAdvertising(name, serviceUuids, function(error) {
      console.error('advertising callback: ' + error);
    });
    console.log('started advertising');
  }
});


