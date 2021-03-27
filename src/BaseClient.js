const fs = require('fs')
const path = require('path')
const EventEmitter = require('events');
const { EVENT } = require('./util/constraints');
const { randomUUID } = require('./util/random');

class BaseClient extends EventEmitter{
	
	constructor() {
		super(); // Call Event Emitter
	}

	/** @private */
	get randStrConst () {
		return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	}

	/**
	 * Generate a random string
	 * 
	 * This function will generate a random string based on the length you provided.  Once generated,
	 * it will return a your random string.
	 * 
	 * @param {Number} length Length of the random string
	 * 
	 * @function
	 * @returns {String}
	 */
	randStr(length) {
		let result = '';
		let charLength = this.randStrConst.length;

		for (let i = 0; i < length; i++) {
			result += this.randStrConst.charAt(Math.floor(Math.random() * charLength));
		}

		return result;
	}

	/**
	 * Register Events
	 * 
	 * This function will register all of the internal event handlers.  This will allow us
	 * to listen for events independantly of anything else.
	 * 
	 * @param {String} dir Events Directory
	 * 
	 * @private
	 * @function
	 * @returns {Promise<any>}
	 */
	registerEvents(dir) {
		return new Promise(async (resolve, reject) => {
			fs.readdir(dir, async (err, files) => {
				for (const f of files) {
					const fn = require(path.resolve(dir, f));
					this._eventCache.set(f.split('.')[0], fn);
				}
				return resolve();
			});
		});
	}

	/**
	 * Register Hooks
	 * 
	 * This function will gather all of the hooks from the hooks directory.  Once they're pulled, they will be
	 * put into the hooks collection which can be accessed globally.  Once they're in the hooks collection, they
	 * can be delcared anywhere.
	 * 
	 * @param {String} dir Hooks Directory
	 * 
	 * @private
	 * @function
	 * @returns {Promise<any>}
	 */
	registerHooks(dir) {
		return new Promise(async (resolve, _reject) => {
			fs.readdir(dir, async (err, files) => {
				for (const f of files) {
					let hook;
					const hk = require(path.resolve(dir, f));
					if (!hk instanceof Object) return;
					try {
						hook = require.resolve(hk.package);
					} catch (err) {
						this.emit(EVENT.IMPORT_HOOK_FAILED, err);
						return;
					}
					await this._hooks.set(hk.name || hk.package, require(hk.package));
					this.emit(EVENT.IMPORT_HOOK_SUCCESS, this._hooks.get(hk.name));
					return resolve();
				}
			})
		})
	}

	generateUUID() {
		return randomUUID();
	}
}

module.exports = BaseClient;