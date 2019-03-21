const
	weather = require(`weather-js`),
	palette = require(`../../utils/colorset.json`),
	messageWrapper = require(`../../utils/messageWrapper`);

exports.run = async (bot, message, keyword) => {

	let
        msg = keyword ? keyword.toLowerCase() : message.content.toLowerCase(),
        keywords,
		skycodeCheck = (code) => {
			const
				clearArr = [0, 1, 2, 3, 4, 17, 35, 32],
				snowArr = [5, 6, 7, 8, 9, 13, 14, 16, 42, 43],
				rainArr = [10, 11, 12],
				thunderstormArr = [15, 37, 38, 39, 41, 45, 46, 47],
				hightempArr = 36,
				clearNightArr = 31,
				hazeArr = [19, 20, 21, 22, 23, 24, 25],
				cloudyArr = 26,
				partyCloudyArr = [28, 30, 34, 27, 29, 33];


			if(clearArr.includes(code)) {
				return `☀️`;
			// clear
			}
			else if(snowArr.includes(code)) {
				return `❄️`;
			// snow
			}
			else if(rainArr.includes(code)) {
				return `🌧️`;
			// rain
			}
			else if(thunderstormArr.includes(code)) {
				return `⛈️`;
			// thunderstorm
			}
			else if(hightempArr === code) {
				return `🔥`;
			// high temperature
			}
			else if(clearNightArr === code) {
				return `🌙`;
			// night clear
			}
			else if(hazeArr.includes(code)) {
				return `🌫️`;
			// haze
			}
			else if(cloudyArr === code) {
				return `☁️`;
			// cloudy
			}
			else if(partyCloudyArr.includes(code)) {
				return `⛅`;
			// partly cloudy
			}
		},
		keywordParsing = () => {
			msg = msg.replace(/[?!@,.-]/g, ``);
			return keywords = msg.slice(msg.indexOf(`in`) + 3);
		},
		lookup = () => {
			weather.find({ search: keywords, degreeType: `C` }, function(err, result) {
				let
					reply = new messageWrapper(message),
					location = result[0].location,
					current = result[0].current;

				if(result === undefined)return reply.response(`Could you please specify valid location?`);

				return reply.response(`
      Today in **${location.name}** is ${current.skytext}. ${skycodeCheck(parseInt(current.skycode))}
      Temp: **${current.temperature}°C** | Humidity: **${current.humidity}** | Wind: **${current.windspeed}**`,
				palette.crimson);
			});
		};
    
	await keywordParsing();
    await lookup();
    console.log(keyword);
	return console.log(`${message.author.tag} look up for weather in ${keywords}.`);
};


exports.help = {
	name: `_automatedweather`,
};