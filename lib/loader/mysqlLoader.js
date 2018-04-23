var logger = require('../logger/logger').logger(__filename);
var config = require('../../config/config');
var mysqlConnector = require('../connectors/mysql_connector');

function mysqlLoader(callback) {
	mysqlConnector(config.sql.mysql, function (err, result) {
		if (err) {
			logger.error(err);
			return callback(err);
		} else {
			return callback(null,result);
		}
	});
}
module.exports.mysqlLoader = mysqlLoader;