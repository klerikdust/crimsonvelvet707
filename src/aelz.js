exports.main = async() => {
		//I wrote this at 10/22/18. To embark on my first programming journey.


		const Discord = require("discord.js");
		const bot = new Discord.Client({disableEveryone: true});
		const botconfig = require("../utils/botconfig.json");
		const prefix = botconfig.prefix;
		const ms = require("parse-ms");
		const moment = require("moment");
		const palette = require("../utils/colorset.json");
		const { Canvas } = require("canvas-constructor"); 
		const { resolve, join } = require("path"); 
		const { Attachment } = require("discord.js"); 
		const { get } = require("snekfetch"); 
		const fsn = require("fs-nextra");
		const imageUrlRegex = /\?size=2048$/g;
		const http = require('http');
		const express = require('express');
		const app = express();
		const fs = require("fs");

const sql = require("sqlite");
sql.open(".data/database.sqlite");

		Canvas.registerFont(resolve(join(__dirname, "./assets/fonts/Whitney.otf")), "Whitney");




		app.get("/", (request, response) => {
		  response.sendStatus(200);
		});




		app.listen(process.env.PORT);
		setInterval(() => {
		  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
		}, 280000);




		function timeConverter(timestamp)
				{
				  var formatedTime = moment(timestamp).add(7, 'hour')
				  var time = moment(formatedTime).format("dddd, Do MMMM YYYY - h:mm A")

		 	 		return time;
				}


		function timeConverterNoHour(timestamp)
				{
				  var formatedTime = moment(timestamp).add(7, 'hour')
				  var time = moment(formatedTime).format("dddd, Do MMMM YYYY")

		 	 		return time;
				}



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


		bot.on("ready", async => {


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

		});




		bot.on("guildMemberAdd", member => {


		  const d = Date.now();
		  const guild = member.guild;
		  const user = bot.users.get(member.id);
		  const welcomechnl = guild.channels.find(channel => channel.name === "cafe")

		  sendCanvas();

		    async function sendCanvas() {
		      welcomechnl.send(`Say hawoo to our new member, ${user} !`,new Attachment(await profile(user),`welcome-${user.tag}.jpg`))
		    }


		    async function profile(member) {  

		        function checkUsernameLength(user) {
		          let lengthValue = user.length;
		            if (lengthValue >= 9) {
		              lengthValue -= 9;
		              return 74 - (3 * lengthValue);
		            }
		            else {
		              return 74;
		            } 
		        }

		         const { body: avatar } = await get(member.displayAvatarURL.replace(imageUrlRegex, "?size=512"));
		         const bg = await fsn.readFile('./rawrbg.jpg')
		         const overlay = await fsn.readFile('./blackoverlay.png');

		          return new Canvas(1000, 320) // x, y
		      

		          .addImage(bg, 0, -380, 1000, 820, 410)
		          .addImage(overlay, 0, 0, 1080, 1080, 540)
		          .restore()

		          .addCircle(240, 160, 140)

		          .setTextAlign("left")
		          .setTextFont(`${checkUsernameLength((member.username).length)}pt Whitney`)
		          .setColor(palette.white)
		          .addText(member.username, 400, 180)

		          .setTextFont("30pt Whitney") 
		          .addText("has joined our", 550, 220)
		          .setColor(palette.golden)
		          .addText("circle", 795, 220)

		          .setColor(palette.white)
		          .addText("!", 894, 220)

		          .setTextFont("18pt Whitney")
		          .addText(`${timeConverterNoHour(d)} ..`, 378, 100) 

		          .addRoundImage(avatar, 100, 20, 280, 280, 140)
		          .restore()

		          
		          .toBuffer()
		  }

		});






		bot.on("presenceUpdate", async (member, message) => {


		 /*
			*	Guilds presence stats.
			*	Getting value on every presence update that including online, idle, dnd(busy), and invisible.
			*	I also logged the member list with their timestamp. 
		*/

		function dynamicMessage() {



			this.embedTemplate = function(color,content) {	//embed template 
			let msg = new Discord.RichEmbed()
				.setColor(color)
				.setDescription(content)
				return msg;
				}

			this.typing = function(delayTime) {		/// typing function									
		 		message.channel.startTyping();
		 		setTimeout(function () {
		 			return message.channel.stopTyping();
		 			}, delayTime);
		 		}


		}



		    let guild = member.guild;
		    let members = message.guild.memberCount;
		    let dynamicMsg = new dynamicMessage();
		    let mods = message.guild.roles.get('471640854415671296');
		    let d = Date.now();

		    let onmem = message.guild.members.filter(a => a.user.presence.status === `online`).size;
		    let idlemem = message.guild.members.filter(a => a.user.presence.status === `idle`).size;
		    let dndmem = message.guild.members.filter(a => a.user.presence.status === `dnd`).size;
		    let totalmem = onmem + idlemem + dndmem;
		    let afkmem = idlemem + dndmem;
		    var parsedTime = await shortTimeConverter(d);

		    let onlineMemChannel = message.guild.channels.get(`492648789547679744`);
		    let log = message.guild.channels.get(`501418469628182538`);


		 	 if ( ((member.presence.status !== 'offline') && (message.presence.status === 'offline')) ) {
		    	let embeddedMsg = dynamicMsg.embedTemplate(palette.darkmatte, `${parsedTime} | **${message.user.username}** is offline.`);
		    	log.send(embeddedMsg)
		 	}

		 	 else if ( ( (member.presence.status === 'offline')
		 	 && ((message.presence.status === 'online') || (message.presence.status === 'idle') || (message.presence.status === 'dnd')) )
		     && (message.presence.game === null )) {

		    	function embeddedMsgCheck() {
		    		if(!member.roles.has(mods.id)) {
		    			return dynamicMsg.embedTemplate(palette.crimson, `${parsedTime} | **${message.user.username}** has logged into the guild!`);
		    		}
		    		else {
		    			return dynamicMsg.embedTemplate(palette.lightcrimson, `${parsedTime} | **[Mods]${message.user.username}** has logged into the guild!`);
		    		}
		    	}

		    	log.send(embeddedMsgCheck())
		 	}


		    onlineMemChannel.setName(`${totalmem} users are online!`);

			sql.get(`SELECT * FROM logdata`).then(async => {
			sql.run("INSERT INTO logdata (timestamp, online_users, afk_users) VALUES (?, ?, ?)",
			 [d, totalmem, afkmem]);

			return console.log(`${totalmem} users, ${d} data recorded.`)
			})


		});





		bot.on('messageDelete', async (message) => {



			/*
				*	Deleted message logs.
				*	All the user who deletes their own message, will be logged into #codesk channel.
			*/



		if(message.author.bot)return;


		function getEntry() {
			return message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'})
				   .then(audit => audit.entries.first())

		}

		  const entry = await getEntry();
		  const msgDeleteEmbed = new Discord.RichEmbed();
		  const now = moment();


		  msgDeleteEmbed.setColor(palette.crimson)
		  msgDeleteEmbed.setDescription(`**${timeConverter(now)} ..\nMessage sent by ${message.author} deleted in ${message.channel}**
		  ${message.content}`)

		  msgDeleteEmbed.setFooter(`${message.author.username} | Log`, message.author.displayAvatarURL)
		  return bot.channels.get("259874146337554432").send(msgDeleteEmbed);

		})

		///  COMMAND HANDLER
		bot.commands = new Discord.Collection();

        const directories = ['CSE', 'devkits', 'mod', 'social'];

        for(let index in directories) {
            fs.readdir(`./modules/${directories[index]}/`, (err, files) => {

                if(err) console.log(err);

                let jsfile = files.filter(f => f.split(".").pop() === "js")
                if(jsfile.length <= 0){
                    console.log("Missing module.");
                    return;
                }

                jsfile.forEach((f, i) => {
                    let props = require(`../modules/${directories[index]}/${f}`);
                    console.log(`${f} loaded!`);
                    bot.commands.set(props.help.name, props);
                });
            });
        }







		bot.on("message", async message =>{  



				/*
					* 	@dynamicMessage doesn't require any parameters, except for its child function.
					*	@embedTemplate's purpose it just for rich embed wrapper if im too lazy to write it.
					*	@typing used for typing anim popup.
				*/

				function dynamicMessage() {



					this.embedTemplate = function(color,content,footer,icon) {	
					let msg = new Discord.RichEmbed()
						.setColor(color)
						.setDescription(content)
						.setFooter(footer,icon)
						return message.channel.send(msg);
						}

					this.typing = function(delayTime) {								
				 		message.channel.startTyping();
				 		setTimeout(function () {
				 		 	message.channel.stopTyping();
				 			}, delayTime);
				 		}
					 }




				function getDatabase() {

						this.loguserdata = function(time) {
							return sql.get(`SELECT * FROM logdata WHERE timestamp = ${parseInt(time)}`)
							.then(async log => log.online_users)
							}

						this.logafkuser = function(time) {
							return sql.get(`SELECT * FROM logdata WHERE timestamp = ${parseInt(time)}`)
							.then(async log => log.afk_users)
							}

						}



				async function userDataCheck(user) {

					sql.get(`SELECT * FROM userdata WHERE userId = ${user.id}`).then(async data => {

						if(data) {
							return;
						}
						else {
						console.log(`${timeConverter(moment())} | ${user.tag} data was registered.`)

						sql.get(`SELECT * FROM userdata WHERE userId = ${user.id}`).then(async () => {

						sql.run(`INSERT INTO userdata (userId, nickname, curxp, maxxp, xpcurve, lvl, rawrcoins, lastonline, registered_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
						[user.id, user.username, 0, 150, 150, 1, 0, null, Date.now()]);

							})
						}
					})
				}





				        if(message.channel.type === "dm") return;
				        if(message.author.bot)return;





				        //checking userdata
				        userDataCheck(message.author);




						/*
				 			*	All functions and classes on above

				 			*	and the main things will start here.
							*	Followed by message listener
						*/

				       //	accepting all cases.
				       let mc = message.content.toLowerCase();
				       let mentionInvoke = message.isMentioned(bot.user);



				       /*
				       		*	the bot will be given two methods of calling.
				       		*		> @mention
				       		*		> prefix(aelz)
		              */
				       	
				       if(mc.includes(prefix)) {
						    let prefix = botconfig.prefix;
						    let messageArray = mc.split(" ");
						    let cmd = messageArray[0];
						    let args = messageArray.slice(1);
						    let commandfile = bot.commands.get(cmd.slice(prefix.length));
						       
						    if (!message.content.startsWith(botconfig.prefix))return;
						    if (commandfile) commandfile.run(bot, message, args);
				   		 }
						});
		bot.login(process.env.TOKEN);
	
}
