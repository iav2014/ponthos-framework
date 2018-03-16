module.exports = {
	
	public_dir: '/Users/ariza/Documents/codigo/skmo-api/public',
	app: {
		host: '0.0.0.0',
		http: 3000,
		https: 3443
	},
	rest: {
		path: '/ws3/',
		max_callers: 1000
	},
	logger: {
		levels: {
			default: 'DEBUG'
		},
		appenders: [
			{
				category: '[all]',
				type: 'console',
				layout: {
					type: 'pattern',
					pattern: '%d{yyyy-MM-ddThh:mm:ssO}|%[%p%]|%m'
				}
			}
		],
		replaceConsole: false
	},
	
	nosql: {
		ok: 'connected to database:',
		fail: 'error connection at database',
		database_policy: {
			retry: 0
		},
		test: {
			//@ format mongodb://<dbUser>:<dbPassword>@<host1>:<port1>,<host2>:<port2>/<dbName>?replicaSet=<replicaSetName>
			uri: "mongodb://localhost:27017,localhost:27018,localhost:27019/test?replicaSet=rs0",
			options: {
				keepAlive: 1,
				connectTimeoutMS: 30000,
				socketTimeoutMS: 0,
				autoReconnect: true
			}
		},
		test2: {
			//@ format mongodb://<dbUser>:<dbPassword>@<host1>:<port1>,<host2>:<port2>/<dbName>?replicaSet=<replicaSetName>
			uri: "mongodb://localhost:27017,localhost:27018,localhost:27019/test2?replicaSet=rs0",
			options: {
				keepAlive: 1,
				connectTimeoutMS: 30000,
				socketTimeoutMS: 0,
				autoReconnect: true
			}
		}
	},
};
