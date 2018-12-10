const Discord = require('discord.js');
const config = require("../botconfig.json");
const palette = require(`../colorset.json`);

module.exports.run = async(bot,message,args)=>{
let sayEmbed = new Discord.RichEmbed()

	let bicon = bot.user.displayAvatarURL;
	let text = args.join(" ");
	let textEmbed = args.slice(1).join(" ");

		sayEmbed.setColor(palette.crimson)
		sayEmbed.setDescription(`You don't have authorization to use this command.`)

if(!message.member.roles.find(r => r.name === 'Mods'))return message.channel.send(sayEmbed);

	if(args[0] === 'embed') {

	sayEmbed.setDescription(textEmbed)

                return message.delete().then((msg)=>
		 			msg.channel.send(sayEmbed));

    }

else {

                message.delete();
		 			return message.channel.send(text);
}

}


module.exports.help = {
	name: "xtell"
}