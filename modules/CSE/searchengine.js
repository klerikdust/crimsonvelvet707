const
	Discord = require(`discord.js`),
	google = require(`google`),
	palette = require(`../../utils/colorset.json`);

exports.run = async (bot, message)=>{
	google.resultsPerPage = 1;
	let
		nextCounter = 0,
		query = message.content.substring(8),
		embed = new Discord.RichEmbed();

	message.channel.send(`**${message.author.username}**, I've got best match for "${query}.."`);
	google(query, function(err, res) {
		try {
			let temp = ``;
			for (let i = 0; i < res.links.length; ++i) {
				let link = res.links[i];
				temp += `**${link.title} - ${link.href}**\n\u200b\u200b${link.description}\n`;
			}
			embed
				.setColor(palette.darkmatte)
				.setDescription(temp);
			message.channel.send(embed);
		}
		catch(e) {
			console.log(e);
			embed
				.setColor(palette.darkmatte)
				.setDescription(e);
		}

		if (nextCounter < 4) {
			nextCounter += 1;
			if (res.next) res.next();
		}
	});
};
exports.help = {
	name:`search`,
};