'use strict'

var express = require('express')
, app = express()
, bodyParser = require('body-parser')
, request = require('request')
, _ = require('lodash');

const API_KEY = '76b3f1c8-c7cf-4565-8f7e-ac6bfffeed79';

app.use(bodyParser.json());

app.post('/order', function(req, res) {
    console.log('=========================')
    console.log((new Date()).toUTCString())
    console.log('=== request query ===')
    console.log(req.query);
    console.log('=== request payload ===')
    console.log(JSON.stringify(req.body))


    var referenceId = _.get(req, 'body.orders[0].id');
    var deliveryInstructions = _.get(req, 'body.orders[0].instructions');
    var len = _.get(req, 'body.orders[0].items.length');
    var items = [];
    
    for(var i = 0; i < len; i++) {
        var qty = _.get(req, 'body.orders[0].items[' + i + '].quantity');
        var sku =  _.get(req, 'body.orders[0].items[' + i + '].name');
        var desc = _.get(req, 'body.orders[0].items[' + i + '].instructions');
        var cost = _.get(req, 'body.orders[0].items[' + i + '].price');
        
        items.push({
            quantity: qty,
            sku: sku,
            description: desc,
            price: cost,
        });
    }

    var clientName = _.get(req, 'body.orders[0].client_first_name') + ' ' + _.get(req, 'body.orders[0].client_last_name')
    , restaurantName =  _.get(req, 'body.orders[0].restaurant_name')
    , clientPhone = _.get(req, 'body.orders[0].client_phone')
    , restaurantPhone = _.get(req, 'body.orders[0].restaurant_phone')
    , clientEmail = _.get(req, 'body.orders[0].client_email')
    , restaurantEmail = _.get(req, 'body.orders[0].restaurant_phone')
    , description = _.get(req, 'body.orders[0].client_phone')
    , addressComponents = _.get(req, 'body.orders[0]', ' ')
    , restaurantCountry = _.get(req, 'body.orders[0].restaurant_country')
    , restaurantState = _.get(req, 'body.orders[0].restaurant_state')
    , restaurantCity = _.get(req, 'body.orders[0].restaurant_state')
    , restaurantStreet = _.get(req, 'body.orders[0].restaurant_street')
    , restaurantZipcode = _.get(req, 'body.orders[0].restaurant_zipcode')
    , restaurantLatitude = _.get(req, 'body.orders[0].restaurant_latitude')
    , restaurantLongitude  = _.get(req, 'body.orders[0].restaurant_longitude')
    , restaurantAddress = restaurantName + ', ' + restaurantStreet + ', ' + restaurantCity +',' + restaurantState + ', ' + restaurantZipcode
    , clientLatitude = _.get(req, 'body.orders[0].latitude')
    , clientLongitude = _.get(req, 'body.orders[0].longitude')
    , clientAddress = _.get(req, 'body.orders[0].client_address')
    , fulifilledAt = _.get(req, 'body.orders[0].fulfill_at', new Date())
    , time = new Date(fulifilledAt)
    , pickupTime = time.setHours(time.getHours() - 2)
    , pickupTime = time.toISOString(pickupTime);

    var data = {
        apiKey: API_KEY,
        booking: {
            reference: referenceId,
            deliveryInstructions: _.get(req, 'body.orders[0].instructions'),
            itemsRequirePurchase: false,
            items:items,
            pickupTime: pickupTime,
            pickupDetail: { 
                name: restaurantName,
                phone: restaurantPhone,
                email: null,
                description: null,
                addressComponents: restaurantAddress,
                address: restaurantAddress,
                additionalAddressDetails: {
                    stateProvince: restaurantState,
                    country: restaurantCountry,
                    suburbLocality: restaurantStreet,
                    postcode: restaurantZipcode,
                    latitude: restaurantLatitude,
                    longitude: restaurantLongitude
                }   
            },
            dropoffWindow: {
                earliestTime: fulifilledAt,
                latestTime: fulifilledAt
            },
            dropoffDetail: {
                name: clientName,
                phone: clientPhone,
                email: clientEmail,
                description: deliveryInstructions,
                addressComponents: restaurantAddress,
                address: restaurantAddress,
                additionalAddressDetails: {
                    stateProvince: restaurantState,
                    country: restaurantCountry,
                    suburbLocality: restaurantStreet,
                    postcode: restaurantZipcode,
                    latitude: clientLatitude,
                    longitude: clientLongitude
                }
            }
        }
    };

    console.log('=== getswift request payload ===')
    console.log(JSON.stringify(data));
    
    request({
            url: 'https://app.getswift.co/api/v2/deliveries',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
    }, callback);

    function callback(error, response, body) {
        if (error) {
            console.log('=== error ===');
            console.log(error);
            res.status(200).send(error);
        } else {
            console.log('=== response ===');
            console.log(JSON.parse(body));
            res.status(200).send(JSON.parse(body));
        }
    }
});

app.listen(5000, function () {
    console.log('Gloria app listening on port 5000!');
});
