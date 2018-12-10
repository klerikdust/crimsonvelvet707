const { Canvas } = require("canvas-constructor"); // You can't make images without this.
const { resolve, join } = require("path"); // This is to get a font file.
const { Attachment } = require("discord.js"); // This is to send the image via discord.
const Discord = require("discord.js");
const { get } = require("snekfetch"); // This is to fetch the user avatar and convert it to a buffer.
/*
var SIMPLIFICA = new Font('SIMPLIFICA', fontFile('SIMPLIFICA.ttf'));

function fontFile(name) {
  return resolve(join(__dirname, '../fonts', name)
}
*/

const palette = require("../colorset.json");
const imageUrlRegex = /\?size=2048$/g;

const sql = require("sqlite");
sql.open("./database.sqlite");

module.exports.run = async (bot, message, args) => {
  const usercon = message.author.displayAvatarURL;
  let pairEmbed = new Discord.RichEmbed();

  pairEmbed.setColor(palette.crimson)
  pairEmbed.setFooter(`${message.author.username} | Pair`, usercon)

  pairEmbed.setDescription(`Please specify the user that you want to be paired with.`)
  if(!args[0])return message.channel.send(pairEmbed)

  let secondUserTag = message.mentions.users.first();

  pairEmbed.setDescription(`Eh! you can't pair to yourself!`)

  if(secondUserTag == (`<@${message.author.id}>`))return message.channel.send(pairEmbed)

  let firstString = Math.ceil((message.author.username).length / 2);
  let endString = Math.ceil((secondUserTag.username).length / 2);

	  message.channel.send(new Attachment(await profile(message.member),
     `pair-${message.author.id}.png`));
    message.channel.send(`**${ ((message.author.username).slice(0, firstString)).trim() + ((secondUserTag.username).slice(-endString)).trim()}**`)

      async function profile(member) {  
        const diameter = 400;
        const resolutions = 200;

         const { body: avatar } = await get(message.author.displayAvatarURL.replace(imageUrlRegex, "?size=2048"));
         const { body: avatarMention } = await get(secondUserTag.displayAvatarURL.replace(imageUrlRegex, "?size=2048"));

          return new Canvas(1000, 420) // x, y

          .setColor(palette.white)
          .addRect(0, 0, 1000, 420)
          .addImage(avatar, 95, 10, diameter, diameter, resolutions)
          .addImage(avatarMention, 505, 10, diameter, diameter, resolutions)     
          /*
          .setTextAlign("left")
          .setTextFont("50pt Sans")
          .setColor(palette.crimson)
          .addText(`${message.author.username}`, 100, 470) //user discriminator (ex : #5436)
          */
          .toBuffer()
}


}

module.exports.help = {
	name: "pair"
}