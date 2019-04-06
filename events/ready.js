module.exports = (bot) => {

	console.log(`${bot.user.username} is alive!`);
	bot.commands.get(`nlp`).run(bot, `startup`);

	bot.user.setStatus(`online`);
	bot.user.setActivity(`with you`, { type: `PLAYING` });

};