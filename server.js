'use strict'

var express = require('express')
, app = express()
, bodyParser = require('body-parser')
, request = require('request')
, _ = require('lodash');

app.use(bodyParser.json());


app.post("/order", function(req, res){

	/*console.log(req.query);
	console.log(req.body);*/

	var referenceId = req.body.orders[0].id;
	var deliveryInstructions = req.body.orders[0].instructions;
	var len = req.body.orders[0].items.length;
	var items = [];
	for(var i = 0; i<len; i++){
		var qty = _.get(req.body.orders[0], 'items['+i+'].quantity');
		 var sku =  _.get(req.body.orders[0], 'items['+i+'].name');
		 var desc = _.get(req.body.orders[0], 'items['+i+'].instructions');
		 var cost = _.get(req.body.orders[0], 'items['+i+'].price');
		items.push( {
	        "quantity": qty,
	        "sku": sku,
	        "description": desc,
	        "price": cost,
	    });
	}
	var clientName = _.get(req.body.orders[0], 'client_first_name')+' ' +_.get(req.body.orders[0], 'client_last_name')
	, restaurantName =  _.get(req.body.orders[0], 'restaurant_name')
	, clientPhone = _.get(req.body.orders[0], 'client_phone')
	, restaurantPhone = _.get(req.body.orders[0], 'restaurant_phone')
	, clientEmail = _.get(req.body.orders[0], 'client_email')
	, restaurantEmail = _.get(req.body.orders[0], 'restaurant_phone')
	, description = _.get(req.body.orders[0], 'client_phone')
	, addressComponents = _.get(req.body.orders[0], '	')
	, restaurantCountry = _.get(req.body.orders[0], 'restaurant_country')
	, restaurantState = _.get(req.body.orders[0], 'restaurant_state')
	, restaurantCity = _.get(req.body.orders[0], 'restaurant_state')
	, restaurantStreet = _.get(req.body.orders[0], 'restaurant_street')
	, restaurantZipcode = _.get(req.body.orders[0], 'restaurant_zipcode')
	, restaurantLatitude = _.get(req.body.orders[0], 'restaurant_latitude')
	, restaurantLongitude  = _.get(req.body.orders[0], 'restaurant_longitude')
	, restaurantAddress = restaurantName+', '+restaurantStreet+', '+restaurantCity+','+restaurantState+', '+restaurantZipcode
	, clientLatitude = _.get(req.body.orders[0], 'latitude')
	, clientLongitude = _.get(req.body.orders[0], 'longitude')
	, clientAddress = _.get(req.body.orders[0], 'client_address')
	, fulifilledAt = _.get(req.body.orders[0], 'fulfill_at')
	, time = new Date(fulifilledAt)
	, pickupTime = time.setHours(time.getHours()-2)
	, pickupTime = time.toISOString(pickupTime);

	var data = {
	  "apiKey": "76b3f1c8-c7cf-4565-8f7e-ac6bfffeed79",
	  "booking": {
		  "reference": referenceId,
		  "deliveryInstructions": req.body.orders[0].instructions,
		  "itemsRequirePurchase": false,
		  "items":items,
		  "pickupTime": pickupTime,
		  "pickupDetail": { 
	        	"name": restaurantName,
			      "phone": restaurantPhone,
			      "email": null,
			      "description": null,
			      "addressComponents": restaurantAddress,
			      "address": restaurantAddress,
			      "additionalAddressDetails": {
		          "stateProvince": restaurantState,
		          "country": restaurantCountry,
		          "suburbLocality": restaurantStreet,
		          "postcode": restaurantZipcode,
		          "latitude": restaurantLatitude,
		          "longitude": restaurantLongitude
	        	}	
	    	},
	    	"dropoffWindow": {
		      "earliestTime": fulifilledAt,
		      "latestTime": fulifilledAt
		    },
		    "dropoffDetail": {
		      "name": clientName,
		      "phone": clientPhone,
		      "email": clientEmail,
		      "description": deliveryInstructions,
		      "addressComponents": restaurantAddress,
		      "address": restaurantAddress,
		      "additionalAddressDetails": {
		        "stateProvince": restaurantState,
		        "country": restaurantCountry,
		        "suburbLocality": restaurantStreet,
		        "postcode": restaurantZipcode,
		        "latitude": clientLatitude,
		        "longitude": clientLongitude
		      }
    		}
		}
	}

	console.log("requestData" + JSON.stringify(data));
	
	request({
	        url:'https://app.getswift.co/api/v2/deliveries',
	        method: 'POST',
	        headers:{
	            'Content-Type': 'application/json',
	        },
	        body: JSON.stringify(data)
	}, callback);

    function callback(error, response, body){
    	if (error) {
    		console.log("Error : " + error);
    		res.status(400).send(error);
    	} else {
    		console.log(JSON.parse(body));
	        res.status(200).send(JSON.parse(body));
    	}
    }
});

app.listen(3000, function () {
    console.log('Gloria app listening on port 3000!');
});
