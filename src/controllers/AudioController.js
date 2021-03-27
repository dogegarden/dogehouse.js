const { getAudioClient } = require('../hooks/dogehouse.js-audio');

class AudioController {

	constructor(client) {
		this._client = client;
	}

	initialize() {}

	transmit() {}

	receive() {}

}

module.exports = AudioController;
