const Discord = require(`discord.js`);
const palette = require(`./colorset.json`);
const embed = new Discord.RichEmbed();

class msgWrapper {
	constructor(message) {
		this.message = message;
	}
	/**
	 *  Used message template most of the time
	 *  @param content, content of the first message
	 *  @param hexcolor, hexcode for embed color
	 *  @param target, target channel
	 *  @param time, the interval time between typing animation and message
	 */
	response(content, hexcolor = palette.darkmatte, target = `channel`, time = 1500) {
		embed.setColor(hexcolor)
			.setDescription(content);

		this.message[target].startTyping();
		setTimeout(() => {
			this.message[target].stopTyping();
			return this.message[target].send(embed);
		}, time);
	}

	/**
	 * 	This function was intentionally built for weather forecast in order
	 * 	to get more natural feeling of delivering the information
	 *  @param content1, content of the first message
	 *  @param content2, content of the second message
	 *  @param hexcolor, hexcode for embed color
	 *  @param target, target channel
	 *  @param time, the interval time between typing animation and message
	 */
	multi_response(content1, content2, hexcolor = palette.darkmatte, target = `channel`, time = 1500) {
		embed.setColor(hexcolor)
			.setDescription(content1);

		// First piece of message.
		this.message[target].startTyping();
		setTimeout(() => {
			this.message[target].stopTyping();
			this.message[target].send(embed);
		}, time);
		
		// Second piece of message, followed by natural typing effect interval.
		setTimeout(() => {
			embed.setDescription(content2);
			this.message[target].startTyping();
			setTimeout(() => {
				this.message[target].stopTyping();
				this.message[target].send(embed);
			}, time);
		}, time + 500);
	}
}

module.exports = msgWrapper;