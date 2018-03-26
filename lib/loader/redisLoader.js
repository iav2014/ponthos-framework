var logger = require('../logger/logger').logger(__filename);
var config = require('../../config/config');
var redisConnector = require('../connectors/redis_connector');
var redisLink;

function redisLoader(callback) {
	redisConnector(config.redis, function (err, result) {
		if (err) {
			logger.error(err);
			callback(err);
		} else {
			redisLink=result;
			callback();
		}
	});
}
function getRedisLink(){
	return redisLink
}

module.exports.redisLoader = redisLoader;
module.exports.getRedisLink = getRedisLink;