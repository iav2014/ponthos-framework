let log4js = require('log4js');
let util = require('util');
let moment = require('moment');
let config = require('../../config/config');
let stackTrace = require('stack-trace');
log4js.configure(config.logger);
let logger = log4js.getLogger();
module.exports.logger = function (operationCode) {
	'use strict';
	let customLogger = {};
	['debug', 'info', 'warn', 'error', 'fatal', 'express'].forEach(
		(levelString) => {
			customLogger[levelString] = function (message) {
				let frame, line, column, method;
				frame = stackTrace.get()[1];
				line = frame.getLineNumber();
				column = frame.getColumnNumber();
				method = frame.getFunctionName();
				method === null ? method = 'anonymous' : method = method;
				let operation;
				operation = operationCode ? operationCode : 'NA';
				let formatedMessage = util.format('%s|[%s(%s,%s)]|[%s]|%s',
					process.pid, method, line, column, operation, message);
				if (levelString === 'express') {
					return moment().format('YYYY-MM-DDThh:mm:ssZZ') + '|EXPRESS|' + formatedMessage;
				}
				logger[levelString](formatedMessage);
			};
		});
	return customLogger;
};



