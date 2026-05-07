const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Bot administrator commands.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('reload')
                .setDescription('Reload a command.')
		        .addStringOption((option) => option.setName('command').setDescription('The command to reload.').setRequired(true))
            )
        .setIntegrationTypes([0, 1])
		.setContexts([0, 1, 2]), // User commands
        async execute(interaction) {
            for (i = 0; i < adminUsers.length; i++) {
                if (interaction.user.id == adminUsers[i]) {
                    switch (interaction.options.getSubcommand()) {
                        case "reload":
                            const sent = await interaction.deferReply({flags: MessageFlags.Ephemeral});
                            const commandName = interaction.options.getString('command', true).toLowerCase();
                            const command = interaction.client.commands.get(commandName);

                            if (!command) {
                                return interaction.editReply({content: `There is no command with name \`${commandName}\`!`, flags: MessageFlags.Ephemeral});
                            }

                            delete require.cache[require.resolve(`../${command.data.name}/${command.data.name}.js`)];

                            try {
                                interaction.client.commands.delete(command.data.name);
                                const newCommand = require(`../${command.data.name}/${command.data.name}.js`);
                                interaction.client.commands.set(newCommand.data.name, newCommand);
                                return interaction.editReply({content: `Command \`${newCommand.data.name}\` was reloaded!`, flags: MessageFlags.Ephemeral});
                            } catch (error) {
                                console.error(error);
                                return interaction.editReply({content: `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``, flags: MessageFlags.Ephemeral});
                            }

                            break;
                        default:
                            return interaction.reply({content: "Not found!", flags: MessageFlags.Ephemeral});
                            break;
                    }
                } else {
                    return interaction.reply({content: '# Only DaxBot Premium subscribers can use this command!\nBenefits include:\n- Daily photos of sexy robots sent to you\n- Admin command access\n- and more!\n[Sign up here!](https://dax009.ink/daxbot/?prem=1)', flags: MessageFlags.Ephemeral})
                } // lol
            }
        },
};