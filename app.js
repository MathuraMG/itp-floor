var express = require('express');
var client1 = require('./client.js');
var equipmentObject = require('./equipment.js');
var JSONData = require('./JSONData.js');

var app = express();
var c = new client1;

var noComplete = 0;


//To use static HTML pages
app.use(express.static('public'));

// Examples using Enertiv node module with Express
// See https://api.enertiv.com/docs/#!/api/ for available endpoints

/*
	*
	*		Important Info
	*
	*		Must hit '/login' first to authenticate
	*			- Follow setup in 'client.js'
	*		Most API endpoints use client info (client/location uuid)
	*		So, use '/client' to save that info for later use
	*
*/


// A couple boxes to push our API responses into
var clientData = {};
var topData = [];
var energyData = [];
var equipData = [];
var equipmentIds = [];


// Hit this first to authenticate and get current data
app.get('/login', function (req,res){
	var equipmentResponse = [];
	//console.log('potato');
	//var equipmentData;

	for(var i=0;i<JSONData.length;i++)
	{
		equipmentObject.getEquipmentData(JSONData[i], equipmentResponse,JSONData.length,res);
	}


});



// Start our server
var server = app.listen(process.env.PORT || 4000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('app listening at http://%s:%s', host, port);
});
