exports.main = async() => {
		//I wrote this at 10/22/18. To embark on my first programming journey.
		const Discord = require("discord.js");
		const bot = new Discord.Client({disableEveryone: true});
		const http = require('http');
		const express = require('express');
		const app = express();
		const fs = require("fs");
    require("./eventHandler")(bot)
		app.get("/", (request, response) => {
		  response.sendStatus(200);
		});


		app.listen(process.env.PORT);
		setInterval(() => {
		  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
		}, 280000);



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

                jsfile.forEach((f) => {
                    let props = require(`../modules/${directories[index]}/${f}`);
                    console.log(`${f} loaded!`);
                    bot.commands.set(props.help.name, props);
                });
            });
        }
bot.login(process.env.TOKEN);
	
}
