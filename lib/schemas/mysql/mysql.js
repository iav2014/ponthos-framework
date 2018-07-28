let schema = {
	properties: {
		track_id: {
			type: 'string',
			required: true,
			message: 'track_id field  property is required'
		}
	}
}
module.exports.schema = schema;