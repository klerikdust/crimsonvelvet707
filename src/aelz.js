exports.main = async () => {
// I wrote this at 10/22/18. To embark on my first programming journey.

	const
		Discord = require(`discord.js`),
		credentials = require(`../login.json`),
		bot = new Discord.Client({ disableEveryone: true }),
		fs = require(`fs`);

	require(`./eventHandler`)(bot);
	bot.commands = new Discord.Collection();
	const directories = [`CSE`, `devkits`, `mod`, `social`, `neuralnet`];

	for(const index in directories) {
		fs.readdir(`./modules/${directories[index]}/`, (err, files) => {
			const jsfile = files.filter(f => f.split(`.`).pop() === `js`);
			if(jsfile.length <= 0) {
				return console.log(`Missing module.`);
			}

			jsfile.forEach((f) => {
				const props = require(`../modules/${directories[index]}/${f}`);
				bot.commands.set(props.help.name, props);
			});
			console.log(`${jsfile.length} modules in ${directories[index]} have been loaded!`);
		});
	}
	bot.login(credentials.TOKEN);

};
