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

function callApi(conf, json, callback) {
  var checkout = conf.checkout
    , xml = js2xml('message', json, {
        prettyPrinting: {
          indentString: '  '
        }
      })
    , credentials = {
        user: checkout.username,
        pass: checkout.password,
        sendImmediately: true
      }

  request({
    uri: checkout.url,
    method: 'POST',
    body: xml,
    auth: credentials
  }, function(error, response, body) {
    if (error) {
      return callback(error);
    } else if (response.statusCode !== 200) {
      return callback(new Error('Bad status code ' + response.statusCode));
    }

    xml2js(body, function(error, js) {
      return callback(error, js);
    });
  });
}

module.exports = {
  mapCreditCard: mapCreditCard,
  mapAddress: mapAddress,
  callApi: callApi
};
