/*
 * Akebot
 * index.js
 * Version 1.0.2
 * zuiun
 */

const { token } = require ("./config.json");
const extras = require ("./extras.json");
const ytdlInfo = require ("ytdl-getinfo");
const Discord = require ("discord.js");
const fs = require ("fs");
const client = new Discord.Client ();

const selectionTime = 15000;
const waifuTime = 60000;
const recentAction = new Set ();
const servers = {};
let counter = 0;

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

	if (! message.content.startsWith (prefix) || message.author.bot) {
		return;
	}

	if (! servers [message.guild.id]) {
		servers [message.guild.id] = { connection: null, songs: [], searching: false, index: 0, loopState: 0 };
	}

	const args = message.content.slice (prefix.length).trim ().split (/ +/), command = args.shift ().toLowerCase ();

	if (command === "help") {
		if (! args.length) {
			message.channel.send (`Special-type destroyer number 18, 8th of the Ayanami-class, Akebono. My command prefix is **${prefix}**, but you already knew that, you shitty admiral! You can use **${prefix}help command_name** to find out how to use that command, you stupid admiral! My commands are:\n**${prefix}help\n${prefix}prefix\n${prefix}waifu\n${prefix}rate\n${prefix}marry\n${prefix}list\n${prefix}8ball** or **${prefix}aniball\n${prefix}play\n${prefix}search\n${prefix}info\n${prefix}move\n${prefix}swap\n${prefix}skip\n${prefix}remove\n${prefix}stop** or **${prefix}leave** or **${prefix}clear\n${prefix}queue**\nI also have secret commands, not that I'll tell you what they are, you shitty admiral!\nIf you want to contact my shitty admiral to offer suggestions, report bugs, or offer waifu pictures, join my support server at https://discord.gg/hFQQEcZ, you equally shitty admiral!\nIf you want to examine me, you can go to my GitHub at https://github.com/zuiun/akebot, you perverted admiral!\nYou can also force me to join your server with one of two links, you shitty admiral! The first is the stable version, at https://discord.com/oauth2/authorize?client_id=756688090642514011&scope=bot&permissions=37080384, and the second is the development version, at https://discord.com/oauth2/authorize?client_id=760952512172785685&scope=bot&permissions=37080384!`);
		} else {
			const query = prefix + args [0];

			if (args [0] === "help") {
				message.channel.send (`Huh? Are you an idiot? **${query}** just tells you my commands! **Bolded phrases** are commands, <angular-bracketed arguments> are user-defined arguments>, while [square-bracketed arguments] are optional arguments, you stupid admiral!`);
			} else if (args [0] === "prefix") {
				message.channel.send (`You can't even use a prefix properly!? Ugh, then you'll have to set one with **${query} <prefix>**, you shitty admiral!`);
			} else if (args [0] === "waifu") {
				message.channel.send (`Why are you so interested in other girls, huh? If you're so needy, you can use **${query} <name>** to get a picture of your waifu or use **${query} gif <name>** to get a gif of your waifu, you perverted admiral! If you don't care who you get, you can use **${query} random**, you shitty admiral!`);
			} else if (args [0] === "rate") {
				message.channel.send (`If you're that indecisive, you can use **${query} <name>** to get a completely impartial and professional rating of a waifu or use **${query} fun <name>** to get a random rating, you shitty admiral!`);
			} else if (args [0] === "marry") {
				message.channel.send (`Are you sure that the marriages you're making or ending with **${query} <name>** aren't forced marriages, you shitty admiral? You can see either your or someone else's (forced) marriage partners with **${query} view [mention_someone]** and interact with your (forced) marriage partners with **${query} fun <name>**, you perverted admiral!`);
			} else if (args [0] === "list") {
				message.channel.send (`How disgusting, trying to find all of my waifus using **${query}**, you perverted admiral! You can also find a waifu's aliases using **${query} <name>**, you stupid admiral!`);
			} else if (args [0] === "8ball" || args [0] === "aniball") {
				message.channel.send (`You really need your waifus to make your decisions for you using **${query}**? What a shitty admiral!`);
			} else if (args [0] === "play") {
				message.channel.send (`Your music is annoying! Why would anybody let you use **${query} <query>** to play music, huh!? You shitty admiral!`);
			} else if (args [0] === "search") {
				message.channel.send (`You can pick and choose a song out of ten by using **${query} <query>** and then typing the song number afterwards. Now you can be extra specific with your torture, you shitty admiral!`);
			} else if (args [0] === "info") {
				message.channel.send (`Are you so inept that you need to use **${query} [song_index]** to find information about the current song or a song at a given index? You stupid admiral!`);
			} else if (args [0] === "move") {
				message.channel.send (`Since you're so indecisive, you can use **${query} <song_index> <destination_index>** to change a song's position (will shift other songs' positions) on the queue, you shitty admiral!`);
			} else if (args [0] === "swap") {
				message.channel.send (`Since you somehow mistook two completely different songs, you can use **${query} <song_one_index> <song_two_index>** to swap two songs' position on the queue, you shitty admiral!`);
			} else if (args [0] === "skip") {
				message.channel.send (`Since you apparently didn't already know, you can use **${query} [song_index]** to skip to the next song or to a different song on the queue, you stupid admiral!`);
			} else if (args [0] === "remove") {
				message.channel.send (`If you'd like to spare my ears from your torture, you can use **${query} <song_index>** to remove a specific song from the queue, but you'd never do that, you shitty admiral!`);
			} else if (args [0] === "stop" || args [0] === "leave" || args [0] === "clear") {
				message.channel.send (`Is this a blessing? You're finally going to use **${query}** to clear the queue and stop the torturous music? You must be tricking me, you shitty admiral!`);
			} else if (args [0] === "queue") {
				message.channel.send (`Are you so brainless that you can't remember what's on the queue without using **${query}**? What a stupid admiral!`);
			} else if (args [0] === "loop") {
				message.channel.send (`Using **${query}** will allow you to toggle between loop states, not that I expect you to know what that means, you stupid admiral!`);
			} else {
				message.channel.send (`Are you trying to trick me? **${query}** isn't one of my commands, you shitty admiral!`);
			}
		}
	} else if (command === "prefix") {
		setPrefix (args [0], message);
	} else if (command === "waifu") {
		waifu (args, message);
	} else if (command === "rate") {
		rate (args, message);
	} else if (command === "marry") {
		marry (args, message);
	} else if (command === "list") {
		list (args, message);
	} else if (command === "8ball" || command === "aniball") {
		const response = Math.floor (Math.random () * extras ["8ball"].length);

		message.channel.send (extras ["8ball"] [response] [0]);
		message.channel.send (extras ["8ball"] [response] [1]);
	} else if (command === "play") {
		const query = args.join (" ");
		execute (query, message, false);
	} else if (command === "search") {
		const query = args.join (" ");
		execute (query, message, true);
	} else if (command === "info") {
		info (args [0], message);
	} else if (command === "move") {
		move (args, message);
	} else if (command === "swap") {
		swap (args, message);
	} else if (command === "skip") {
		skip (args [0], message);
	} else if (command === "remove") {
		remove (args [0], message);
	} else if (command === "stop" || command === "leave" || command === "clear") {
		stop (message);
	} else if (command === "queue") {
		listQueue (message, servers [message.guild.id].songs, false);
	} else if (command === "loop") {
		loop (message);
	} else if (command === "headpat") {
		message.channel.send ("Ju-just this once, okay? You shitty admiral...");
		message.channel.send ("https://cdn.donmai.us/original/66/3d/__admiral_and_akebono_kantai_collection_drawn_by_max_melon__663d2e79b9ca0c5a8ae869ee735f7e9d.jpg");
	} else if (command === "explosion") {
		message.channel.send ("THE TIME OF RECKONING HAS COME. GOODBYE, YOU SHITTY ADMIRAL.");
		message.channel.send ("https://tenor.com/view/anime-explosion-gif-13300624");
	} else if (command === "cheer") {
		message.channel.send ("This is Shikinami, a fellow special-type destroyer and a colleague of mine. If you touch her, I'll kill you, you perverted admiral!");
		message.channel.send ("https://cdn.donmai.us/original/43/c0/__shikinami_kantai_collection_drawn_by_onio__43c00ac5e146da1b20b54fa32791b3d9.gif");
	} else if (command === "rickroll") {
		message.channel.send ("https://i.imgur.com/yed5Zfk.gif");
	} else if (command === "insult" || command === "baka") {
		message.channel.send (extras ["insults"] [Math.floor (Math.random () * extras ["insults"].length)].replace ("${NAME}", `<@${message.author.id}>`));
	} else if (command === "laugh" || command === "wonky") {
		message.channel.send ("I eat shitty admirals like you for breakfast!");
		message.channel.send ("https://cdn.discordapp.com/attachments/757245390167736434/757436349543350364/Laughing-scout-SFM.gif");
	} else {
		message.channel.send (`**${prefix}${command}** isn't one of my commands, you stupid admiral!`);
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

function waifu (query, message) {
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
		search = aliasName (query.slice (1).join (" ").toLowerCase ());

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

					if (isMarried (marriages, i, message.member.id)) {
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
	} default: {
		search = aliasName (query.join (" ").toLowerCase ());

		if (search === "akebono") {
			if (counter < 1) {
				message.channel.send ("W-why should I send you pictures of myself, you perverted admiral!?");
				counter ++;
				return;
			} else if (counter === 1) {
				message.channel.send ("Fine, but don't show anybody... SHITTY ADMIRAL!");
				counter ++;
			} else {
				message.channel.send ("Shitty admiral!");
			}
		}

		for (const i in database) {
			if (i === search) {
				const images = database [i] [1];

				message.channel.send (images [Math.floor (Math.random () * images.length)]);

				if (isMarried (marriages, i, message.member.id)) {
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

function aliasName (query) {
	const database = JSON.parse (fs.readFileSync ("./database.json", "utf-8"));

	for (const i in database) {
		if (i === "random") {
			continue;
		}

		for (const j in database [i] [0]) {
			if (database [i] [0] [j] === query) {
				return i;
			}
		}
	}

	return query;
}

function rate (query, message) {
	if (! query.length) {
		message.channel.send ("I need a waifu to find or an action to do, you shitty admiral!");
		return;
	}

	const database = JSON.parse (fs.readFileSync ("./database.json", "utf-8"));
	let search;

	switch (query [0]) {
	case "fun": {
		search = aliasName (query.slice (1).join (" ").toLowerCase ());

		for (const i in database) {
			if (i === search) {
				message.channel.send (`I give **${i}** a random rating of **${Math.floor (Math.random () * 11)}**/10, even though I don't want to rate anybody, you shitty admiral!`);
				return;
			}
		}

		break;
	} default: {
		search = aliasName (query.join (" ").toLowerCase ());

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

function marry (query, message) {
	if (! query.length) {
		message.channel.send ("I need a waifu to marry or an action to do, you stupid admiral!");
		return;
	}

	const database = JSON.parse (fs.readFileSync ("./database.json", "utf-8")), marriages = JSON.parse (fs.readFileSync ("./marriages.json", "utf-8")), person = message.author.id;
	let search;

	createMarriage (marriages, person);

	if (search !== "random") {
		switch (query [0].toLowerCase ()) {
		case "view": {
			search = aliasName (query.slice (1).join (" ").toLowerCase ());

			const araragi = getMention (search);

			if (araragi) {
				message.channel.send (`<@${araragi}> is married to ${getMarriage (marriages, araragi)}, you shitty admiral! Don't pry into other peoples' lives!`);
			} else {
				message.channel.send (`You're married to ${getMarriage (marriages, person)}, you stupid admiral! How did you manage to forget that!?`);
			}

			break;
		} case "fun": {
			search = aliasName (query.slice (1).join (" ").toLowerCase ());

			if (! search) {
				message.channel.send ("You need to ask for a marriage partner, you perverted admiral!");
				return;
			} else if (! database [search]) {
				message.channel.send (`**${search}** isn't one of the waifus in my database, you shitty admiral!`);
				return;
			}

			if (isMarried (marriages, search, person) > -1) {
				for (const i in database) {
					if (i === search) {
						const data = database [i];

						message.channel.send (data [2] [Math.floor (Math.random () * data [2].length)].replace ("${NAME}", `<@${message.author.id}>`));
						message.channel.send (data [1] [Math.floor (Math.random () * data [1].length)]);
						addTimerEXP (i, person, 2);
						return;
					}
				}
			}

			message.channel.send (`You're not married to **${search}**, you stupid admiral!`);
			break;
		} default: {
			search = aliasName (query.join (" ").toLowerCase ());

			if (! search) {
				message.channel.send ("Even though you're pathetic, I'm not going to marry you to the air out of pity, you shitty admiral!");
				return;
			} else if (! database [search]) {
				message.channel.send (`**${search}** isn't one of the waifus in my database, you shitty admiral!`);
				return;
			}

			for (const i in database) {
				if (i === search) {
					const marriage = isMarried (marriages, search, person);

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

function isMarried (marriages, query, person) {
	if (marriages [person]) {
		for (let i = 0; i < marriages [person].length; i ++) {
			if (marriages [person] [i] [0] === query) {
				return i;
			}
		}
	}

	return -1;
}

function getEXP (marriages, query, person) {
	const married = isMarried (marriages, query, person);

	if (married > -1) {
		return marriages [person] [married] [1];
	}

	return -1;
}

function getLevel (exp) {
	if (exp < 10) {
		return "Simp";
	} else if (exp < 20) {
		return "Fan";
	} else if (exp < 40) {
		return "Lover";
	} else if (exp < 80) {
		return "Connoisseur";
	} else if (exp < 160) {
		return "Cultist";
	} else if (exp < 320) {
		return "Fanatic";
	} else {
		return "Evangelist";
	}
}

function addEXP (query, person, amount) {
	const marriages = JSON.parse (fs.readFileSync ("./marriages.json", "utf-8")), married = isMarried (marriages, query, person);

	if (married > -1) {
		marriages [person] [married] [1] += amount;

		fs.writeFile ("./marriages.json", JSON.stringify (marriages), (error) => {
			if (error) {
				console.log (error);
			}
		});
	}
}

function addTimerEXP (query, person, amount) {
	if (! recentAction.has (person)) {
		recentAction.add (person);
		setTimeout (() => recentAction.delete (person), waifuTime);
		addEXP (query, person, amount);
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

function list (query, message) {
	const database = JSON.parse (fs.readFileSync ("./database.json", "utf-8")), search = aliasName (query.join (" ").toLowerCase ());
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
			if (i === "random") {
				break;
			}

			waifus += `- **${i}**\n`;
		}

		message.channel.send (waifus);
	}
}

async function execute (query, message, search) {
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
	} else {
		message.channel.send (`I'm currently searching for **${query}**, you shitty admiral!`);
		queue.searching = true;
	}

	if (search) {
		const results = await ytdlInfo.getInfo (`ytsearch10:${query}`, ["--default-search=ytsearch", "-i", "--format=best"], true), songs = [];

		for (let i = 0; i < 10 && i < results.items.length; i ++) {
			songs.push ({
				title: results.items [i].title,
				url: results.items [i].url,
				id: results.items [i].id,
				length: timestamp (parseInt (results.items [i].duration) * 1000)
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
				response.channel.send (`**${response}** isn't inside the queue, you stupid admiral!`);
			} else {
				index --;
				const song = {
					title: songs [index].title,
					url: songs [index].url,
					id: songs [index].id,
					length: songs [index].length
				};

				addSong (voiceChannel, message, song);
				collector.stop ();
				queue.searching = false;
			}
		});
		collector.on ("end", () => {
			message.channel.send ("I've stopped listening for a song choice, you shitty admiral!");
		});
	} else {
		message.channel.send (`I'm currently searching for **${query}**, you shitty admiral!`);

		const result = await ytdlInfo.getInfo (query), song = {
			title: result.items [0].title,
			url: result.items [0].url,
			id: result.items [0].id,
			length: timestamp (parseInt (result.items [0].duration) * 1000)
		};

		addSong (voiceChannel, message, song);
		queue.searching = false;
	}
}

function timestamp (ms) {
	const unconvertedTime = [ Math.floor (ms / 1000 / 60), Math.floor (ms / 1000) % 60];
	let time = "**";

	if (unconvertedTime [0] < 10) {
		time += "0";
	}

	time += `${unconvertedTime [0]}:`;

	if (unconvertedTime [1] < 10) {
		time += "0";
	}

	time += `${unconvertedTime [1]}**`;
	return time;
}

async function addSong (voiceChannel, message, song) {
	const queue = servers [message.guild.id];

	if (! queue.connection) {
		queue.connection = await voiceChannel.join ();
	}

	queue.songs.push (song);
	message.channel.send (`Even though this is your job, I added **${song.title}** to the queue for you, you shitty admiral!`);

	if (queue.songs.length == 1) {
		try {
			play (message, queue.songs [queue.index]);
		} catch (error) {
			console.log (error);
			return;
		}
	}
}

function info (query, message) {
	const queue = servers [message.guild.id];

	if (queue.songs.length < 1) {
		message.channel.send ("There isn't any music to describe, you shitty admiral!");
	} else {
		let index = parseInt (query, 10);

		if (! query) {
			message.channel.send (`You're at **${timestamp (queue.connection.dispatcher.streamTime)}** out of a total of **${queue.songs [queue.index].length}** in the song **${queue.songs [queue.index].title}**, which can be found at https://www.youtube.com/watch?v=${queue.songs [queue.index].id}, you shitty admiral!`);
		} else if (isNaN (index)) {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
		} else if (index < 1 || index > queue.songs.length) {
			message.channel.send (`**${query}** isn't inside the queue, you stupid admiral!`);
		} else {
			index --;
			message.channel.send (`The song at index **${index + 1}** is **${queue.songs [index].title}** and is **${queue.songs [index].length}** long, which can be found at https://www.youtube.com/watch?v=${queue.songs [index].id}, you shitty admiral!`);
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
					return;
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
				message.channel.send ("You skipped to the end of the queue, you stupid admiral!");
				stop (message);
				return;
			}

			try {
				play (message, queue.songs [queue.index]);
			} catch (error) {
				console.log (error);
				return;
			}
		} else if (isNaN (index)) {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
		} else if (index < 1 || index > queue.songs.length) {
			message.channel.send (`**${query}** isn't inside the queue, you stupid admiral!`);
		} else {
			index --;
			queue.index = index;
			message.channel.send (`I've skipped to index **${queue.index + 1}**, which is **${queue.songs [queue.index].title}**, you shitty admiral!`);

			try {
				play (message, queue.songs [queue.index]);
			} catch (error) {
				console.log (error);
				return;
			}
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
				if (queue.songs.length < 1) {
					stop (message);
					return;
				}

				if (index < queue.index) {
					queue.index --;
				}

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

function stop (message) {
	const queue = servers [message.guild.id];

	queue.index = 0;
	queue.loopState = 0;
	queue.songs = [];

	if (! queue.connection) {
		message.channel.send ("I can't stop music without being in a voice channel, you stupid admiral!");
	} else {
		queue.connection.channel.leave ();
		message.channel.send ("I've cleared the queue and left the voice channel, you shitty admiral!");

		if (queue.connection.dispatcher) {
			queue.connection.dispatcher.end ();
			message.channel.send ("I've stopped playing your horrible music, you shitty admiral!");
		}

		queue.connection = null;
	}
}

function play (message, song) {
	if (! song) {
		message.channel.send ("I've reached the end of the queue, you shitty admiral!");
		stop (message);
		return;
	}

	const queue = servers [message.guild.id], dispatcher = queue.connection.play (song.url).on ("finish", () => {
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

		play (message, queue.songs [queue.index]);
	}).on ("error", error => console.error (error));

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
			songsList += "I'm not looping anything right now, you shitty admiral!\n";
			break;
		case 1:
			songsList += "I'm looping the queue right now, you shitty admiral!\n";
			break;
		case 2:
			songsList += "I'm looping the current song right now, you shitty admiral!\n";
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
		message.channel.send ("I'm not looping anything, you shitty admiral!");
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
