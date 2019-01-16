const palette = require('../utils/colorset.json');
const moment = require('moment');
const Discord = require('discord.js');
 			
module.exports = (bot) => {

        function shortTimeConverter(timestamp){
				  var formatedTime = moment(timestamp).add(7, 'hour')
				  var time = moment(formatedTime).format("h:mm A")
		 	 		return time;
				}


			console.log(`${bot.user.username} is up!`)
			console.log(`${bot.users.size} people are currently around.`)
			bot.user.setStatus('online');
			bot.user.setActivity("growing neurons..", {type: "WATCHING"});


		setInterval(() => {

			const d = Date.now();

		    let wibChannel = bot.channels.get(`527401608691318796`);
		    wibChannel.setName(shortTimeConverter(d));
		}, 6*1000 )
}