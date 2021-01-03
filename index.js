/*
 * Akebot
 * index.js
 * Version 1.1.0
 * zuiun
 */

const { token } = require ("./config.json");
const extras = require ("./extras.json");
const fs = require ("fs");
const ytdl = require ("ytdl-core");
const ytsr = require ("ytsr");
const Discord = require ("discord.js");
const client = new Discord.Client ();

const selectionTime = 15000;
const waifuTime = 60000;
const recentAction = new Set ();
const servers = {};
let akebonoCounter = 0;

client.once ("ready", () => {
	const prefixes = JSON.parse (fs.readFileSync ("./prefixes.json", "utf-8"));

	client.user.setActivity (`Use ${prefixes ["default"]}help if you need me, you shitty admiral!`);
	console.log ("Ready!");
});

client.once ("reconnecting", () => {
	console.log ("Reconnecting!");
});

client.once ("disconnect", () => {
	console.log ("Disconnect!");
});

client.on ("message", message => {
	const prefixes = JSON.parse (fs.readFileSync ("./prefixes.json", "utf-8"));

	if (! prefixes [message.guild.id]) {
		setPrefix (prefixes ["default"], message);
	}

	const prefix = prefixes [message.guild.id];

	if (! message.content.startsWith (prefix) || message.author.bot || message.webhookID) {
		return;
	}

	if (! servers [message.guild.id]) {
		servers [message.guild.id] = { connection: null, songs: [], searching: false, index: 0, loopState: 0 };
	}

	const args = message.content.slice (prefix.length).trim ().split (/ +/), command = args.shift ().toLowerCase ();

	switch (command) {
	case "help": {
		if (args.length < 1) {
			message.channel.send (`Special-type destroyer number 18, 8th of the Ayanami-class, Akebono. My command prefix is **${prefix}**, but you already knew that! These are my commands (use **${prefix}help command** to find out how to use them), you shitty admiral!\n- **${prefix}help**\n- **${prefix}prefix**\n- **${prefix}waifu**\n- **${prefix}rate**\n- **${prefix}marry**\n- **${prefix}list**\n- **${prefix}8ball**\n- **${prefix}music**\nI also have secret commands, not that I'll tell you what they are!\nIf you want to examine me, you can go to my GitHub at https://github.com/zuiun/akebot, you perverted admiral!\nYou can force me to join your server by using this link, you shitty admiral: https://discord.com/oauth2/authorize?client_id=760952512172785685&scope=bot&permissions=573623552`);
		} else {
			const query = prefix + args [0];

			switch (args [0]) {
			case "help": {
				message.channel.send (`Huh? Are you an idiot? **${query}** just tells you my commands! **Bolded phrases** are commands (commands separated by a slash [/] are interchangeable), <angular-bracketed arguments> are user-defined arguments>, while [square-bracketed arguments] are optional arguments, you stupid admiral!`);
				break;
			}
			case "prefix": {
				message.channel.send (`You can't even use a prefix properly!? Ugh, then you'll have to set one with **${query} <prefix>**, you shitty admiral!`);
				break;
			}
			case "waifu": {
				message.channel.send (`Why are you so interested in other girls, huh? If you're so needy, you can use **${query} <name>** to get a picture of your waifu, use **${query} gif <name>** to get a gif of your waifu, or use **${query} song <name>** to listen to your waifu's character song(s), you perverted admiral! If you just want a picture and don't care whose, you can use **${query} random**, you shitty admiral!`);
				break;
			}
			case "rate": {
				message.channel.send (`If you're that indecisive, you can use **${query} <name>** to get a completely impartial and professional rating of a waifu or use **${query} fun <name>** to get a random rating, you shitty admiral!`);
				break;
			}
			case "marry": {
				message.channel.send (`Are you sure that the marriages you're making or ending with **${query} <name>** aren't forced marriages, you shitty admiral? You can see either your or someone else's (forced) marriage partners with **${query} view [mention_someone]** and interact with your (forced) marriage partners with **${query} fun [normal] <name>** (using normal won't change my avatar and nickname, but is faster and doesn't require webhooks), you perverted admiral!`);
				break;
			}
			case "list": {
				message.channel.send (`How disgusting, trying to find all of my waifus using **${query}**! You can also find a waifu's aliases using **${query} <name>**, you stupid admiral!`);
				break;
			}
			case "8ball": {
				message.channel.send (`Do you really need your waifus to make your decisions for you using **${query}**? What a shitty admiral!`);
				break;
			}
			case "music": {
				message.channel.send (`This command is very complicated, so listen up! You can use **${query} play <name>** to play music, **${query} search <name>** to search and pick a song out of ten, **${query} info [index]** to find information about the current song or a song at a given index,  **${query} move <index> <destination_index>** to change a song's position (will shift other songs' positions), **${query} swap <index_one> <index_two>** to swap two songs' positions, **${query} skip [index]** to skip to the next song or to a song at a given index, **${query} remove <index>** to remove a specific song from the queue, **${query} stop/leave/clear** to stop playing music and clear the queue, **${query} queue** to see the queue, and **${query} loop** to toggle between loop states. Or did you just make me say all that to waste my time, you shitty admiral!?`);
				break;
			}
			default: {
				message.channel.send (`Are you trying to trick me? **${query}** isn't one of my commands, you shitty admiral!`);
				break;
			}
			}
		}

		break;
	}
	case "prefix": {
		setPrefix (args [0], message);
		break;
	}
	case "waifu": {
		waifu (args, message);
		break;
	}
	case "rate": {
		rate (args, message);
		break;
	}
	case "marry": {
		marry (args, message);
		break;
	}
	case "list": {
		list (args, message);
		break;
	}
	case "8ball": {
		const response = Math.floor (Math.random () * extras ["8ball"].length);

		message.channel.send (extras ["8ball"] [response] [0]);
		message.channel.send (extras ["8ball"] [response] [1]);
		break;
	}
	case "music": {
		music (args, message);
		break;
	}
	case "headpat": {
		message.channel.send ("Ju-just this once, okay? You shitty admiral...");
		message.channel.send ("https://cdn.donmai.us/original/66/3d/__admiral_and_akebono_kantai_collection_drawn_by_max_melon__663d2e79b9ca0c5a8ae869ee735f7e9d.jpg");
		break;
	}
	case "explosion": {
		message.channel.send ("THE TIME OF RECKONING HAS COME. GOODBYE, YOU SHITTY ADMIRAL.");
		message.channel.send ("https://tenor.com/view/anime-explosion-gif-13300624");
		break;
	}
	case "cheer": {
		message.channel.send ("This is Shikinami, a fellow special-type destroyer and a colleague of mine. If you touch her, I'll kill you, you perverted admiral!");
		message.channel.send ("https://cdn.donmai.us/original/43/c0/__shikinami_kantai_collection_drawn_by_onio__43c00ac5e146da1b20b54fa32791b3d9.gif");
		break;
	}
	case "rickroll": {
		message.channel.send ("https://i.imgur.com/yed5Zfk.gif");
		break;
	}
	case "insult": {
		message.channel.send (extras ["insults"] [Math.floor (Math.random () * extras ["insults"].length)].replace ("${NAME}", `<@${message.author.id}>`));
		break;
	}
	case "laugh":
	case "wonky": {
		message.channel.send ("I eat shitty admirals like you for breakfast!");
		message.channel.send ("https://cdn.discordapp.com/attachments/757245390167736434/757436349543350364/Laughing-scout-SFM.gif");
		break;
	}
	case "fumislots": {
		message.channel.send ("Your fortune is:");

		try {
			message.channel.send ("https://tenor.com/view/wait-what-wut-uhh-hold-up-gif-16255437").then (() => {
				setTimeout (function () {
					message.channel.send ("Too bad for you, you shitty admiral!");
				}, 4000);
			});
		} catch (error) {
			console.log (error);
		}

		break;
	}
	default: {
		message.channel.send (`**${prefix}${command}** isn't one of my commands, you stupid admiral!`);
		break;
	}
	}
});

function setPrefix (query, message) {
	const prefixes = JSON.parse (fs.readFileSync ("./prefixes.json", "utf-8"));

	if (! message.member.hasPermission ("MANAGE_GUILD")) {
		message.channel.send ("You don't have a high-enough rank to order me around, you shitty recruit!");
	} else if (! query) {
		message.channel.send ("You need to actually give me a prefix, you stupid admiral!");
	} else {
		const originalPrefix = prefixes [message.guild.id];

		prefixes [message.guild.id] = query;
		fs.writeFile ("./prefixes.json", JSON.stringify (prefixes), (error) => {
			if (error) {
				console.log (error);
			}
		});
		message.channel.send (`I've changed this server's prefix from **${originalPrefix}** to **${prefixes [message.guild.id]}**, you shitty admiral!`);
	}
}

async function waifu (query, message) {
	if (! query.length) {
		message.channel.send ("I need a waifu to find or an action to do, you shitty admiral!");
		return;
	}

	const database = JSON.parse (fs.readFileSync ("./database.json", "utf-8")), marriages = JSON.parse (fs.readFileSync ("./marriages.json", "utf-8"));
	let search;

	switch (query [0]) {
	case "random": {
		const random = [];

		for (const i in database) {
			if (i === "random") {
				for (const j in database [i]) {
					random.push ([i, database [i] [j]]);
				}
			} else {
				for (const j in database [i] [1]) {
					random.push ([i, database [i] [1] [j]]);
				}
			}
		}

		const index = Math.floor (Math.random () * random.length);

		message.channel.send (`This is a picture of **${random [index] [0]}**, you perverted admiral!`);
		message.channel.send (random [index] [1]);
		return;
	} case "gif": {
		search = aliasName (query.slice (1).join (" "));

		for (const i in database) {
			if (i === search) {
				const images = database [i] [1], gif = [];

				for (const j in images) {
					if (images [j].startsWith ("https://tenor.com/view/") || images [j].endsWith (".gif")) {
						gif.push (images [j]);
					}
				}

				if (gif.length > 0) {
					message.channel.send (gif [Math.floor (Math.random () * gif.length)]);

					if (marriageIndex (marriages, i, message.member.id) > -1) {
						addTimerEXP (i, message.member.id, 1);
					}

					return;
				} else {
					message.channel.send (`**${search}** doesn't have any gifs, you stupid admiral!`);
					return;
				}
			}
		}

		break;
	} case "song": {
		const queue = servers [message.guild.id];

		search = aliasName (query.slice (1).join (" "));

		if (queue.searching) {
			message.channel.send ("I'm already searching for music, you shitty admiral! Wait your turn!");
			return;
		} else {
			for (const i in database) {
				if (i === search) {
					const songs = database [i] [5];
					let songList = "";

					if (! songs) {
						message.channel.send (`**${search}** doesn't have any character songs, you stupid admiral!`);
						return;
					}

					queue.searching = true;
					songList += `Here are **${search}**'s character songs, you shitty admiral!\n`;

					for (let j = 0; j < songs.length; j ++) {
						const song = await ytdl.getBasicInfo (songs [j]);

						console.log(song);
						songList += `**${j + 1}** - **${song.player_response.videoDetails.title}**\n`;
					}

					message.channel.send (songList);

					const collector = message.channel.createMessageCollector (response => response.author.id === message.author.id, { time: selectionTime });

					message.channel.send (`You have ${selectionTime / 1000} seconds to make a choice, you shitty admiral!`);
					collector.on ("collect", response => {
						let index = parseInt (response, 10);

						if (isNaN (index)) {
							response.channel.send (`**${response}** isn't a valid index, you stupid admiral!`);
						} else if (index < 1 || index > songs.length) {
							response.channel.send (`**${response}** isn't inside the list, you stupid admiral!`);
						} else {
							index --;
							collector.stop ();
							musicSetup (songs [index], message, false);
						}
					});
					collector.on ("end", () => {
						message.channel.send ("I've stopped listening for a song choice, you shitty admiral!");
						queue.searching = false;
					});

					return;
				}
			}
		}

		break;
	} default: {
		search = aliasName (query.join (" "));

		if (search === "akebono") {
			if (akebonoCounter < 1) {
				message.channel.send ("W-why should I send you pictures of myself, you perverted admiral!?");
				akebonoCounter ++;
				return;
			} else if (akebonoCounter === 1) {
				message.channel.send ("Fine, but don't show anybody... SHITTY ADMIRAL!");
				akebonoCounter ++;
			} else {
				message.channel.send ("Shitty admiral!");
			}
		}

		for (const i in database) {
			if (i === search) {
				const images = database [i] [1];

				message.channel.send (images [Math.floor (Math.random () * images.length)]);

				if (marriageIndex (marriages, i, message.member.id) > -1) {
					addTimerEXP (i, message.member.id, 1);
				}

				return;
			}
		}

		break;
	}
	}

	message.channel.send (`**${search}** isn't one of the waifus in my database, you shitty admiral!`);
}

function aliasName (girl) {
	const database = JSON.parse (fs.readFileSync ("./database.json", "utf-8"));

	for (const i in database) {
		if (i === "random") {
			continue;
		}

		for (const j in database [i] [0]) {
			if (database [i] [0] [j].toLowerCase () === girl.toLowerCase ()) {
				return i;
			}
		}
	}

	return girl;
}

function rate (query, message) {
	if (! query.length) {
		message.channel.send ("I need a waifu to rate, you shitty admiral!");
		return;
	}

	const database = JSON.parse (fs.readFileSync ("./database.json", "utf-8"));
	let search;

	switch (query [0]) {
	case "fun": {
		search = aliasName (query.slice (1).join (" "));

		for (const i in database) {
			if (i === search) {
				message.channel.send (`I give **${i}** a random rating of **${Math.floor (Math.random () * 11)}**/10, even though I don't want to rate anybody, you shitty admiral!`);
				return;
			}
		}

		break;
	} default: {
		search = aliasName (query.join (" "));

		for (const i in database) {
			if (i === search) {
				const rating = database [i] [3];

				message.channel.send (`A panel of completely impartial and unbiased admirals give **${i}** a rating of **${rating [0]}**/10, supposedly because **${rating [1]}**, you shitty admiral!`);
				return;
			}
		}

		break;
	}
	}

	message.channel.send (`**${search}** isn't one of the waifus in my database, you shitty admiral!`);
}

async function marry (query, message) {
	if (query.length < 1) {
		message.channel.send ("I need a waifu to marry or an action to do, you stupid admiral!");
		return;
	}

	const database = JSON.parse (fs.readFileSync ("./database.json", "utf-8")), marriages = JSON.parse (fs.readFileSync ("./marriages.json", "utf-8")), person = message.author.id;
	let search;

	createMarriage (marriages, person);

	switch (query [0].toLowerCase ()) {
	case "view": {
		search = aliasName (query.slice (1).join (" "));

		const araragi = getMention (search);

		if (araragi) {
			message.channel.send (`<@${araragi}> is married to ${getMarriage (marriages, araragi)}, you shitty admiral! Don't pry into other peoples' lives!`);
		} else {
			message.channel.send (`You're married to ${getMarriage (marriages, person)}, you stupid admiral! How did you manage to forget that!?`);
		}

		break;
	} case "fun": {
		const option = query [1];

		if (option === "normal") {
			search = aliasName (query.slice (2).join (" "));
		} else {
			search = aliasName (query.slice (1).join (" "));
		}

		if (! search) {
			message.channel.send ("You need to ask for a marriage partner, you perverted admiral!");
			return;
		} else if (! database [search]) {
			message.channel.send (`**${search}** isn't one of the waifus in my database, you shitty admiral!`);
			return;
		}

		if (marriageIndex (marriages, search, person) > -1) {
			for (const i in database) {
				if (i === search) {
					const data = database [i];

					if (option === "normal") {
						message.channel.send (data [2] [Math.floor (Math.random () * data [2].length)].replace ("${NAME}", `<@${message.author.id}>`));
						message.channel.send (data [1] [Math.floor (Math.random () * data [1].length)]);
					} else {
						try {
							const webhook = await message.channel.createWebhook (i, { avatar: data [4] [0] });

							await webhook.send (data [2] [Math.floor (Math.random () * data [2].length)].replace ("${NAME}", `<@${message.author.id}>`));
							await webhook.send (data [1] [Math.floor (Math.random () * data [1].length)]);
							await webhook.delete ();
						} catch (error) {
							console.log (error);
							message.channel.send (data [2] [Math.floor (Math.random () * data [2].length)].replace ("${NAME}", `<@${message.author.id}>`));
							message.channel.send (data [1] [Math.floor (Math.random () * data [1].length)]);
						}
					}

					addTimerEXP (i, person, 2);
					return;
				}
			}
		}

		message.channel.send (`You're not married to **${search}**, you stupid admiral!`);
		break;
	} default: {
		search = aliasName (query.join (" "));

		if (! search) {
			message.channel.send ("Even though you're pathetic, I'm not going to marry you to the air out of pity, you shitty admiral!");
			return;
		} else if (search === "random" || ! database [search]) {
			message.channel.send (`**${search}** isn't one of the waifus in my database, you shitty admiral!`);
			return;
		}

		for (const i in database) {
			if (i === search) {
				const marriage = marriageIndex (marriages, search, person);

				if (marriage > -1) {
					marriages [person].splice (marriage, 1);

					if (search === "akebono") {
						message.channel.send ("Why are you divorcing me, huh!? Am I not good enough for you or something!? You shitty admiral!");
					} else {
						message.channel.send (`You've divorced **${search}**, you shitty admiral! Not that your marriage would've worked out anyway!`);
					}
				} else {
					marriages [person].push ([search, 0]);

					if (search === "akebono") {
						message.channel.send ("Me!? Marry you!? I bet you just want to see my body, you perverted admiral!");
					} else {
						message.channel.send (`You've married **${search}**, you perverted admiral! Why do I have to do the rites!?`);
					}
				}

				fs.writeFile ("./marriages.json", JSON.stringify (marriages), (error) => {
					if (error) {
						console.log (error);
					}
				});
				return;
			}
		}

		break;
	}
	}
}

function createMarriage (marriages, person) {
	if (! marriages [person]) {
		marriages [person] = [];
		fs.writeFile ("./marriages.json", JSON.stringify (marriages), (error) => {
			if (error) {
				console.log (error);
			}
		});
	}
}

function getMarriage (marriages, person) {
	if (marriages [person]) {
		const marriage = marriages [person];

		if (marriage.length > 0) {
			let girls = "";

			for (const i in marriage) {
				const exp = getEXP (marriages, marriage [i] [0], person);
				let add = `**${marriage [i] [0]}** (**${getLevel (exp)}** [**${exp}**])`;

				if (i <= marriage.length - 2) {
					add += ", ";

					if (i == marriage.length - 2) {
						add += "and ";
					}
				}

				girls += add;
			}

			return girls;
		}
	}

	return "**nobody**";
}

function marriageIndex (marriages, wife, person) {
	if (marriages [person]) {
		for (let i = 0; i < marriages [person].length; i ++) {
			if (marriages [person] [i] [0].toLowerCase () === wife.toLowerCase ()) {
				return i;
			}
		}
	}

	return -1;
}

function getEXP (marriages, wife, person) {
	const married = marriageIndex (marriages, wife, person);

	if (married > -1) {
		return marriages [person] [married] [1];
	}

	return -1;
}

function getLevel (exp) {
	let level;

	if (exp < 10) {
		level = 0;
	} else if (exp < 20) {
		level = 1;
	} else if (exp < 40) {
		level = 2;
	} else if (exp < 80) {
		level = 3;
	} else if (exp < 160) {
		level = 4;
	} else if (exp < 320) {
		level = 5;
	} else {
		level = 6;
	}

	return extras ["levels"] [level];
}

function addEXP (wife, person, amount) {
	const marriages = JSON.parse (fs.readFileSync ("./marriages.json", "utf-8")), married = marriageIndex (marriages, wife, person);

	if (married > -1) {
		marriages [person] [married] [1] += amount;

		fs.writeFile ("./marriages.json", JSON.stringify (marriages), (error) => {
			if (error) {
				console.log (error);
			}
		});
	}
}

function addTimerEXP (wife, person, amount) {
	if (! recentAction.has (person)) {
		recentAction.add (person);
		setTimeout (() => recentAction.delete (person), waifuTime);
		addEXP (wife, person, amount);
	}
}

function getMention (query) {
	if (! query) {
		return;
	}

	if (query.startsWith ("<@") && query.endsWith (">")) {
		let result = query.slice (2, -1);

		if (result.startsWith ("!")) {
			result = result.slice (1);
		}

		return result;
	}
}

function list (girl, message) {
	const database = JSON.parse (fs.readFileSync ("./database.json", "utf-8")), search = aliasName (girl.join (" "));
	let waifus = "";

	if (search) {
		for (const i in database) {
			if (i === search) {
				const aliases = database [i] [0];

				waifus += `These are **${i}**'s aliases, you shitty admiral!\n`;

				for (const j in aliases) {
					waifus += `- **${aliases [j]}**\n`;
				}

				message.channel.send (waifus);
				return;
			}
		}

		message.channel.send (`**${search}** isn't one of the waifus in my database, you shitty admiral!`);
	} else {
		waifus += "These are my waifus, you shitty admiral!\n";

		for (const i in database) {
			const entry = `- **${i}**\n`;

			if (i === "random") {
				break;
			}

			if ((waifus + entry).length >= 2000) {
				message.channel.send (waifus);
				waifus = "";
			}

			waifus += entry;
		}

		message.channel.send (waifus);
	}
}

function music (query, message) {
	if (query.length < 1) {
		message.channel.send ("You didn't give me any arguments, you stupid admiral!");
		return;
	}

	const queue = servers [message.guild.id], command = query.shift ().toLowerCase ();

	switch (command) {
	case "play": {
		musicSetup (query.join (" "), message, false);
		break;
	}
	case "search": {
		musicSetup (query.join (" "), message, true);
		break;
	}
	case "info": {
		info (query [0], message);
		break;
	}
	case "move": {
		move (query, message);
		break;
	}
	case "swap": {
		swap (query, message);
		break;
	}
	case "skip": {
		skip (query [0], message);
		break;
	}
	case "remove": {
		remove (query [0], message);
		break;
	}
	case "stop":
	case "leave":
	case "clear": {
		if (queue.connection) {
			message.channel.send ("I've stopped playing music, you shitty admiral!");
			stop (message);
		} else {
			message.channel.send ("There isn't any music to stop, you stupid admiral! If there were any leftover searches, I've cleared them!");
			queue.searching = false;
		}

		break;
	}
	case "queue": {
		listQueue (message, queue.songs, false);
		break;
	}
	case "loop": {
		loop (message);
		break;
	}
	default: {
		message.channel.send (`**${command}** isn't one of my music commands, you stupid admiral!`);
	}
	}
}

async function musicSetup (query, message, search) {
	const voiceChannel = message.member.voice.channel, queue = servers [message.guild.id];
	let permissions;

	if (! queue.connection && ! voiceChannel) {
		message.channel.send ("I can't play music if neither of us is in a voice channel, you stupid admiral!");
		return;
	}

	if (queue.connection) {
		permissions = queue.connection.channel.permissionsFor (message.client.user);
	} else if (voiceChannel) {
		permissions = voiceChannel.permissionsFor (message.client.user);
	}

	if (! permissions.has ("CONNECT") || ! permissions.has ("SPEAK")) {
		message.channel.send ("I don't have the right permissions to play music, you shitty admiral!");
		return;
	}

	if (! query) {
		message.channel.send ("You didn't give me a song, you stupid admiral!");
		return;
	}

	if (queue.searching) {
		message.channel.send ("I'm already searching for music, you shitty admiral! Wait your turn!");
		return;
	// eslint-disable-next-line no-useless-escape
	} else if (/^((https\:\/\/)?www\.|https\:\/\/)(youtube\.com|youtu\.be)\/.+$/.test (query)) {
		let data;

		try {
			data = await ytdl.getBasicInfo (query);
		} catch (error) {
			message.channel.send (`I couldn't find the song at **${query}** or I had an error while trying to find it, you shitty admiral!`);
			console.log (error);
			return;
		}

		const song = {
			title: data.player_response.videoDetails.title,
			url: query,
			length: timestamp (data.player_response.videoDetails.lengthSeconds * 1000)
		};

		addSong (voiceChannel, message, song);
		return;
	} else {
		message.channel.send (`I'm currently searching for **${query}**, you shitty admiral!`);
		queue.searching = true;
	}

	if (search) {
		let results;

		try {
			results = await ytsr (query, { limit: 10 });
		} catch (error) {
			message.channel.send (`I couldn't find a song named **${query}** or I had an error while trying to find it, you shitty admiral!`);
			queue.searching = false;
			console.log (error);
			return;
		}

		const songs = [];

		for (let i = 0; i < 10 && i < results.items.length; i ++) {
			songs.push ({
				title: results.items [i].title,
				url: results.items [i].url,
				length: timestamp (convertTimestamp (results.items [i].duration))
			});
		}

		listQueue (message, songs, true);

		const collector = message.channel.createMessageCollector (response => response.author.id === message.author.id, { time: selectionTime });

		message.channel.send (`You have ${selectionTime / 1000} seconds to make a choice, you shitty admiral!`);
		collector.on ("collect", response => {
			let index = parseInt (response, 10);

			if (isNaN (index)) {
				response.channel.send (`**${response}** isn't a valid index, you stupid admiral!`);
			} else if (index < 1 || index > songs.length) {
				response.channel.send (`**${response}** isn't inside the list, you stupid admiral!`);
			} else {
				index --;

				const song = {
					title: songs [index].title,
					url: songs [index].url,
					length: songs [index].length
				};

				queue.searching = false;
				addSong (voiceChannel, message, song);
				collector.stop ();
			}
		});
		collector.on ("end", () => {
			message.channel.send ("I've stopped listening for a song choice, you shitty admiral!");
		});
	} else {
		let result;

		try {
			result = await ytsr (query, { limit: 1 });
		} catch (error) {
			message.channel.send (`I couldn't find a song named **${query}** or I had an error while trying to find it, you shitty admiral!`);
			queue.searching = false;
			console.log (error);
			return;
		}

		const song = {
			title: result.items [0].title,
			url: result.items [0].url,
			length: timestamp (convertTimestamp (result.items [0].duration))
		};

		addSong (voiceChannel, message, song);
		queue.searching = false;
	}
}

function convertTimestamp (time) {
	const unconvertedTime = time.split (":");
	let ms = 0;

	for (let i = unconvertedTime.length - 1; i >= 0; i --) {
		ms += (unconvertedTime [i] * Math.pow (60, (unconvertedTime.length - 1) - i));
	}

	return ms * 1000;
}

function timestamp (ms) {
	const unconvertedTime = [ Math.floor (ms / 1000 / 60), Math.floor (ms / 1000) % 60];
	let time = "";

	if (unconvertedTime [0] < 10) {
		time += "0";
	}

	time += `${unconvertedTime [0]}:`;

	if (unconvertedTime [1] < 10) {
		time += "0";
	}

	time += `${unconvertedTime [1]}`;
	return time;
}

async function addSong (voiceChannel, message, song) {
	const queue = servers [message.guild.id];

	if (! queue.connection) {
		try {
			queue.connection = await voiceChannel.join ();
		} catch (error) {
			console.log (error);
		}
	}

	queue.songs.push (song);
	message.channel.send (`Even though this is your job, I added **${song.title}** to the queue for you, you shitty admiral!`);

	if (queue.songs.length == 1) {
		try {
			play (message, queue.songs [queue.index]);
		} catch (error) {
			console.log (error);
		}
	}
}

function info (query, message) {
	const queue = servers [message.guild.id];

	if (queue.songs.length < 1 || ! queue.connection) {
		message.channel.send ("There isn't any music to describe, you shitty admiral!");
	} else {
		let index = parseInt (query, 10);

		if (! query) {
			message.channel.send (`You're at **${timestamp (queue.connection.dispatcher.streamTime)}** out of a total of **${queue.songs [queue.index].length}** in the song **${queue.songs [queue.index].title}**, which can be found at ${queue.songs [queue.index].url}, you shitty admiral!`);
		} else if (isNaN (index)) {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
		} else if (index < 1 || index > queue.songs.length) {
			message.channel.send (`**${query}** isn't inside the queue, you stupid admiral!`);
		} else {
			index --;
			message.channel.send (`The song at index **${index + 1}** is **${queue.songs [index].title}** and is **${queue.songs [index].length}** long, which can be found at ${queue.songs [index].url}, you shitty admiral!`);
		}
	}
}

function move (query, message) {
	const queue = servers [message.guild.id];

	if (! queue.connection) {
		message.channel.send ("I can't move music without being in a voice channel, you stupid admiral!");
	} else if (queue.songs.length < 2) {
		message.channel.send ("There isn't enough music to move, you shitty admiral!");
	} else if (query.length < 2) {
		message.channel.send ("You didn't give me enough indices to move music, you shitty admiral!");
	} else {
		let first = parseInt (query [0], 10), second = parseInt (query [1], 10);

		if (isNaN (first) || isNaN (second)) {
			message.channel.send (`**${first}** and/or **${second}** aren't valid indices, you stupid admiral!`);
		} else if (first < 1 || first > queue.songs.length || second < 1 || second > queue.songs.length) {
			message.channel.send (`**${first}** and/or **${second}** aren't inside the queue, you stupid admiral!`);
		} else {
			first --;
			second --;

			const song = queue.songs [first];

			queue.songs.splice (first, 1);
			queue.songs.splice (second, 0, song);
			message.channel.send (`I've moved **${song.title}** from index **${first + 1}** to index **${second + 1}**, you shitty admiral!`);

			if (first <= queue.index || second <= queue.index) {
				try {
					play (message, queue.songs [queue.index]);
				} catch (error) {
					console.log (error);
					return;
				}
			}
		}
	}
}

function swap (query, message) {
	const queue = servers [message.guild.id];

	if (! queue.connection) {
		message.channel.send ("I can't swap music without being in a voice channel, you stupid admiral!");
	} else if (queue.songs.length < 2) {
		message.channel.send ("There isn't enough music to swap, you shitty admiral!");
	} else if (query.length < 2) {
		message.channel.send ("You didn't give me enough indices to swap music, you shitty admiral!");
	} else {
		let first = parseInt (query [0], 10), second = parseInt (query [1], 10);

		if (isNaN (first) || isNaN (second)) {
			message.channel.send (`**${first}** and/or **${second}** aren't valid indices, you stupid admiral!`);
		} else if (first < 1 || first > queue.songs.length || second < 1 || second > queue.songs.length) {
			message.channel.send (`**${first}** and/or **${second}** aren't inside the queue, you stupid admiral!`);
		} else {
			first --;
			second --;
			[queue.songs [first], queue.songs [second]] = [queue.songs [second], queue.songs [first]];
			message.channel.send (`I've swapped **${queue.songs [second].title}** at index **${first + 1}** with **${queue.songs [first].title}** at index **${second + 1}**, you shitty admiral!`);

			if (first === queue.index || second === queue.index) {
				try {
					play (message, queue.songs [queue.index]);
				} catch (error) {
					console.log (error);
				}
			}
		}
	}
}

function skip (query, message) {
	const queue = servers [message.guild.id];

	if (! queue.connection) {
		message.channel.send ("I can't skip music without being in a voice channel, you stupid admiral!");
	} else if (queue.songs.length < 1) {
		message.channel.send ("There isn't any music to skip, you shitty admiral!");
	} else {
		let index = parseInt (query, 10);

		if (! query) {
			queue.index ++;

			if (queue.index >= queue.songs.length) {
				if (queue.loopState === 1) {
					queue.index = 0;
					message.channel.send (`I've skipped back to the first song, which is **${queue.songs [queue.index].title}**, you shitty admiral!`);
				} else {
					message.channel.send ("You skipped to the end of the queue, you stupid admiral!");
					queue.connection.dispatcher.end ();
					return;
				}
			} else {
				message.channel.send (`I've skipped to the next song, which is **${queue.songs [queue.index].title}**, you shitty admiral!`);
			}
		} else if (isNaN (index)) {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
			return;
		} else if (index < 1 || index > queue.songs.length) {
			message.channel.send (`**${query}** isn't inside the queue, you stupid admiral!`);
			return;
		} else {
			index --;
			queue.index = index;
			message.channel.send (`I've skipped to index **${queue.index + 1}**, which is **${queue.songs [queue.index].title}**, you shitty admiral!`);
		}

		try {
			play (message, queue.songs [queue.index]);
		} catch (error) {
			console.log (error);
		}
	}
}

function remove (query, message) {
	const queue = servers [message.guild.id];

	if (! queue.connection) {
		message.channel.send ("I can't remove music without being in a voice channel, you stupid admiral!");
	} else if (queue.songs.length < 1) {
		message.channel.send ("There isn't any music to remove, you shitty admiral!");
	} else {
		let index = parseInt (query, 10);

		if (! query || isNaN (index)) {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
		} else if (index < 1 || index > queue.songs.length) {
			message.channel.send (`**${query}** isn't inside the queue, you stupid admiral!`);
		} else {
			index --;
			message.channel.send (`I've removed **${queue.songs.splice (index, 1) [0].title}** at index **${index + 1}** for you, you shitty admiral!`);

			if (index <= queue.index) {
				if (index < queue.index) {
					queue.index --;
				}

				if (queue.index >= queue.songs.length && queue.loopState === 1) {
					queue.index = 0;
				}

				try {
					play (message, queue.songs [queue.index]);
				} catch (error) {
					console.log (error);
				}
			}
		}
	}
}

function stop (message) {
	const queue = servers [message.guild.id];

	queue.songs = [];
	queue.searching = false;
	queue.index = 0;
	queue.loopState = 0;

	if (queue.songs.length > 0) {
		queue.songs = [];
		message.channel.send ("I've cleared the queue, you shitty admiral!");
	}

	if (queue.connection) {
		if (queue.connection.dispatcher) {
			queue.connection.dispatcher.end ();
			message.channel.send ("I've stopped playing your horrible music, you shitty admiral!");
		}

		queue.connection.channel.leave ();
		message.channel.send ("I've left the voice channel, you shitty admiral!");

		queue.connection = null;
	}
}

function play (message, song) {
	if (! song) {
		message.channel.send ("I've reached the end of the queue, you shitty admiral!");
		stop (message);
		return;
	}

	const queue = servers [message.guild.id], dispatcher = queue.connection.play (ytdl (song.url, {
		quality: "highestaudio",
		filter: "audioonly",
		highWaterMark: 1 << 25
	})).on ("finish", () => {
		queue.index ++;

		switch (queue.loopState) {
		case 1: {
			if (queue.index === queue.songs.length) {
				queue.index = 0;
			}

			break;
		} case 2: {
			queue.index --;
			break;
		}
		}

		if (queue.connection) {
			play (message, queue.songs [queue.index]);
		} else {
			stop (message);
		}
	}).on ("error", error => console.log (error));

	dispatcher.setVolumeLogarithmic (1);
	message.channel.send (`I'm currently playing **${song.title}** for you! You better be grateful, you shitty admiral!`);
}

function listQueue (message, songs, search) {
	const queue = servers [message.guild.id];
	let songsList = "";

	if (search) {
		songsList += "These are my search results, you shitty admiral!\n";
	} else {
		songsList += "This is the current queue, you shitty admiral! ";

		switch (queue.loopState) {
		case 0:
			songsList += "I'm not looping anything right now!\n";
			break;
		case 1:
			songsList += "I'm looping the queue right now!\n";
			break;
		case 2:
			songsList += "I'm looping the current song right now!\n";
			break;
		}
	}

	if (songs.length === 0) {
		if (search) {
			message.channel.send ("I didn't find anything in my search, you shitty admiral!");
		} else {
			message.channel.send ("The queue is empty, you stupid admiral!");
		}

		return;
	}

	for (let i = 0; i < songs.length; i ++) {
		if (! search && i === queue.index) {
			songsList += "[Current] ";
		}

		songsList += `**${i + 1}** - **${songs [i].title}** (**${songs [i].length}**)\n`;
	}

	message.channel.send (songsList);
}

function loop (message) {
	const queue = servers [message.guild.id];

	if (queue.loopState < 2) {
		queue.loopState ++;
	} else {
		queue.loopState = 0;
	}

	switch (queue.loopState) {
	case 0:
		message.channel.send ("I'm not looping anything anymore, you shitty admiral!");
		break;
	case 1:
		message.channel.send ("I'm looping the queue, you shitty admiral!");
		break;
	case 2:
		message.channel.send ("I'm looping the current song, you shitty admiral!");
		break;
	}
}

client.login (token);
