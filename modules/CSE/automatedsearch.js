
const 
google = require('google'),
palette = require("../../utils/colorset.json"),
intent = require("../neuralnet/custom_intents.json"),
msgWrapper = require('../../utils/messageWrapper');

module.exports.run = async (bot, message) => {

    let 
    msg = message.content.toLowerCase(),
    reply = new msgWrapper(message),
    keywords = '',
    keywordParsing = () => {
        intent.definition.forEach(element => {
            if(msg.indexOf(element) !== -1) {
                msg = msg.replace(/[?!@,.]/g, "")
                return keywords += 'wikipedia ' + msg.slice( msg.indexOf(element) )
            }
        })
    },
    searching = async () => {
        google(keywords, async (err, res) => {
            try {
                let link;
                const scrappingLinks = () => {
                    for(let i in res.links) {
                        if(res.links[i].href !== null && res.links[i].description !== '') {
                            return link = res.links[i]
                        }
                    }
                }

                await scrappingLinks();
                reply.response(`**${link.title}**\n\u200b\u200b${link.description}\n`, palette.crimson)
            }	
            catch(e) {
                console.log(e) 
                reply.response(e)
            }
        })
    };
            await keywordParsing();
            await searching();
            return console.log(`${message.author.tag} look up for "${keywords}".`);
}

module.exports.help={
    name:"_automatedsearch"
}