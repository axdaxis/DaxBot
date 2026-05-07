// UNFINISHED
// Add quote tweet handling + card handling (yt, soundcloud, spotify? i forgot if that's supported as a card .. hell even Vines )
// Once deployed in DaxBot, add verficiation checkmarks (is_blue_verified means new verified, verified is old verified. I think)
// Also add links for hashtags? https://x.com/hashtag/
// Add link for @user mentions? https://x.com/@u

const { TextDisplayBuilder, ContainerBuilder, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, MediaGalleryBuilder, SectionBuilder, MessageFlags } = require('discord.js');

function isValidUrl(url) {
	// Regular expression for URL validation
	const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
	return urlRegex.test(url);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('twt')
		.setDescription('Properly embeds from Twitter/X links.')
		.setIntegrationTypes([0, 1])
		.setContexts([0, 1, 2]) // User commands
        .addStringOption((option) => option.setName('url')
            .setDescription('The Twitter/X url to embed.')
            .setRequired(true)),
		async execute(interaction) {
            // Defer and get URL
			const sent = await interaction.deferReply({flags: MessageFlags.IsComponentsV2});
            let potentialUrl = interaction.options.getString('url');

            // URL validation 1
            if (!isValidUrl(potentialUrl)) {
                await interaction.editReply({content: "Invalid URL."});
                return;
            }

            // URL validation 2
            let tweetID = potentialUrl.match(/\/status\/(\d+)/) ?? false;
            if (tweetID) {
                // Confirmed tweet ID, let's roll lmao
                const { default: Emusks } = await import("emusks");
                client = new Emusks();
                tweetID = tweetID[1];
                tweetObj = await client.syndication.getTweet(tweetID);
                if (tweetObj != null && tweetObj["__typename"] == "Tweet") {
                    // Actual tweet
                    const container = new ContainerBuilder()
                    let avatarUrl = tweetObj.user["profile_image_url_https"];
                    if (/_normal/i.test(avatarUrl)) {
                        avatarUrl = avatarUrl.replace("_normal", "_400x400");
                    }


                    const tweetSection = new SectionBuilder()
                        .addTextDisplayComponents((textDisplay) =>
                            textDisplay.setContent(`### ${tweetObj.user.name} (@${tweetObj.user["screen_name"]})`),
                        )
                        .addTextDisplayComponents((textDisplay) =>
                            textDisplay.setContent(tweetObj["text"]),
                        )
                        .setThumbnailAccessory(
                            (thumbnail) => thumbnail.setDescription(`${tweetObj.user.name} (@${tweetObj.user["screen_name"]})`).setURL(avatarUrl),
                        );

                    container.addSectionComponents(tweetSection);
                    
                    container.addSeparatorComponents((separator) => separator
                        .setSpacing(SeparatorSpacingSize.Small)
                        .setDivider(true));
                    
                    if (tweetObj.mediaDetails) { // Media (photos or videos)
                        const gallery = new MediaGalleryBuilder();
                        for (let i = 0; i < tweetObj.mediaDetails.length; i++) {
                            let media = tweetObj.mediaDetails[i];
                            switch (media["type"]) {
                                case "photo":
                                    gallery.addItems((mediaGalleryItem) => mediaGalleryItem
                                        .setURL(`${media["media_url_https"]}:orig`));
                                    break;
                                case "video":
                                    gallery.addItems((mediaGalleryItem) => mediaGalleryItem
                                        .setURL(media["video_info"]["variants"][media["video_info"]["variants"].length - 1]["url"]));                                    
                                    break;
                                case "animated_gif":
                                    break;
                                default:
                                    continue;
                            }
                        }
                        container.addMediaGalleryComponents(gallery);
                    }
                    container.addSeparatorComponents((separator) => separator
                        .setSpacing(SeparatorSpacingSize.Small)
                        .setDivider(true));
                    
                    let tweetDate = new Date(tweetObj["created_at"]);

                    const tweetFooter = new TextDisplayBuilder().setContent(
                        `-# 💬 ${tweetObj["conversation_count"]} · ❤️ ${tweetObj["favorite_count"]} | <t:${tweetDate.getTime() / 1000}:F>`
                    );
                    container.addTextDisplayComponents(tweetFooter);

                    await interaction.editReply({components: [container], flags: MessageFlags.IsComponentsV2});
                }
            } else {
                await interaction.editReply({content: "Invalid URL."});
                return;
            }
		}
};