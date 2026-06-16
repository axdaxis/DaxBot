const { Events } = require('discord.js');
const fs = require('fs');


function writeForTempFolder(name, contents) { // name of file, stringify contents, meant for arrays & tables
	let string = JSON.stringify(contents);
	fs.writeFileSync(`./temp/${name}.json`, string, (err) => {
		if (err) {
			console.error("Error recorded when writing: " + err);
		}
	});
}

function mediaCache(directory) {
	let files = [];
	// This takes a while, but it saves time by not requiring conversion later. Todo: put the ones too big into a separate json so that it can just be linked to through axdaxis.dev
	fs.readdirSync(directory).forEach(file => {
		let fileStats = fs.statSync(directory + "/" + file);
		if (fileStats.size < 10485760) {
			files.push(file);
		} else {
			// Bigger than 10mb
		}
	});
	writeForTempFolder("media", files);
}

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log("Logging media to temp/media.json...");
		mediaCache("E:\\publicFiles\\daxBotMedia");
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};