const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.setIntegrationTypes([0, 1])
		.setContexts([0, 1, 2]), // User commands
		async execute(interaction) {
			const sent = await interaction.reply({ content: 'Pinging...', withResponse: true });
			interaction.editReply(`Roundtrip latency: ${sent.resource.message.createdTimestamp - interaction.createdTimestamp}ms`);
		}
};