

const palette = require("../../utils/colorset.json");
const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {

// avatar.js
//
//	AVATAR COMMANDS
//		changes log :
//		11/03/18 - Added user finding by given input. Reaction. Major feature reworks.
//		09/17/18 - Imported commands from naphnaphz's bot.

	let reactOptions = [
	"I'd give you a",
	"Definitely",
	"Hmm ..",
	"Amazing!",
	"I wuv it ❤.",
	"Awesome art!",
	"Meh.",
	"Magnificent~",
	"Totally",
	"I only could give",
	"Beautiful!!",
	"Avatar of the day!"
	];

	let impressionsIndex = reactOptions[Math.floor(Math.random() * reactOptions.length)];
	let rating = Math.round(Math.random() * 11);
	let avatarArgs = message.content.substring(8);
	let impressEmbed = new Discord.RichEmbed()
	let avaEmbed = new Discord.RichEmbed();

	impressEmbed.setDescription(`${impressionsIndex} **${rating}/10**`)
	impressEmbed.setColor(palette.darkmatte)
	avaEmbed.setColor(palette.darkmatte)


	async function userResolvable(input){
	    const userPatern = /^(?:<@!?)?([0-9]+)>?$/;
	    if(userPatern.test(input)) input = input.replace(userPatern, '$1');
	    let members = message.guild.members;
	    const filter = member => member.user.id === input
	        || member.displayName.toLowerCase() === input.toLowerCase()
	        || member.user.username.toLowerCase() === input.toLowerCase()
	        || member.user.tag.toLowerCase() === input.toLowerCase();
	    return (members.filter(filter).first()).id;
	}

	function displayName(id) {
		return message.guild.members.get(id).displayName;
	}

	function displayAvatar(id) {
		return bot.users.get(id).displayAvatarURL;
	}

	function displayUsername(id) {
		return bot.users.get(id).username;
	}


		if(!args[0]) {
			
			avaEmbed.setAuthor(displayName(message.author.id), message.author.displayAvatarURL)
			avaEmbed.setImage(message.author.displayAvatarURL)

			message.react('📸')
			message.channel.send(avaEmbed);

			message.channel.startTyping();
			message.channel.stopTyping();
			return message.channel.send(impressEmbed)
		}
			

		else {
			const userResolvableParsed = await userResolvable(avatarArgs)

			avaEmbed.setAuthor(displayName(userResolvableParsed), displayAvatar(userResolvableParsed))
			avaEmbed.setImage(displayAvatar(userResolvableParsed))

			message.react('📸')

				message.channel.send(avaEmbed)
				message.channel.startTyping();
				message.channel.stopTyping();
				return message.channel.send(impressEmbed)



			}

		}


module.exports.help = {
	name: "avatar"
}