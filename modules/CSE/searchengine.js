const Discord = require('discord.js');
const fs = require('fs');
const ms = require('parse-ms');
const google = require('google')
const palette = require("../../utils/colorset.json");

module.exports.run = async(bot,message,args)=>{

google.resultsPerPage = 1
var nextCounter = 0
let query = message.content.substring(8);
let embed = new Discord.RichEmbed();

message.channel.send(`**${message.author.username}**, I've got best match for "${query}.."`)
	google(query, function (err, res){

	  try {
	  		let temp = '';
			for (var i = 0; i < res.links.length; ++i) {
		    	var link = res.links[i];
				    embed.setColor(palette.darkmatte)
				    temp += `**${link.title} - ${link.href}**\n\u200b\u200b${link.description}\n`;
			}
			embed.setDescription(temp)
			 message.channel.send(embed)
	  }	
	  catch(e) {
	  		console.log(e)
	  		embed.setColor(palette.darkmatte)
		    embed.setDescription(e)
	  }

	if (nextCounter < 4) {
    	nextCounter += 1
    if (res.next) res.next()
  }
	})
}
module.exports.help={
    name:"search"
}