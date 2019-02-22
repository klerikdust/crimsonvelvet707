/**
 * 
 * 		progress January 20th 2019.
 * 
 * 		So far it works awesome! i definitely learn a lot by doing this project.
 * 		as of now, she only able to parse words from greet & extents_greet, which is a huge milestone for me!
 * 
 * 		Last traces :
 * 			- optimization on @fetch and @nlu topicflow_models. 
 * 		Next? 
 * 			- Add more dataset.
 * 			- prioritize the core function to improve the natural language understanding.
 * 	
 * 		bai //	
 * 
 */
const
	brain = require(`brain.js`),
	sqlite3 = require(`sqlite3`).verbose(),
	net = new brain.NeuralNetwork({ hiddenLayers: [3] }),
	db = new sqlite3.Database(`.data/aelz.db`, sqlite3.OPEN_READWRITE),
	Discord = require(`discord.js`),
	fs = require(`fs`),
	msgWrapper = require(`../../utils/messageWrapper`),
	palette = require(`../../utils/colorset.json`),
	currentNetwork = require(`./trained_network.json`);

module.exports.run = async (bot, message) => {
	let
		sqc = 0,
		listeningState = 1,
		reply = new msgWrapper(message);


	message.content.includes(`-t`) ? training() : listen();

	/**
	 * Send processed words to the user.
	 *  @fetch
	 */
	const fetch = (data) => reply.response(data, palette.crimson);

	/**
	 * 	Message listener
	 * 	capturing all user input within 60 seconds.
	 * 	@listen
	 */
	function listen() {
		const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
		reply.response(`Hello **${message.author.username}**, may i help you?`);
		collector.on(`collect`, async (msg) => {
			
			if(!listeningState)return;
			sqc++;
			nlu(sqc, fetch, process(msg.content).prop[0]);

		});
	}

	/**
	 * 	Processing tokens and find labeled pattern in database.
	 *  @nlu
	 */
	function nlu(sequence, callback, input) {
		db.serialize(() => {
			db.get(`SELECT * FROM topicflow_models WHERE ${`u` + sequence} = "${input}" LIMIT 1`, (err, row) => {

				if(row === undefined) {
					listeningState = null;
					return callback(`Missing sequences. No available conversation beyond this point.`);
				}

				db.all(`SELECT ${row[`a` + sequence]} FROM template_responses WHERE ${row[`a` + sequence]} IS NOT NULL`, (err, list) => {
					let res = [];
					for(let i in list) {
						let sentence = Object.values(list[i]).toString();
						sentence.includes(`{name}`) ? sentence = sentence.replace(`{name}`, message.author.username) : null;
						res.push(sentence);
					}
					return callback(res[Math.floor(Math.random () * res.length)]);
				});
			});
		});
	}

	/**
	 *  Tokenizing user input and run in pre-loaded network.
	 *  @process
	 */
	function process(sentence) {
		let
			stemmed = sentence
				.toLowerCase()
				.replace(/[?!@,.']/g, ``),

			loadNetwork = (file) => {
				return net
					.fromJSON(file)
					.run(tokenize());
			},

			tokenize = () => {
				let
					splitted_words = stemmed.split(` `),
					sentence_object = {};

				for(let words in splitted_words) {
					splitted_words[words] = splitted_words[words].split(`,`);
					sentence_object[splitted_words[words]] = 1;
				}

				return sentence_object;
			},

			evaluate = (data, errhandler = stemmed) => {

				const
					filterValues = (src) => {
						let
							keys = Object.keys(src),
							values = Object.values(src);
						keys.sort((a, b) => src[b] - src[a]);
						values.sort((a, b) => b - a);

						return {
							value: values,
							prop: keys,
						};
					},
					threesholdLimit = (value) => {
						return parseFloat(value.toFixed(2)) <= 0.50 ? true : false;
					},
					sortres = threesholdLimit(filterValues(data).value[0]) ? filterValues(errhandler) : filterValues(data);

				return {
					value: sortres.value,
					prop: sortres.prop,
				};
			};
			
		return evaluate(loadNetwork(currentNetwork));
	}

	/**
	 * 	Train aelz with given labeled_dataset.
	 * 	@training
	 */
	async function training() {
		let trainingData = [];

		db.all(`SELECT * FROM labeled_dataset`, [], async (err, rows) => {
			await classifying(rows);
			await traindata(20000, `./modules/neuralnet/trained_network.json`);

			function classifying(datasets) {
				for (let i in datasets) {
					trainingData.push({
						input: { [datasets[i].verb]: 1, [datasets[i].reference]: 0.5 },
						output: { [datasets[i].intent]: 1 },
					});
				}
			}


			function traindata(times, path) {
				net.train(trainingData, {
					iterations: times,
					learningRate: 0.1,
					errorThresh: 0.004,
					logPeriod: 5,
					log: (stats) => {
						console.log(
							stats
						);
					}, 
				});
						
				let parsednetwork = net.toJSON();

				fs.writeFile(path, JSON.stringify(parsednetwork, null, 4), (err) => {
					err ? console.log(err) : reply.response(`Training finished. New network has been stored in ${path}`);
				});
			}
		});
	}
};


module.exports.help = {
	name: `nlp`,
};