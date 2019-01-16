const palette = require('../utils/colorset.json');
const moment = require('moment');
const Discord = require('discord.js');
const sql = require('sqlite');
sql.open('.data/database.sqlite');
 		
    module.exports = (bot, message) => {        
            /*
				*	Deleted message logs.
				*	All the user who deletes their own message, will be logged into #codesk channel.
			*/
     function timeConverter(timestamp) {
         var formatedTime = moment(timestamp).add(7, 'hour')
         var time = moment(formatedTime).format("h:mm A")

         return time;
     }   
		if(message.author.bot)return;



		  const msgDeleteEmbed = new Discord.RichEmbed();
		  const now = moment();


		  msgDeleteEmbed.setColor(palette.crimson)
		  msgDeleteEmbed.setDescription(`**${timeConverter(now)} ..\nMessage sent by ${message.author} deleted in ${message.channel}**
		  ${message.content}`)

		  msgDeleteEmbed.setFooter(`${message.author.username} | Log`, message.author.displayAvatarURL)
		  return bot.channels.get("259874146337554432").send(msgDeleteEmbed);
    }