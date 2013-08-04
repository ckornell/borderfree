var bf = require('./main')
var address = {
  name: {
    first: 'Ben',
    last: 'Kramer'
  },
  line: [
    '2313 E Carson St',
    ''
  ],
  city: 'Pittsburgh',
  state: 'PA',
  zip: '15203',
  country: 'US',
  phone: '4125674903'
}
var email = 'benjamin.kramer@brandingbrand.com'

address = bf.mapAddress(address, email)

console.log(address)

function iterate_over_object(object) {
  for (key in address) {
    if (address.hasOwnProperty(key)) {
      console.log(typeof address[key])
      // switch (typeof address[key]) {
      //   case 'function':
      //     console.log('function')
      //     break;

      //   case 'object':
      //     iterate_over_object(address[key]);
      //     break;

      //   default:
      //     console.log(address[key])
      // }
    }
  }
}