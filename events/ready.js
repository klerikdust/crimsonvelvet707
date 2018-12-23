const palette = require('../utils/colorset.json');
const moment = require('moment');
const Discord = require('discord.js');
 			
            module.exports = (bot) => {

                function shortTimeConverter(timestamp)
				{
				  var formatedTime = moment(timestamp).add(7, 'hour')
				  var time = moment(formatedTime).format("h:mm A")

		 	 		return time;
				}

		function WITAshortTimeConverter(timestamp)
				{
				  var formatedTime = moment(timestamp).add(8, 'hour')
				  var time = moment(formatedTime).format("h:mm A")

		 	 		return time;
				}
            let activityArr = [

				`RAWR! Server.`,
				`RAWR! Server`,
		    `sweet house RAWR!`,
		    `morning birds`,
		    `Need any help? ping all the available mods.`

		  ];
			


			console.log(`${bot.user.username} is up!`)
			console.log(`${bot.users.size} people are currently around.`)
			bot.user.setStatus('idle');

		setInterval(() => {

			let activityIndex = activityArr[Math.floor(Math.random() * activityArr.length)];
			bot.user.setActivity(activityIndex, {type: "WATCHING"});

		}, 200000 )


		setInterval(() => {

			const d = Date.now();

			let witaChannel = bot.channels.get(`513709989668585474`);
		    let wibChannel = bot.channels.get(`498469776780165132`);
		    wibChannel.setName(`${shortTimeConverter(d)} WIB`);
		    witaChannel.setName(`${WITAshortTimeConverter(d)} WITA`);

		}, 6*1000 )
            }