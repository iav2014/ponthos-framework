/*
 SKMO-apiPrototype
 @goal: skmo scalable api-rest
 @author: Nacho Ariza 2017
 @ start single || cluster mode
 */
var fs = require('fs');
var util = require('util');
var cluster = require('cluster');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var helmet = require('helmet');
var qt = require('quickthumb');
var generalRoutes = require('./routes/loadingRoutes');

var mongoTestLoader = require('./loader/mongoTest'); // mongodb db test connector
//var mongoTest2Loader = require('./loader/mongoTest2'); // mongodb db test connector
var redisLoader = require('./loader/redisLoader');
var router = express.Router();
var app = express();
var https = require('https');
var http = require('http');
var async = require('async');
var config = require('../config/config'); // config file
var logger = require('./logger/logger').logger(__filename);
var log4js = require('log4js');
var theAppLog = log4js.getLogger();
var middleware = require('./middleware/requestBody');
var theHTTPLog = morgan(':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
	'stream': {
		write: function (str) {
			theAppLog.debug(str);
		}
	}
});
var started = false;

function start() {
	var key = fs.readFileSync('./cert/server.key'); // your server.key && pem files
	var cert = fs.readFileSync('./cert/server.pem')
	var https_options = {
		key: key,
		cert: cert
	};
	logger.info('Starting server, please wait...');
	var _ttl =  '1 minute';
	app.use(helmet());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json({limit: '5mb'}));
	app.use('/', router);
	app.use(theHTTPLog);
	app.use(methodOverride());
	app.use(qt.static(process.cwd() + '/public',{type:'resize'}));
	app.use(express.static(process.cwd() + '/public')); // for public contents
	app.use(middleware.requestBodyParams);
	generalRoutes.register(app);
	app.disable('x-powered-by');
	
	https.createServer(https_options, app).listen(config.app.https).on('error', function (err) {
		if (err) {
			logger.error(err);
			process.exit(1);
		}
	});
	http.createServer(app).listen(config.app.http).on('error', function (err) {
		if (err) {
			logger.error(err);
			process.exit(1);
		}
	});
	// if yoy have a mongo & redis database,,,
	var _loaders = [mongoTestLoader.mongodbLoader,redisLoader.redisLoader];
	//var _loaders = []; // if you don't have a mongo database o redis uncomment this line,,,
	async.series(_loaders,
		function (err, result) {
			if (err) {
				logger.error(util.format('Something went wrong in booting time (%s)', err));
				process.exit(1);
			} else {
				logger.info('Server started at ports [' + config.app.http + ',' + config.app.https + ']');
				started = true;
			}
		});
}

function startInCluster() {
	if (!cluster.isMaster) {
		start();
	}
	else {
		var threads = require('os').cpus().length;
		while (threads--) cluster.fork();
		cluster.on('death', function (worker) {
			cluster.fork();
			logger.info('Process died and restarted, pid:', worker.pid);
		});
	}
}

function active() {
	return started;
}

function stop() {
	process.exit(0);
}

exports.start = start;
exports.startInCluster = startInCluster;
exports.active = active;
exports.stop = stop;
