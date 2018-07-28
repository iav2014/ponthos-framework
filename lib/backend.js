/*
 SKMO-apiPrototype
 @goal: skmo scalable api-rest
 @author: Nacho Ariza 2017
 @ start single || cluster mode
 */
let fs = require('fs');
let util = require('util');
let cluster = require('cluster');
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let helmet = require('helmet');
let qt = require('quickthumb');
let generalRoutes = require('./routes/loadingRoutes');

let mongoTestLoader = require('./loader/mongoTest'); // mongodb db test connector
//let mongoTest2Loader = require('./loader/mongoTest2'); // mongodb db test connector
let redisLoader = require('./loader/redisLoader');
let postgresqlLoader = require('./loader/postgresqlLoader');
let mysqlLoader = require('./loader/mysqlLoader');
let router = express.Router();
let app = express();
let https = require('https');
let http = require('http');
let async = require('async');
let config = require('../config/config'); // config file
let logger = require('./logger/logger').logger(__filename);
let log4js = require('log4js');
let theAppLog = log4js.getLogger();
let middleware = require('./middleware/requestBody');
let theHTTPLog = morgan(':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
	'stream': {
		write: function (str) {
			theAppLog.debug(str);
		}
	}
});
let started = false;

let start = () => {
	let key = fs.readFileSync('./cert/server.key'); // your server.key && pem files
	let cert = fs.readFileSync('./cert/server.pem')
	let https_options = {
		key: key,
		cert: cert
	};
	logger.info('Starting server, please wait...');
	let _ttl = '1 minute';
	app.use(helmet());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json({limit: '5mb'}));
	app.use('/', router);
	app.use(theHTTPLog);
	app.use(methodOverride());
	app.use(qt.static(process.cwd() + '/public', {type: 'resize'}));
	app.use(express.static(process.cwd() + '/public')); // for public contents
	app.use(middleware.requestBodyParams);
	generalRoutes.register(app);
	app.disable('x-powered-by');
	
	https.createServer(https_options, app).listen(config.app.https).on('error', (err) => {
		if (err) {
			logger.error(err);
			process.exit(1);
		}
	});
	http.createServer(app).listen(config.app.http).on('error', (err) => {
		if (err) {
			logger.error(err);
			process.exit(1);
		}
	});
	// if you have a mysql & mongo & redis & postgres databases,,,
	let _loaders = [mysqlLoader.mysqlLoader, mongoTestLoader.mongodbLoader]; //, redisLoader.redisLoader]; // if you don't have a mongo database o redis uncomment this line,,,
	// if you don´t have any databases,,,
	//let _loaders = [mongoTestLoader.mongodbLoader];
	async.series(_loaders,
		(err, result) => {
			if (err) {
				logger.error(util.format('Something went wrong in booting time (%s)', err));
				process.exit(1);
			} else {
				logger.info('Server started at ports [' + config.app.http + ',' + config.app.https + ']');
				started = true;
			}
		});
}

let startInCluster = () => {
	if (!cluster.isMaster) {
		start();
	}
	else {
		let threads = require('os').cpus().length;
		while (threads--) cluster.fork();
		cluster.on('death', function (worker) {
			cluster.fork();
			logger.info('Process died and restarted, pid:', worker.pid);
		});
	}
}

let active = () => {
	return started;
}

let stop = () => {
	process.exit(0);
}

exports.start = start;
exports.startInCluster = startInCluster;
exports.active = active;
exports.stop = stop;
