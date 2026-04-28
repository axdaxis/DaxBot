const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Bot administrator commands.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('reload')
                .setDescription('Reload a command.'),
                //.addStringOption((option) => option.setName('command').setDescription('The command to reload.').setRequired(true)),
            )
        .setIntegrationTypes([0, 1])
		.setContexts([0, 1, 2]), // User commands
        async execute(interaction) {
            for (i = 0; i < adminUsers.length; i++) {
                if (interaction.user.id == adminUsers[i]) {
                    switch (interaction.options.getSubcommand()) {
                        case "reload":
                            return interaction.reply({ content: 'Ayy!' });
                            break;
                        default:
                            return interaction.reply({content: "Not found!", flags: MessageFlags.Ephemeral});
                    }
                } else {
                    return interaction.reply({content: '# Only DaxBot Premium subscribers can use this command!\nBenefits include:\n- Daily photos of sexy robots sent to you\n- Admin command access\n- and more!\n[Sign up here!](https://dax009.ink/daxbot/?prem=1)', flags: MessageFlags.Ephemeral})
                } // lol
            }
        },
};