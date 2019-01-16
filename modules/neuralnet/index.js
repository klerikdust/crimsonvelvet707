
const
Discord = require('discord.js'),
brain = require('brain.js'),
msgWrapper = require('../../utils/messageWrapper'),
palette = require('../../utils/colorset.json'),
trainedSentiments = require('./trainedsentiments.json'),
trainedIntents = require('./trainedintents.json'),
net = new brain.NeuralNetwork({ hiddenLayers: [3] });

module.exports.run = async (bot, message) => {

    const 
    collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 }),
    reply = new msgWrapper(message);


    output();


    function output() {
        reply.response(`**${message.author.username}**, I'm going to listen to you within 60 seconds.`)
        collector.on('collect', async message => {
            const 
            threesholdLimit = (value) => {
                return parseFloat(value.toFixed(2)) <= 0.50 ? true : false;
            },
            user = {
                name: message.author.username,
                input: message.content
            },
            res = process(user.input);

                if( !threesholdLimit(res.sentiment.value[0]) || !threesholdLimit(res.intent.value[0]) ) {
                    if(res.intent.name[0] === 'definition')return bot.commands.get('_automatedsearch').run(bot, message);

                    reply.response(
                        `[s] **${res.sentiment.value[0].toFixed(2)}%** of **${res.sentiment.name[0]}(?)**
                         [i] **${res.intent.value[0].toFixed(2)}%** of **${res.intent.name[0]}(?)**`,
                        palette.crimson)
                }
                else {
                    console.log(`"${user.input}": below dataset occupation.`)
                }
        })
    }
    function process(sentence) {
        const
        loadNetwork = (file) => {
            return net
            .fromJSON(file)
            .run( tokenize() )
        },
        tokenize = () => {
            sentence = sentence.toLowerCase();

            let 
            splitted_words = sentence.replace(/[?!@,.']/g, "").split(" "),
            sentence_object = {};
            
                for(let words in splitted_words) {
                    splitted_words[words] = splitted_words[words].split(",")
                    sentence_object[splitted_words[words]] = 1; 
                }

                return sentence_object
        },
        evaluate = (dataSentiments, dataIntent) => {

                const 
                filterHighestValues = (src) => {
                    let 
                    keys = Object.keys(src),
                    values = Object.values(src);
                    keys.sort( (a, b) => src[b] - src[a] )
                    values.sort( (a, b) => b - a )

                        return {
                            value: values,
                            prop: keys
                        }
                },
                sentimentParsing = filterHighestValues(dataSentiments),
                intentParsing = filterHighestValues(dataIntent);

                    console.log(`
                    highest score (sentiment): ${sentimentParsing.value[0].toFixed(2)} - ${sentimentParsing.prop[0]}
                    highest score (intent): ${intentParsing.value[0].toFixed(2)} - ${intentParsing.prop[0]}
                    input: ${sentence}
                    tokenized: ${JSON.stringify(tokenize())}
                    `)

            return {
                sentiment: {
                    value: sentimentParsing.value,
                    name: sentimentParsing.prop
                },
                intent: {
                    value: intentParsing.value,
                    name: intentParsing.prop
                }
            }
        };

        return evaluate(loadNetwork(trainedSentiments), loadNetwork(trainedIntents))
    }
}
module.exports.help = {
    name: "nlp"
}