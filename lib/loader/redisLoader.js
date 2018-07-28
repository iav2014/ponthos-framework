let logger = require('../logger/logger').logger(__filename);
let config = require('../../config/config');
let redisConnector = require('../connectors/redis_connector');
let redisLink;

let redisLoader = (callback) => {
	redisConnector(config.redis, (err, result) => {
		if (err) {
			logger.error(err);
			callback(err);
		} else {
			redisLink = result;
			callback();
		}
	});
}
let getRedisLink = () => {
	return redisLink
}

module.exports.redisLoader = redisLoader;
module.exports.getRedisLink = getRedisLink;