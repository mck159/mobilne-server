var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;
var Characteristic = require('./characteristic');

bleno.on('stateChange', function(state) {
  console.log('state changed to ' + state);
  if(state == 'poweredOn') {
    var name = 'name';
    var serviceUuids = ['fffffffffffffffffffffffffffffff0']
    bleno.startAdvertising(name, serviceUuids, function(error) {
        console.error('advertising callback: ' + error);
        if (!error) {
            bleno.setServices([
                new BlenoPrimaryService({
                    uuid: 'fffffffffffffffffffffffffffffff0',
                    characteristics: [
                        new Characteristic()
                    ]
                })
            ]);
        }
    });
    console.log('started advertising');
  }
});
