var request = require('request');
var server = require('../../../lib/backend');
var should = require('should');
var config = require('../../../config/config');

var url = 'http://localhost:' + config.app.http + '/ws3/';
var timeout = 10000;

describe('#E2E mongo test, server start  ', function () {
	before(function (done) {
		this.timeout(timeout);
		if(!server.active()) server.start();
		setTimeout(function () {
			done();
		}, 5000);
	});
	it('#mongo ok count all items', function (done) {
		this.timeout(timeout);
		var register = {"cid":"EL"};
		var options = {
			uri:url+'mongo.count',
			json:register
		};
		request.post(options, function (err, result) {
			should.not.exists(err);
			if (err) {
				done(err);
			}
			else {
				should.exists(result);
				done();
			}
		});
	});
	
	it('#mongo nok  error, fault param!', function (done) {
		this.timeout(timeout);
		var register = {"cido":'EL'};
		var options = {
			uri:url+'mongo.count',
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


