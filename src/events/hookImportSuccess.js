module.exports = (app) => {
	app.on('hookImportSuccess', (hook) => {
		console.log('Hook Import Success');
	})
}