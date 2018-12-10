const Discord = require('discord.js');
const palette = require('../colorset.json');
const config = require('../botconfig.json');

exports.run = async (bot, message, args) => {



const argsx = message.content.split(" ").slice(1);

let evembed = new Discord.RichEmbed();
const usercon = message.author.displayAvatarURL;

evembed.setColor(palette.crimson)
evembed.setDescription(`Uhm sorry, you don't have authorization to access it.`)
evembed.setFooter(`${message.author.username} | Developer Mode`, usercon)
if(message.author.id !== (config.creator))return message.channel.send(evembed)


const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

    try {
      const code = argsx.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      if(evaled.length >= 2000)
   	  	evaled = evaled.slice(0, 1999);

   	  evembed.setDescription(`**Output**\n\`\`\`${config.syntax}\n${clean(evaled)}\n\`\`\``)
      message.channel.send(evembed);

    } catch (err) {

      evembed.setColor(palette.blankgray)
      evembed.setDescription(`**Output**\n\`\`\`${config.syntax}\n${clean(err)}\n\`\`\``)
      message.channel.send(evembed);

    }


}

exports.help = {
	name: "eval"
}