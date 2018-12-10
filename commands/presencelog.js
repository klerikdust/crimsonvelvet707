const Discord = require('discord.js');
const config = require("../botconfig.json");
const palette = require(`../colorset.json`);

const sql = require('sqlite');
sql.open('.data/database.sqlite');

module.exports.run = async(bot,message,args)=>{

let logEmbed = new Discord.RichEmbed();

async function sqlCountingIndex() {

	return sql.all(`SELECT timestamp FROM logdata`)
	.then(async x => x.length )
	
}

let parsedData = await sqlCountingIndex();

logEmbed.setColor(palette.crimson)
logEmbed.setDescription(`I've recorded **${parsedData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}** data in the past **30** days.`)

return message.channel.send(logEmbed)


}
module.exports.help = {
	name: "presencelog"
}