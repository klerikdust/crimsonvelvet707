const moment = require("moment");
const Discord = require("discord.js");
const palette = require("../../utils/colorset.json");

const sql = require('sqlite');
sql.open('.data/database.sqlite')

module.exports.run = async (bot, message, args) => {

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


		function timeConverter(timestamp)
				{
				  var formatedTime = moment(timestamp).add(7, 'hour')
				  var time = moment(formatedTime).format("dddd, Do MMMM YYYY - h:mm A")

		 	 		return time;
				}


let getDb = new getDatabase();
let parsedDataOnline = await getDb.loguserdata(args[0])
let parsedDataAfk = await getDb.logafkuser(args[0])
let usercon = message.author.displayAvatarURL;

const embed = new Discord.RichEmbed()
	.setColor(palette.darkmatte)
	.setDescription(`In ${ timeConverter(parseInt(args[0])) }, theres **${parsedDataOnline}** users were online and the rest **${parsedDataAfk}** users are afk.`)
	.setFooter(`${message.author.username} | Log data`, usercon, null)


return message.channel.send(embed)

}
module.exports.help = {
	name: "loguser"
}