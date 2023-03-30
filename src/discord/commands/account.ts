import { Colors, EmbedBuilder } from 'discord.js';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from '@discordjs/builders';

import { NetworkEnum } from '../../utils/network';
import { tokenOptions } from '../../utils/utils';
import { getAccounts, getName } from '../../service/accounts';
import { getTokensBalance } from '../../service/balances';

let balanceGroup: SlashCommandSubcommandGroupBuilder,
  listGroup: SlashCommandSubcommandGroupBuilder;

export const command = new SlashCommandBuilder()
  .setName('account')
  .setDescription('Account info')
  .addSubcommandGroup((group) => {
    listGroup = group;
    return group.setName('list').setDescription('list group');
  })
  .addSubcommandGroup((group) => {
    balanceGroup = group;
    return group.setName('balance').setDescription('balance group');
  });

Object.values(NetworkEnum).forEach((network) => {
  listGroup.addSubcommand((subcommand) =>
    subcommand.setName(network.toLowerCase()).setDescription(`List accounts`),
  );
  balanceGroup.addSubcommand((subcommand) =>
    subcommand
      .setName(network.toLowerCase())
      .setDescription(`Check balance for account `)
      .addStringOption((option) =>
        option
          .setName('token')
          .setDescription('Select token')
          .setRequired(true)
          .addChoices(...tokenOptions(subcommand.name)),
      ),
  );
});

const execute = async (interaction) => {
  const subCommandGroup = interaction.options.getSubcommandGroup();
  const subcommand = interaction.options.getSubcommand();
  const network = subcommand.toUpperCase();

  if (subCommandGroup === 'list') {
    const result = await getAccounts(network);
    console.log(result);
    const embed = new EmbedBuilder().setTitle(`${network} Account List`);

    Object.entries(result).forEach(([address, name]) => {
      embed.addFields({
        name: `${address}`,
        value: `${name}`,
      });
    });

    interaction.reply({ embeds: [embed] });
  } else if (subCommandGroup === 'balance') {
    const address = interaction.options.getString('address');
    const token = interaction.options.getString('token');

    const [balance] = await getTokensBalance(network, address, [token]);
    const accountName = await getName(network, address);
    const embed = new EmbedBuilder()
      .setColor(Colors.Gold)
      .setAuthor({
        name: `${balance.balance} ${balance.symbol}`,
        iconURL: balance.logo,
      })
      .setDescription(`Balance of ${accountName} on ${network}`);

    interaction.reply({ embeds: [embed] });
  }
};

export default { command, execute };
