const
	Discord = require(`discord.js`),
	credentials = require(`../../login.json`),
	GoogleImages = require(`google-images`),
	palette = require(`../../utils/colorset.json`);

module.exports.run = async (bot, message)=>{

	let
		query = message.content.substring(11),
		client = new GoogleImages(credentials.CSE_ID, credentials.API_KEY);

	await client.search(query)
		.then(images => {
			let
				query_1 = images[0],
				embed = new Discord.RichEmbed()
					.setColor(palette.darkmatte)
					.setDescription(`**${query_1.description}**\n${query_1.parentPage}`)
					.setImage(query_1.url);

			console.log(query_1);
			return message.channel.send(embed);

		});
};
module.exports.help = {
	name:`searchimg`,
};