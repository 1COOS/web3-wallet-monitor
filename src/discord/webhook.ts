import { WebhookClient, EmbedBuilder, Colors } from 'discord.js';
import { EmbedOptions } from '../utils/types';
import { ethers } from 'ethers';

import config from '../utils/config';

const webhookClient = new WebhookClient({
  id: config.discord.DISCORD_WEBHOOK_ID,
  token: config.discord.DISCORD_WEBHOOK_TOKEN,
});

export const webhook = async (embedOptions: EmbedOptions) => {
  const embed = new EmbedBuilder()
    .setColor(
      Colors[embedOptions.color] || embedOptions.color || Colors.Default,
    )
    .setAuthor({
      name: embedOptions.title,
      url: embedOptions.txUrl,
      iconURL: embedOptions.icon,
    })
    .setTitle(embedOptions.name)
    .setURL(embedOptions.url)
    .setTimestamp(new Date())
    .setImage(embedOptions.image);

  if (embedOptions.description?.length >= 1) {
    embed.setDescription(embedOptions.description);
  }
  if (embedOptions.from && embedOptions.from != ethers.constants.AddressZero) {
    embed.addFields({ name: 'From', value: `${embedOptions.from}` });
  }
  if (embedOptions.to && embedOptions.to != ethers.constants.AddressZero) {
    embed.addFields({ name: 'To', value: `${embedOptions.to}` });
  }
  try {
    await webhookClient.send({ embeds: [embed] });
  } catch (err) {
    console.log('Send webhook error');
    console.log(err);
  }
};
