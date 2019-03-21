const
	config = require(`../utils/botconfig.json`),
	intent = require(`../modules/neuralnet/custom_intents.json`);
   
module.exports = async (bot, message) => {

	const parsingMessages = async () => {
		let 
			mc = message.content.toLowerCase(),
			messageArray = mc.split(` `),
			prefix = config.prefix,
			cmd = messageArray[0],
			args = messageArray.slice(1);

		if(message.isMentioned(bot.user.id)) {
			return mc.length <= 21 ? bot.commands.get(`nlp`).run(bot, message) 
				: intent.definition.some(element => messageArray.includes(element)) ? bot.commands.get(`_automatedsearch`).run(bot, message)
					: null;
		}
		if(mc.startsWith(prefix)) {
			let cmdfile = bot.commands.get(cmd.slice(prefix.length));
			return cmdfile ? cmdfile.run(bot, message, args) : null;
		}
	};


	return message.channel.type === `dm` ? null : message.author.bot ? null : parsingMessages();

};