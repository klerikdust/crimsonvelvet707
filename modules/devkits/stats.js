const Discord = require('discord.js');
const fs = require('fs');
const palette = require("../../utils/colorset.json");
const pkg = require("../../package.json");
const ms = require('parse-ms');

const sql = require("sqlite");
sql.open(".data/database.sqlite");

module.exports.run = async(bot,message,args)=>{


function countingIndex() {
        return sql.all(`SELECT timestamp FROM logdata`)
        .then(async x => x.length)
}

function threeDigits(numbers) {
   return numbers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

    let parsedValue = await countingIndex();
    let bicon = bot.user.displayAvatarURL;
    let members = message.guild.memberCount;
    let botSize = message.guild.members.filter(a=>a.user.bot).size;
    let userSize = members - botSize;
    let uptimeFixed = ms(bot.uptime);
    var timestamp = new Date,
            timeformat = [timestamp.getMonth()+1,timestamp.getDate(),timestamp.getFullYear()].join('/')+' '+[timestamp.getHours(),
            timestamp.getMinutes(),
            timestamp.getSeconds()].join(':');

    let onmem = message.guild.members.filter(a => a.user.presence.status === `online`).size;
    let idlemem = message.guild.members.filter(a => a.user.presence.status === `idle`).size;
    let dndmem = message.guild.members.filter(a => a.user.presence.status === `dnd`).size;


        let botembed = new Discord.RichEmbed()
        .setColor(palette.darkmatte)
.addField(`⚙ | **System**`,
`
\`\`\`json
» Uptime      :: ${uptimeFixed.hours}h ${uptimeFixed.minutes}m ${uptimeFixed.seconds}s
» Memory      :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
» CPU         :: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)} %
» API version :: 2.0.0
\`\`\``)

.addField(`:oil: | **Database**`,
`\`\`\`json
//» Sqlite  :: ${pkg.dependencies.sqlite}
//» Size    :: ${fs.statSync('.data/database.sqlite').size} bytes
//» Logs    :: ${await threeDigits(parsedValue)} data were collected.
\`\`\``)

.addField(`:busts_in_silhouette: | Online Users`,
`\`\`\`json
${onmem + idlemem + dndmem}
\`\`\``,true)

.addField(`:bar_chart: | Latency`,
`\`\`\`fix
${Math.round(bot.ping)}ms
\`\`\``,true)

		.setFooter("Aelz | Statistics", bicon)
      
        return message.channel.send(botembed);
}
module.exports.help={
    name:"stats"
}