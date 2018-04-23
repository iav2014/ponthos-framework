/* list of all routes */
var translatorRoute = require('./mobile/translator');
var pingRoute = require('./mobile/ping');
var mongoRoute = require('./mongo/mongo');
var redisRoute = require('./redis/redis');
var postgresRoute = require('./postgres/postgres');
var mysqlRoute = require('./mysql/mysql');

function register(app) {
	translatorRoute.registerRoutes(app);
	pingRoute.registerRoutes(app);
	// add your routes here ,,,,
	// mongo route example
	mongoRoute.registerRoutes(app);
	redisRoute.registerRoutes(app);
	postgresRoute.registerRoutes(app);
	mysqlRoute.registerRoutes(app);
}

module.exports.register = register;