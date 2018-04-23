var request = require('request');
var server = require('../../../lib/backend');
var should = require('should');
var config = require('../../../config/config');

var url = 'http://localhost:' + config.app.http + '/ws3/';
var timeout = 10000;

describe('#E2E mysql test, server start  ', function () {
	before(function (done) {
		this.timeout(timeout);
		if(!server.active()) server.start();
		setTimeout(function () {
			done();
		}, 5000);
	});
	it('#mysql ok count all items', function (done) {
		this.timeout(timeout);
		var register = {"track_id":"1"};
		var options = {
			uri:url+'mysql.cache',
			json:register
		};
		request.post(options, function (err, result) {
			should.not.exists(err);
			if (err) {
				done(err);
			}
			else {
				should.exists(result);
				console.log(result.body.length);
				done();
			}
		});
	});
	
	it('#mysql nok  error, fault param (track_id)!', function (done) {
		this.timeout(timeout);
		var register = {"cido":'EL'};
		var options = {
			uri:url+'mysql.cache',
			json:register
		};
		request.post(options, function (err, result) {
			should.not.exists(err);
			if (err) {
				done(err);
			}
			else {
				should.exists(result);
				//result.body.valid.should.be.equal(false);
				done();
			}
		});
	});
	
});


