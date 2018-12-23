
const { Canvas } = require("canvas-constructor"); // You can't make images without this.
const { resolve, join } = require("path"); // This is to get a font file.
const { Attachment } = require("discord.js"); // This is to send the image via discord.
const { get } = require("snekfetch"); // This is to fetch the user avatar and convert it to a buffer.
Canvas.registerFont(resolve(join(__dirname, "../../src/assets/fonts/Whitney.otf")), "Whitney");
const palette = require("../../utils/colorset.json");
const sql = require("sqlite");
sql.open('.data/database.sqlite');
const imageUrlRegex = /\?size=2048$/g;


module.exports.run = async (bot, message, args) => {

  const mentioned = message.mentions.members.first();


        function getUserDataMaxEXP(user)
             {
             return sql.get(`SELECT * FROM userdata WHERE userId ="${user.id}"`)
             .then(userdatarow => userdatarow.maxxp);
             }


        function getUserDataCurEXP(user)
             {
             return sql.get(`SELECT * FROM userdata WHERE userId ="${user.id}"`)
             .then(userdatarow => userdatarow.curxp);
             }


        function getUserDataLvl(user)
             {
             return sql.get(`SELECT * FROM userdata WHERE userId ="${user.id}"`)
             .then(userdatarow => userdatarow.lvl);
             }



        async function profile(member) {  


          function userCheck(msg) {
            if(mentioned) {
              return msg.user;
            }
            else {
              return message.author;
            }
          }


          const { body: avatar } = await get(userCheck(member).displayAvatarURL.replace(imageUrlRegex, "?size=1024"));  
          var userDataMaxXP = await getUserDataMaxEXP(member); 
          var userDataCurXP = await getUserDataCurEXP(member);
          var userDataLvl = await getUserDataLvl(member);



          return new Canvas(780, 220) // x, y
              //layer1
              .setColor(palette.black)
              .addRect(0,0, 780, 220)
              .save()
              .setShadowColor("rgba(22, 22, 22, 1)") 
              .setColor("#2d2d2d")
              .setShadowOffsetY(8)
              .setShadowBlur(10)
              .save()
              .addImage(avatar, 0, -50, 300, 300, 150)
              .setColor(palette.black)
              .addRect(300, 0, 800, 220)

              //layer2
              .restore()

              .setShadowOffsetY(0)
              .setShadowBlur(0)
              .setTextAlign("left")
              .setTextFont("47pt Whitney")
              .setColor(palette.crimson)
              .addText(userCheck(member).username, 320, 110) //username display

              .setTextAlign("left")
              .setTextFont("24pt Whitney")
              .setColor(palette.crimson)
              .addText(`#${userCheck(member).discriminator}`, 320, 155) //user discriminator

              .setTextAlign("left")
              .setTextFont("35pt Whitney")
              .setColor(palette.white)
              .addText('ID', 320, 55) //username display lvl


              .setTextAlign("left")
              .setTextFont("12pt Whitney")
              .setColor(palette.white)
              .addText(member.id, 375, 55) //user id

              .setTextAlign("left")
              .setColor(palette.white)
              .addText(`${userDataCurXP} / ${userDataMaxXP}`, 490, 145) //user cur xp

              .setTextAlign("left")
              .setTextFont("30pt Whitney")
              .setColor(palette.white)
              .addText("XP", 430, 160) //user cur xp
        
          .toBuffer()
     }





 if(mentioned) {

    message.channel.send(new Attachment(await profile(mentioned), `profile-${mentioned.id}.jpg`));

    }

  else {

    message.channel.send(new Attachment(await profile(message.author), `profile-${message.author.id}.jpg`));

  }

}

module.exports.help = {
  name: "profile"
}