const moment = require(`moment`);

class config {
	constructor(bot, message) {
		this.message = message;
		this.bot = bot;
	}

	closest_time(time) {
		const timegap = [0, 3, 6];
		const parseTime = () => {
			return moment(time).format(`LT`);
		};
		time = parseTime();
		const sortingdown = () => {
			return Math.max.apply(null, timegap.filter(function(v) { return v <= parseInt(time); }));
		};
		const dayOrNight = () => {
			return time.indexOf(`AM`) > -1 ? `AM` : `PM`;
		};
		return {
			rawtime: time,
			curtime: sortingdown(),
			curstate: dayOrNight(),
		};
	}

	timestate(time) {
		let 
			res = this.closest_time(time),
			state = {
				"AM": { "0": `morning`, "3": `morning`, "6": `morning` },
				"PM": { "0": `afternoon`, "3": `evening`, "6": `night` },
			};
		return state[res.curstate][res.curtime];
	}

	functionize(entity, intent) {
		const direct = {
			"search_func": `_automatedsearch`,
			"weather_func": `_automatedweather`,
		};
	
		return this.bot.commands.get(direct[intent]).run(this.bot, this.message, entity); 
	}
}

module.exports = config;