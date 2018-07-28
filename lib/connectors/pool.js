let pool = [];

let getPoolConnector = (db) => {
	if (!db) return null;
	for (let i = 0; i < pool.length; i++) {
		if (pool[i].url === db) return pool[i].connector;
	}
	return null;
}

let setPoolConnector = (db, con) => {
	pool.push({url: db, connector: con});
}

let getPoolLength = () => {
	return pool.length;
}

let removePoolConnector = (db) => {
	if (!db) return null;
	for (let i = 0; i < pool.length; i++) {
		if (pool[i].url == db) {
			pool.splice(i, 1);
			return i;
		}
	}
	return null;
}

let getUri = (uri) => {
	return (uri || null);
}

module.exports.get = getPoolConnector;
module.exports.set = setPoolConnector;
module.exports.remove = removePoolConnector;
module.exports.getLength = getPoolLength;
module.exports.getUri = getUri;

