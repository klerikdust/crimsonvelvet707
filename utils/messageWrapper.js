const Discord = require(`discord.js`);
const palette = require(`./colorset.json`);
const embed = new Discord.RichEmbed();

class msgWrapper {
	constructor(message) {
		this.message = message;
	}

	response(content, hexcolor = palette.darkmatte, target = `channel`, time = 1500) {
		embed.setColor(hexcolor)
			.setDescription(content);

		this.message[target].startTyping();
		setTimeout(() => {
			this.message[target].stopTyping();
			return this.message[target].send(embed);
		}, time);
	}
}

module.exports = msgWrapper;