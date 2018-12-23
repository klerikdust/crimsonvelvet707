
module.exports.run = async (bot, message, args, dynamicMessage) => {

var dynamicMsg = new dynamicMessage();
var keys = [];
for(var k in palette) {
	keys.push(`\`${k}\``)
} 

let usercon = message.author.displayAvatarURL
return dynamicMsg.embedTemplate(palette.crimson, `${keys}`, `${message.author.tag}`, usercon, null);
}


module.exports.help = {
	name: "colorset"
}