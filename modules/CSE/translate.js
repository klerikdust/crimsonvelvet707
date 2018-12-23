const palette = require("../../utils/colorset.json");
const Discord = require('discord.js');

const fs = require('fs');
const ms = require('parse-ms');
const translate = require("@vitalets/google-translate-api");

module.exports.run = async(bot,message,args)=>{

let slicedcmd = message.content.substring(12+args[0].length);
translate(slicedcmd, {to: `${args[0]}`}).then(res => {
    console.log(res);
    message.channel.send(res.text);
    
}).catch(err => {
    console.error(err);
});
      
}
module.exports.help={
    name:"translate"
}