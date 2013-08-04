var request = require('request')
  , _       = require('lodash')
  , js2xml  = require('js2xmlparser')
  , xml2js  = require('xml2js').parseString

function mapCreditCard(cc) {
  var card = {
    cardNumber: cc.number,
    expireMonth: cc.expire.month,
    expireYear: '20' + cc.expire.year,
    cvn: cc.cvv
  }

  return card;
}

function mapAddress(address, email) {
  var bfAddress = {
    firstName: address.name.first,
    lastName: address.name.last,
    addressLine1: address.line[0],
    addressLine2: address.line[1] || undefined,
    city: address.city,
    region: address.state || undefined,
    postalCode: address.zip,
    countryCode: address.country,
    email: email,
    primaryPhone: address.phone
  }

  bfAddress = _.omit(bfAddress, function(value) {
    return value === undefined;
  });

  return bfAddress;
}

function callApi(options, callback) { //auth, url, json, callback) {
  if (!(options && options.url)) {
    return callback(new Error('Missing required parameters for API request'));
  }

  if (!(options && options.authorization && options.authorization.username && options.authorization.password)) {
    return callback(new Error('Missing required authentication parameters for API request'));
  }

  if (!(options && options.json && typeof options.json === 'object')) {
    return callback(new Error('JSON data must be an object'));
  }

  options = _.defaults(options, {
    json: {}
  });

  var xml = js2xml('message', options.json, {
      prettyPrinting: {
        indentString: '  '
      }
    })
    , credentials = {
      user: options.authorization.username,
      pass: options.authorization.password,
      sendImmediately: true
    };

  request({
    uri: options.url,
    method: 'POST',
    body: xml,
    auth: credentials
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    } else if (response.statusCode !== 200) {
      return callback(new Error('Bad status code: ' + response.statusCode));
    }

    xml2js(body, function(error, js) {
      var json = {};

      try {
        json = js.message.payload[0];
      } catch(e) {
        return callback('Error parsing response');
      }

      return callback(error, json);
    });
  });
}

module.exports = {
  mapCreditCard: mapCreditCard,
  mapAddress: mapAddress,
  callApi: callApi
};
