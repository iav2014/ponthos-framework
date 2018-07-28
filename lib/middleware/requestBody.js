/*
this middleware only display request body before calling route
 */
let logger = require('../logger/logger').logger(__filename);
let requestBodyParams = (req, res, next) => {
	logger.warn('post:' + JSON.stringify(req.body));
	next();
};
module.exports.requestBodyParams = requestBodyParams;

