const { ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, MessageFlags, AttachmentBuilder } = require('discord.js');
const {randomInt} = require('crypto');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('randommedia')
		.setDescription('Replies with some random photo or video from my computer.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of media to send [default: all]')
                .setRequired(false)
                .addChoices(
                    { name: 'all', value: 'all' },
                    { name: 'video', value: 'video' },
                    { name: 'picture', value: 'picture' },
                    { name: 'gif', value: 'gif' },
                    { name: 'other', value: 'other' },
                ))
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Whether or not the response should be shown to others [true: hidden, false (default): public]'))
		.setIntegrationTypes([0, 1])
		.setContexts([0, 1, 2]), // User commands
		async execute(interaction) {
            const deferred = await interaction.deferReply({flags: [MessageFlags.IsComponentsV2]});
            const mediaJson = require("../../temp/media.json");
            const firstStamp = Date.now();

            const container = new ContainerBuilder();
            const mediaGallery = new MediaGalleryBuilder();
            const text = new TextDisplayBuilder();

            let files = [];
            let randomFile;
            let randomFilePath;
            let requestedAmount = 3; // future option to select from 1 to 10
            for (i = 0; i < requestedAmount; i++) { 
                randomFile = mediaJson[randomInt(0, mediaJson.length)];
                randomFilePath = "./media/" + randomFile;
                files.push(randomFilePath);
                let attach = new AttachmentBuilder(randomFilePath);
                mediaGallery.addItems(item => item.setURL(`attachment://${randomFile}`))
            }

            container.addMediaGalleryComponents(mediaGallery)

            console.log(interaction.createdTimestamp);
            setTimeout(() => {}, 50)
            text.setContent(`-# requested by ${interaction.user.username} on <t:${Math.floor(interaction.createdTimestamp / 1000)}:S> | took ${(interaction.createdTimestamp - firstStamp)} ms`);

            container.addTextDisplayComponents(text);

            await interaction.editReply({components: [container], files: files, flags: [MessageFlags.IsComponentsV2]});
		}
};