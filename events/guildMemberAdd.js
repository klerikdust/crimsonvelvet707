const { Attachment } = require("discord.js"); 
const { get } = require("snekfetch"); 
const fsn = require("fs-nextra");
const imageUrlRegex = /\?size=2048$/g;
const moment = require("moment");
const palette = require("../utils/colorset.json");
const { Canvas } = require("canvas-constructor"); 
const { resolve, join } = require("path");
Canvas.registerFont(resolve(join(__dirname, "./assets/fonts/Whitney.otf")), "Whitney");		  
          module.exports = (bot, member) => {
          const d = Date.now();
		  const guild = member.guild;
		  const user = bot.users.get(member.id);
		  const welcomechnl = guild.channels.find(channel => channel.name === "cafe")

          

		function timeConverterNoHour(timestamp)
        {
          var formatedTime = moment(timestamp).add(7, 'hour')
          var time = moment(formatedTime).format("dddd, Do MMMM YYYY")

              return time;
        }	

		  sendCanvas();

		    async function sendCanvas() {
		      welcomechnl.send(`Say hawoo to our new member, ${user} !`,new Attachment(await profile(user),`welcome-${user.tag}.jpg`))
		    }


		    async function profile(member) {  

		        function checkUsernameLength(user) {
		          let lengthValue = user.length;
		            if (lengthValue >= 9) {
		              lengthValue -= 9;
		              return 74 - (3 * lengthValue);
		            }
		            else {
		              return 74;
		            } 
		        }

		         const { body: avatar } = await get(member.displayAvatarURL.replace(imageUrlRegex, "?size=512"));
		         const bg = await fsn.readFile('./rawrbg.jpg')
		         const overlay = await fsn.readFile('./blackoverlay.png');

		          return new Canvas(1000, 320) // x, y
		      

		          .addImage(bg, 0, -380, 1000, 820, 410)
		          .addImage(overlay, 0, 0, 1080, 1080, 540)
		          .restore()

		          .addCircle(240, 160, 140)

		          .setTextAlign("left")
		          .setTextFont(`${checkUsernameLength((member.username).length)}pt Whitney`)
		          .setColor(palette.white)
		          .addText(member.username, 400, 180)

		          .setTextFont("30pt Whitney") 
		          .addText("has joined our", 550, 220)
		          .setColor(palette.golden)
		          .addText("circle", 795, 220)

		          .setColor(palette.white)
		          .addText("!", 894, 220)

		          .setTextFont("18pt Whitney")
		          .addText(`${timeConverterNoHour(d)} ..`, 378, 100) 

		          .addRoundImage(avatar, 100, 20, 280, 280, 140)
		          .restore()

		          
		          .toBuffer()
		  }

          }