const palette = require('../utils/colorset.json');
const moment = require('moment');
const Discord = require('discord.js');
const sql = require('sqlite');
sql.open('.data/database.sqlite');
 
module.exports = async (bot, member, message) => {


     function shortTimeConverter(timestamp) {
         var formatedTime = moment(timestamp).add(7, 'hour')
         var time = moment(formatedTime).format("h:mm A")

         return time;
     }
     /*
      *	Guilds presence stats.
      *	Getting value on every presence update that including online, idle, dnd(busy), and invisible.
      *	I also logged the member list with their timestamp. 
      */

     function dynamicMessage() {


         this.embedTemplate = function (color, content) { //embed template 
             let msg = new Discord.RichEmbed()
                 .setColor(color)
                 .setDescription(content)
             return msg;
         }

         this.typing = function (delayTime) { /// typing function									
             message.channel.startTyping();
             setTimeout(function () {
                 return message.channel.stopTyping();
             }, delayTime);
         }


     }



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


     if (((member.presence.status !== 'offline') && (message.presence.status === 'offline'))) {
         let embeddedMsg = dynamicMsg.embedTemplate(palette.darkmatte, `${parsedTime} | **${message.user.username}** is offline.`);
         log.send(embeddedMsg)
     } else if (((member.presence.status === 'offline') &&
             ((message.presence.status === 'online') || (message.presence.status === 'idle') || (message.presence.status === 'dnd'))) &&
         (message.presence.game === null)) {

         function embeddedMsgCheck() {
             if (!member.roles.has(mods.id)) {
                 return dynamicMsg.embedTemplate(palette.crimson, `${parsedTime} | **${message.user.username}** has logged into the guild!`);
             } else {
                 return dynamicMsg.embedTemplate(palette.lightcrimson, `${parsedTime} | **[Mods]${message.user.username}** has logged into the guild!`);
             }
         }

         log.send(embeddedMsgCheck())
     }


     onlineMemChannel.setName(`${totalmem} users are online!`);

     sql.get(`SELECT * FROM logdata`).then(() => {
         sql.run("INSERT INTO logdata (timestamp, online_users, afk_users) VALUES (?, ?, ?)",
             [d, totalmem, afkmem]);
     })


 }