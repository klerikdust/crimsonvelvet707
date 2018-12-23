const Discord = require("discord.js");
const palette = require("../../utils/colorset");

module.exports.run = async (bot, message, args, dynamicMessage) => {

	function measuringLatency(ms) {
		const predict = ['weak', 'Fair', 'stable'];

		if(ms <= 30) {
			return `Yay! pretty **${predict[2]}**!`;
		}
		else if (ms < 60) {
			return `**${predict[1]}** latency.`;
		}
		else {
			return `Sorry, It seems my connection is pretty **${predict[0]}** at the moment.`;
		}

	}	
		const ping = await measuringLatency(Math.round(bot.ping));
		const embed = new Discord.RichEmbed()
			.setColor(palette.darkmatte)
			.setDescription(`${ping} request taken in **${Math.round(bot.ping)}ms**`)


		return message.channel.send(embed)

			}


module.exports.help = {
	name: "ping"
}