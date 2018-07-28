let logger = require('../logger/logger').logger(__filename);
let config = require('../../config/config');
let mysqlConnector = require('../connectors/mysql_connector');

let mysqlLoader = (callback) => {
	mysqlConnector(config.sql.mysql, (err, result) => {
		if (err) {
			logger.error(err);
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}
module.exports.mysqlLoader = mysqlLoader;