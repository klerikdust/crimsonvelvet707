module.exports.run = async (bot, message, args) => {


    let fetched =  message.channel.fetchMessage(args[0])
                  .then(msg => msg.content)
  
		return message.channel.send(fetched)

}
module.exports.help = {
	name: "lookup"
}