const sql = require('sqlite');
const moment = require('moment');
const botconfig = require('../utils/botconfig.json');
sql.open('.data/database.sqlite');
   
 module.exports = async (bot, message) => {

      function timeConverter(timestamp) {
         var formatedTime = moment(timestamp).add(7, 'hour')
         var time = moment(formatedTime).format("h:mm A")

         return time;
     }   
                async function userDataCheck(user) {

                    sql.get(`SELECT * FROM userdata WHERE userId = ${user.id}`).then(async data => {

                        if (data) {
                            return;
                        } else {
                            console.log(`${timeConverter(moment())} | ${user.tag} data was registered.`)

                            sql.get(`SELECT * FROM userdata WHERE userId = ${user.id}`).then(async () => {

                                sql.run(`INSERT INTO userdata (userId, nickname, curxp, maxxp, xpcurve, lvl, rawrcoins, lastonline, registered_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                    [user.id, user.username, 0, 150, 150, 1, 0, null, Date.now()]);

                            })
                        }
                    })
                }


                if (message.channel.type === "dm") return;
                if (message.author.bot) return;



                //checking userdata
                userDataCheck(message.author);




                /*
				 			*	All functions and classes on above

				 			*	and the main things will start here.
							*	Followed by message listener
						*/

                //	accepting all cases.
                let mc = message.content.toLowerCase();

                /*
                 *	the bot will be given two methods of calling.
                 *		> @mention
                 *		> prefix(aelz)
                 */
                let prefix = botconfig.prefix;
                if (mc.includes(prefix)) {
                    let messageArray = mc.split(" ");
                    let cmd = messageArray[0];
                    let args = messageArray.slice(1);
                    let commandfile = bot.commands.get(cmd.slice(prefix.length));

                    if (!message.content.startsWith(botconfig.prefix)) return;
                    if (commandfile) commandfile.run(bot, message, args);
                }
            }