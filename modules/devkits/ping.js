const messageWrapper = require(`../../utils/messageWrapper`);

exports.run = async (bot, message) => {

	function measuringLatency(ms) {
		return ms <= 30 ? `Pretty **stable**!` : ms < 60 ? `**Fair** latency.` : `**Weak** latency at the moment.`;
	}
	const
		reply = new messageWrapper(message),
		ping = await measuringLatency(Math.round(bot.ping));

	return reply.response(`${ping} request taken in **${Math.round(bot.ping)}ms**`);

};


exports.help = {
	name: `ping`,
};