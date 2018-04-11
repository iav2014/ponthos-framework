var logger = require('../logger/logger').logger(__filename);
var redisLink0 = require('redis');
var redisPool = require('./pool');

function redisConnector(config, callback) {
	var storeDB = new createClient(redisLink0, config.host, config.port,config.attempt);
	storeDB.select(config.database, function (err, res) {
		if (err) {
			logger.error('redis error set db0:' + err);
			callback(err);
		}
		else {
			logger.debug(`redis database:${config.database} set:${res}`);
			var uri=`${config.host}:${config.port}:${config.database}`;
			redisPool.set(uri,storeDB);
			callback(null,storeDB);
		}
	});
	storeDB.on('error', function (err) {
		logger.error("redis DB0 error: " + err);
		var uri=`${config.host}:${config.host}:${config.database}`;
		redisPool.remove(uri,storeDB);
		callback(err);
	});
	storeDB.on('connect', function () {
		logger.debug('connected to redis database:' + storeDB.address);
	});
	
}


function createClient(redis, host, port,attempt) {
	return redis.createClient({
		host: host, port: port,
		retry_strategy: function (options) {
			logger.info(JSON.stringify(options));
			if (!options.error) {
				try {
					if (options.error.code === 'ECONNREFUSED') {
						// End reconnecting on a specific error and flush all commands with a individual error
						logger.error('redis error:' + options.error.code);
						return new Error('The server refused the connection');
					}
					if (options.total_retry_time > 1000 * 60 * 60) {
						// End reconnecting after a specific timeout and flush all commands with a individual error
						return new Error('Retry time exhausted');
					}
					if (options.times_connected > 10) {
						// End reconnecting with built in error
						return undefined;
					}
				} catch (err) {
					logger.error(err);
				}
			}
			// reconnect after
			if(options.attempt>attempt){
				return null;
			}
			return Math.max(options.attempt * 300, 3000);
		}
	});
	
}

module.exports = redisConnector;