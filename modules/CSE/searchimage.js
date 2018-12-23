const Discord = require('discord.js');
const GoogleImages = require('google-images');
const palette = require("../../utils/colorset.json");

module.exports.run = async(bot,message,args)=>{

let query = message.content.substring(11);
const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);

await client.search(query).then(images => {

		const query_1 = images[0];
		let embed = new Discord.RichEmbed()
						.setColor(palette.darkmatte)
						.setDescription(`**${query_1.description}**\n${query_1.parentPage}`)
						.setImage(query_1.url);

		console.log(query_1)
	      	return message.channel.send(embed)

      })
 }
module.exports.help={
    name:"searchimg"
}