const
	google = require(`google`),
	palette = require(`../../utils/colorset.json`),
	msgWrapper = require(`../../utils/messageWrapper`);

module.exports.run = async (bot, message, keyword) => {

	let
		msg = keyword ? keyword.toLowerCase() : message.content.toLowerCase(),
		reply = new msgWrapper(message),
		keywords,
		
		keywordParsing = () => {
			msg = msg.replace(/[?!@,.-]/g, ``);
			return keywords = msg.slice(msg.indexOf(`what is`) + 8) + ` wikipedia`;
		},
		searching = async () => {
			google(keywords, async (err, res) => {
				try {
					let link;
					const scrappingLinks = () => {
						for(const i in res.links) {
							if(res.links[i].href !== null && res.links[i].description !== ``) {
								return link = res.links[i];
							}
						}
					};

					await scrappingLinks();
					reply.response(`${link.description}\n`, palette.crimson);
				}
				catch(e) {
					console.log(e);
					reply.response(e);
				}
			});
		};
	await keywordParsing();
	await searching();
	return console.log(`${message.author.tag} look up for "${keywords}".`);
};

module.exports.help = {
	name:`_automatedsearch`,
};