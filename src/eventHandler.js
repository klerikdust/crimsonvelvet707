const reqEvent = (event) => require(`../events/${event}`)

module.exports = bot =>{
  bot.on('messageDelete', async (message) => reqEvent("message")(bot, message));
  bot.on("message", async (message) => reqEvent("message")(bot, message));
  bot.on("ready", async function() {reqEvent("ready") (bot)});
}