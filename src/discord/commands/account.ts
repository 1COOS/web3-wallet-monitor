import { Colors, EmbedBuilder } from 'discord.js';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from '@discordjs/builders';

import { NetworkEnum } from '../../utils/types';
import { tokenOptions } from '../../utils/utils';
import { getName } from '../../service/accounts';
import { getTokenBalances } from '../../service/tokens';

let networkGroup: SlashCommandSubcommandGroupBuilder;

export const command = new SlashCommandBuilder()
  .setName('account')
  .setDescription('Account info')
  .addSubcommandGroup((group) => {
    networkGroup = group;
    return group.setName('balance').setDescription('balance group');
  });

Object.values(NetworkEnum).forEach((network) => {
  networkGroup.addSubcommand((subcommand) =>
    subcommand
      .setName(network.toLowerCase())
      .setDescription(`Check balance for account `)
      .addStringOption((option) =>
        option
          .setName('token')
          .setDescription('Select token')
          .setRequired(true)
          .addChoices(...tokenOptions(subcommand.name)),
      )
      .addStringOption(
        (option) =>
          option.setName('address').setDescription('Input account address'),
        // .setRequired(true),
      ),
  );
});

const execute = async (interaction) => {
  const subcommand = interaction.options.getSubcommand();
  const network = subcommand.toUpperCase();

  const address =
    interaction.options.getString('address') ||
    '0x6E6F687014d1b784f19F9C47511A20C37022C2F3';

  const token = interaction.options.getString('token');

  const [balance] = await getTokenBalances(network, address, [token]);
  const accountName = await getName(network, address);
  const embed = new EmbedBuilder()
    .setColor(Colors.Gold)
    .setAuthor({
      name: `${balance.balance} ${balance.symbol}`,
      iconURL: balance.logo,
    })
    .setDescription(`Balance of ${accountName} on ${network}`);

  interaction.reply({ embeds: [embed] });
};

export default { command, execute };


