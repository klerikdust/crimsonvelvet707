const reqEvent = (event) => require(`../events/${event}`)

module.exports = bot =>{
  bot.on("guildMemberAdd", async (member) => reqEvent("guildMemberAdd")(bot, member));
  bot.on("presenceUpdate", async (member, message) => reqEvent("presenceUpdate")(bot, member, message));
  bot.on('messageDelete', async (message) => reqEvent("message")(bot, message));
  bot.on("message", async (message) => reqEvent("message")(bot, message));
  bot.on("ready", async function() {reqEvent("ready") (bot)});
}