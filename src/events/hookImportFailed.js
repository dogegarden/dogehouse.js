module.exports = (app) => {
	app.on('hookImportFailed', err => {
		console.log('Hook import fail');
	})
}