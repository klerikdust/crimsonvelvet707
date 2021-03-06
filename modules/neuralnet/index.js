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
	nlp = require(`compromise`),
	sqlite3 = require(`sqlite3`).verbose(),
	net = new brain.NeuralNetwork({ hiddenLayers: [4] }),
	db = new sqlite3.Database(`.data/aelz.db`, sqlite3.OPEN_READWRITE),
	Discord = require(`discord.js`),
	fs = require(`fs`),
	msgWrapper = require(`../../utils/messageWrapper`),
	extension = require(`../../utils/extension`),
	palette = require(`../../utils/colorset.json`),
	currentNetwork = require(`./trained_network.json`);

module.exports.run = async (bot, opt, message) => {
	let
		sqc = 0,
		listeningState = 1,
		previousIntent = `starter`,
		currentPath = `starter`,
		reply = new msgWrapper(message),
		ext = new extension(bot, message);

	opt === `startup` ? training() : listen();

	/**
	 * 	Message listener
	 * 	capturing all user input within 3 minutes.
	 * 	@listen
	 */
	function listen() {
		const collector = new Discord.MessageCollector(message.channel,
			m => m.author.id === message.author.id, {
				max: 25,
				time: 180000,
			});

		const fetch = (data) => reply.response(data, palette.crimson);
		const listenerEvent = (msg) => {
			sqc++;
			let res = process(msg.content);
			nlu(sqc, fetch, res.prop[0], res.value[0], msg.author, msg.content);
		};

		
		opt === `directcall` ? listenerEvent(message) : reply.response(`Hello **${message.author.username}**, may i help you?`);
		collector.on(`collect`, async (msg) => {
			if(!listeningState)return collector.stop();
			listenerEvent(msg);
		});
		collector.on(`end`, async () => {
			listeningState = null;
			console.log(`Listening state ended`);
		});
	}

	/**
	 * 	Processing tokens and find labeled pattern in database.
	 *  @nlu
	 *  @param sequence current sequence of active conversation
	 *  @param callback send parsed output to the user
	 *  @param input the intent result from neural network
	 *  @param raw full content of the original input
	 */
	function nlu(sequence, callback, input, confidence, user, raw) {
		db.serialize(() => {

			let stemmed = raw
				.toLowerCase()
				.replace(/[?!@,./'~-]/g, ``);
			// let extracted_entities = nlp(stemmed).nouns().out(`tags`);
			
			// console.log(extracted_entities[extracted_entities.length - 1]);

			/**
			 * 	Ignore if message length is less than 2 characters.
			 */
			if(raw.length <= 1)return listeningState = null;

							
			db.get(`SELECT EXISTS(SELECT reference FROM labeled_dataset WHERE reference = "${stemmed}")`, (err, data) => {
				/**
				 *  Check if the input isn't in dataset yet with confidence above atleast 70%.
				 *  Register new row of labeled data.
				 *  @selflabeling
				 */
				if(Object.values(data) < 1 && confidence >= 0.70) {
					db.run(`INSERT INTO labeled_dataset (intent, reference, gathered_at) VALUES ("${input}", "${stemmed}", ${Date.now()})`);
				}
				/**
				  *  Require human-labeling if the confidence threeshold below 50%.
				  *  @batchlabeling
				  */
				if(confidence < 0.50) {
					listeningState = null;
					db.run(`INSERT INTO unlabeled_dataset (timestamp, from_user, content, current_path, previous_intent) VALUES (${Date.now()}, ${user.id}, "${raw}", "${currentPath}", "${previousIntent}")`);
					return callback(`Thanks for the information **${user.username}**, I'll study about it next time!`);
				}
			});


			/**
			  * Check if the intent has pre-defined function
		      * 
			  */
			if(input.indexOf(`func`) > -1 && confidence >= 0.50) {
				listeningState = null;
				return ext.functionize(raw, input);
			}

			db.get(`SELECT * FROM topicflow_models WHERE ${`u` + sequence} = "${input}" LIMIT ${Math.round(Math.random() * 5)}`, (err, row) => {


				/**
				* 	Handling error when there's no match in topicflow_models.
				*/
				if(row === undefined) {
					listeningState = null;
					return callback(`Sorry, i don't know how to react beyond this point.`);
				}
					

				/**
				 * 	Processing the string from database.
				 * 
				 */
				db.all(`SELECT ${row[`a` + sequence]} FROM template_responses WHERE ${row[`a` + sequence]} IS NOT NULL`, (err, list) => {
					let res = [];
					for(let i in list) {
						let sentence = Object.values(list[i]).toString();
						sentence.includes(`{name}`) ? sentence = sentence.replace(`{name}`, message.author.username) : null;
						sentence.includes(`{timecode}`) ? sentence = sentence.replace(`{timecode}`, ext.timestate(Date.now())) : null;
						sentence.includes(`{emotion}`) ? sentence = sentence.replace(`{emotion}`, ext.emotionstate(row.path)) : null;
						res.push(sentence.charAt(0).toUpperCase() + sentence.slice(1));
					}
					previousIntent = input;
					currentPath = row.path;


					console.log(`${ext.closest_time(Date.now()).rawtime} | responded to ${message.author.tag} [${row.path}] `);
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
				.replace(/[?!@,./'~-]/g, ``),

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
					res = filterValues(data);
				console.log(`${res.value[0]}% - ${res.prop[0]}`);
				return {
					value: res.value,
					prop: res.prop,
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

			function tokenize(sentence) {
				let splitted_words = sentence
						.toLowerCase()
						.replace(/[?!@,.'~-]/g, ``)
						.split(` `),
					objectified = {};
				for(let i = splitted_words.length - 1; i >= 0; i--) {
					objectified = Object.assign({ [splitted_words[i]]: 1 }, objectified);
				}
				return objectified;
			}

			function classifying(datasets) {
				for (let i in datasets) {
					let tokenized_input = tokenize(datasets[i].reference);
					trainingData.push({
						input: tokenized_input,
						output: { [datasets[i].intent]: 1 },
					});
				}
			}

			function traindata(times, path) {
				net.train(trainingData, {
					iterations: times,
					timeout: Infinity,
					learningRate: 0.1,
					errorThresh: 0.002,
					logPeriod: 100,
					log: (stats) => {
						console.log(
							stats
						);
					}, 
				});
						
				let parsednetwork = net.toJSON();

				fs.writeFile(path, JSON.stringify(parsednetwork, null, 4), (err) => {
					err ? console.log(err) : console.log(`Neural network has been refreshed and stored in ${path}`);
				});
			}
		});
	}
};


module.exports.help = {
	name: `nlp`,
};