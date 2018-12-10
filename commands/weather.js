const Discord = require('discord.js');
const palette = require('../colorset.json');
const weather = require('weather-js');

exports.run = async (bot, message, args) => {

let weatherEmbed = new Discord.RichEmbed();


function skycodeCheck(code) {
    const clearArr = [0, 1, 2, 3, 4, 17, 35, 32];
    const snowArr = [5, 6, 7, 8, 9, 13, 14, 16, 42, 43];
    const rainArr = [10, 11, 12];
    const thunderstormArr = [15, 37, 38, 39, 41, 45, 46, 47];
    const hightempArr = 36;
    const clearNightArr = 31;
    const hazeArr = [19, 20, 21, 22, 23, 24, 25];
    const cloudyArr = 26;
    const partyCloudyArr = [28, 30, 34, 27, 29, 33];



    if(clearArr.includes(code)) {
      return '☀️'; //clear
    }
    else if(snowArr.includes(code)) {
      return '❄️'; //snow
    }
    else if(rainArr.includes(code)) {
      return '🌧️'; //rain
    }
    else if(thunderstormArr.includes(code)) {
      return '⛈️'; // thunderstorm
    }
    else if(hightempArr === code) {
      return '🔥'; //high temperature
    }
    else if(clearNightArr === code) {
      return '🌙'; //night clear
    }
    else if(hazeArr.includes(code)) {
      return '🌫️'; //haze
    }
    else if(cloudyArr === code) {
      return '☁️'; //cloudy
    }
    else if(partyCloudyArr.includes(code)) {
      return '⛅'; //partly cloudy
    }
};

weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {

  weatherEmbed.setColor(palette.darkmatte)
  weatherEmbed.setDescription('Could you please specify valid location?')
  if(result === undefined) {
    return message.channel.send(weatherEmbed)
  }

  let location = result[0].location;
  let current = result[0].current;
  let forecast = result[0].forecast

 weatherEmbed.setColor(palette.crimson)
 weatherEmbed.setDescription(`
  Today in **${location.name}** is ${current.skytext}. ${skycodeCheck(parseInt(current.skycode))}
  Temp: **${current.temperature}°C** | Humidity: **${current.humidity}** | Wind: **${current.windspeed}**
   `)


  return message.channel.send(weatherEmbed); 
  

});
}


exports.help = {
	name: "weather"
}