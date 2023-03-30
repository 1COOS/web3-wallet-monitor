import { TokenMetadata, TransactionOptions } from '../utils/types';
import { channel } from './index';

import config from '../utils/config';
import { Colors, EmbedBuilder } from 'discord.js';
import { getName } from '../service/accounts';
import { NetworkEnum } from '../utils/network';

export const send = async (
  network: NetworkEnum,
  tokenMetadata: TokenMetadata,
  tx: TransactionOptions,
) => {
  console.log(tx);
  const explorer = config.explorer[`${network}`];
  const txUrl = `${explorer}/tx/${tx.hash}`;

  const fromUrl = `${explorer}/address/${tx.from}`;
  const toUrl = `${explorer}/address/${tx.to}`;

  const fromName = await getName(network, tx.from);
  const toName = await getName(network, tx.to);

  const embed = new EmbedBuilder()
    .setColor(Colors.Gold)
    .setAuthor({
      name: `${tx.amount} ${tokenMetadata.symbol}`,
      url: txUrl,
      iconURL: tokenMetadata.logo,
    })
    .setDescription(`${network} Transfer`)
    .setURL(txUrl)
    .setTimestamp(new Date())
    .addFields(
      {
        name: 'From',
        value: `[${fromName}](${fromUrl})`,
        inline: true,
      },
      { name: 'Balance', value: `${tx.fromBalance}`, inline: true },
    )
    .addFields({
      name: '\u200B',
      value: '\u200B',
      inline: true,
    })
    .addFields(
      { name: 'To', value: `[${toName}](${toUrl})`, inline: true },
      { name: 'Balance', value: `${tx.toBalance}`, inline: true },
    );

  try {
    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.log('Send to discord error');
    console.log(err);
  }
};
