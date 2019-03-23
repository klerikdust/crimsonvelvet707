module.exports = (bot) => {

	console.log(`${bot.user.username} is alive!`);

	bot.user.setStatus(`online`);
	bot.user.setActivity(`with you`, { type: `PLAYING` });

};