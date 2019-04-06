const
	weather = require(`weather-js`),
	nlp = require(`compromise`),
	palette = require(`../../utils/colorset.json`),
	messageWrapper = require(`../../utils/messageWrapper`),
	sqlite3 = require(`sqlite3`).verbose(),
	db = new sqlite3.Database(`.data/aelz - Copy.db`, sqlite3.OPEN_READWRITE);

exports.run = async (bot, message, keyword) => {

	let
		msg = keyword ? keyword.toLowerCase() : message.content.toLowerCase(),
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
		keywordParsing = (callback) => {
			db.all(`SELECT word, tag FROM entities_addon`, async (err, res) => {
				msg = msg
					.toLowerCase()
					.replace(/[?!@,.-]/g, ``);

				const cities_addon = () => {
					let word_tag = {};
					for(let row = 0; res.length > row; row++) {
						word_tag[res[row].word] = res[row].tag;
					}
					word_tag = Object.assign({ words: word_tag });
					return word_tag;
				};

				nlp.plugin(cities_addon());
				msg = nlp(msg).nouns().out(`tags`);

				const city_tags = () => {
					for(let k = 0; msg.length > k; k++) {
						let 
							obj = Object.values(msg[k]),
							tags_array = obj[2];
						if(tags_array.includes(`City`)) {
							return obj[0];
						}
					}
				};
				return callback(city_tags());
			});
		},
		lookup = (key) => {
			const reply = new messageWrapper(message);
			weather.find({ search: key, degreeType: `C` }, function(err, result) {

				if(err) return reply.response(`Sorry, i can't find any forecast for that place.`);
				if(result === undefined) return reply.response(`Could you please specify valid location?`);

				let
					location = result[0].location,
					current = result[0].current;

				console.log(`${message.author.tag} look up for weather in ${key}.`);
				return reply.multi_response(`Sure, here the forecast.`, `Today in **${location.name}** is ${current.skytext}. ${skycodeCheck(parseInt(current.skycode))}
				Temp: **${current.temperature}°C** | Humidity: **${current.humidity}** | Wind: **${current.windspeed}**`,
				palette.crimson);
			});
		};
    
	return keywordParsing(lookup);
};


exports.help = {
	name: `_automatedweather`,
};