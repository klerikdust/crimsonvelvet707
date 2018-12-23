const { Canvas } = require("canvas-constructor"); // You can't make images without this.
const { resolve, join } = require("path"); // This is to get a font file.
const { Attachment } = require("discord.js"); // This is to send the image via discord.
const Discord = require("discord.js");
const { get } = require("snekfetch"); // This is to fetch the user avatar and convert it to a buffer.


const palette = require("../../utils/colorset.json");

/*
var SIMPLIFICA = new Font('SIMPLIFICA', fontFile('SIMPLIFICA.ttf'));

function fontFile(name) {
  return resolve(join(__dirname, '../fonts', name)
}
*/

const imageUrlRegex = /\?size=2048$/g;

const sql = require("sqlite");
sql.open(".data/database.sqlite");

module.exports.run = async (bot, message, args) => {
  const usercon = message.author.displayAvatarURL;
  let pairEmbed = new Discord.RichEmbed();

    async function userResolvable(input){
        const userPatern = /^(?:<@!?)?([0-9]+)>?$/;
        if(userPatern.test(input)) input = input.replace(userPatern, '$1');
        let members = message.guild.members;
        const filter = member => member.user.id === input
            || member.displayName.toLowerCase() === input.toLowerCase()
            || member.user.username.toLowerCase() === input.toLowerCase()
            || member.user.tag.toLowerCase() === input.toLowerCase();
        return members.filter(filter).first();
    }

  pairEmbed.setColor(palette.crimson)
  pairEmbed.setFooter(`${message.author.username} | Pair`, usercon)
  pairEmbed.setDescription(`Please specify the user that you want to be paired with.`)
  if(!args[0])return message.channel.send(pairEmbed)

  let firstUserTag = await userResolvable(args[0])
  let secondUserTag = await userResolvable(args[1]);

  console.log(firstUserTag.user.username, secondUserTag.user.username)
  //pairEmbed.setDescription(`Eh! you can't pair to yourself!`)

  //if(secondUserTag == (message.author.id) && firstUserTag == (message.author.id))return message.channel.send(pairEmbed)

  let firstString = Math.ceil((firstUserTag.user.username).length / 2);
  let endString = Math.ceil((secondUserTag.user.username).length / 2);

      message.channel.send(new Attachment(await profile(message.member),
     `pair-${firstUserTag.user.id}.png`));
    message.channel.send(`**${ ((firstUserTag.user.username).slice(0, firstString)).trim() + ((secondUserTag.user.username).slice(-endString)).trim()}**`)

      async function profile(member) {  
        const diameter = 400;
        const resolutions = 200;

         const { body: avatar } = await get(firstUserTag.user.displayAvatarURL.replace(imageUrlRegex, "?size=2048"));
         const { body: avatar2 } = await get(secondUserTag.user.displayAvatarURL.replace(imageUrlRegex, "?size=2048"));

          return new Canvas(1000, 420) // x, y

          .setColor(palette.white)
          .addRect(0, 0, 1000, 420)
          .addImage(avatar, 95, 10, diameter, diameter, resolutions)
          .addImage(avatar2, 505, 10, diameter, diameter, resolutions)     
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