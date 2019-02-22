const
	palette = require(`../../utils/colorset.json`),
	translate = require(`@vitalets/google-translate-api`),
	msgWrapper = require(`../../utils/messageWrapper`);

module.exports.run = async (_bot, message, args)=>{


	translates();

	async function translates() {
		const reply = new msgWrapper(message);
		if(!args[0])return reply.response(`Do you need any help with my translation?\n look up in [google documentation](https://developers.google.com/admin-sdk/directory/v1/languages) for language code reference.`);
		if(!args[1] && translate.languages[args[0]])return reply.response(`Yes, i could do **${translate.languages[args[0]]}** translation. Please put the sentence next to it.`);
		const prefix = message.content.substring(12 + args[0].length);

		translate(prefix, { to: args[0] })
			.then(res => {
				res.text === prefix
					? reply.response(`It has similar result with your sentence.`, palette.crimson)
					: reply.response(`"**${res.text}**"`, palette.crimson);
			})
			.catch(e => {
				const user = message.author.username;
				console.error(e);
				reply.response(`Sorry **${user}**, i encountered an error while translating your request.`, palette.crimson);
			});
	}
};
module.exports.help = {
	name:`translate`,
};

