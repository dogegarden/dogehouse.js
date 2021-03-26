const { isAngular } = require('antiangular');
const { normalizeUnicodeText } = require('normalize-unicode-text');
const { fromFakeUTF8String } = require('ocaml-string-convert');
const stripBom = require('strip-bom');
const iconv = require('iconv-lite');

/** @todo */
function blacklistUUID() {}


module.exports = (app) => {
	app.on('newChatMessage', async msg => {

		if (msg.author.id == app.bot.id) return;

		const test0 = isAngular(await msg.author.username)
		const test1 = isAngular(msg.content);
		const test2 = isAngular(normalizeUnicodeText(msg.content));
		const test3 = isAngular(fromFakeUTF8String(msg.content));
		const test4 = isAngular(stripBom(iconv.decode(Buffer.from(msg.content), 'utf8')));
		const test5 = isAngular(stripBom(msg.content))

		if (test0 || test1 || test2 || test3 || test4 || test5) {
			console.log({angularTests: { test0, test1, test2, test3, test4, test5 }});
			msg.delete().then(() => {
				msg.reply('You shall not say the forbidden framework.', {whispered: true})
			})
		}
	});
}

/**
 * 
 * 
 * 
 * aηguꞁar
 * ang∪lar
 * ÅᏁ₲∪Łaर
 * Ån₲∪ŁÅर
 * ÅᏁ₲∪ŁÅर
 * aῇguꞁar
 * 
 * 
 * 
 */
