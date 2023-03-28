import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { networkOptions } from '../../utils/utils';
import { addAccount, removeAccount } from '../../service/accounts';
import { addToken } from '../../service/tokens';

export const command = new SlashCommandBuilder()
  .setName('admin')
  .setDescription('Admin area')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommandGroup((group) =>
    group
      .setName('account')
      .setDescription('account group')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('add')
          .setDescription('Add account')
          .addStringOption((option) =>
            option
              .setName('network')
              .setDescription('Select network')
              .setRequired(true)
              .addChoices(...networkOptions()),
          )
          .addStringOption((option) =>
            option
              .setName('address')
              .setDescription('Input account address')
              .setRequired(true),
          )
          .addStringOption(
            (option) =>
              option.setName('name').setDescription('Set account name'),
            // .setRequired(true),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('remove')
          .setDescription('Remove account')
          .addStringOption((option) =>
            option
              .setName('network')
              .setDescription('Select network')
              .setRequired(true)
              .addChoices(...networkOptions()),
          )
          .addStringOption((option) =>
            option
              .setName('address')
              .setDescription('Input account address')
              .setRequired(true),
          ),
      ),
  )
  .addSubcommandGroup((group) =>
    group
      .setName('token')
      .setDescription('token group')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('add')
          .setDescription('Add Token')
          .addStringOption((option) =>
            option
              .setName('network')
              .setDescription('Select network')
              .setRequired(true)
              .addChoices(...networkOptions()),
          )
          .addStringOption((option) =>
            option
              .setName('name')
              .setDescription('Input token symbol')
              .setRequired(true),
          )
          .addStringOption((option) =>
            option
              .setName('address')
              .setDescription('Input token address')
              .setRequired(true),
          ),
      ),
  );

const execute = async (interaction) => {
  const subCommandGroup = interaction.options.getSubcommandGroup();
  const subCommand = interaction.options.getSubcommand();
  const network = interaction.options.getString('network');
  const address = interaction.options.getString('address');
  const name = interaction.options.getString('name');

  if (subCommandGroup === 'account') {
    switch (subCommand) {
      case 'add':
        {
          const result = await addAccount(network, address, name);
          const embed = new EmbedBuilder()
            .setTitle(`Add/Update ${subCommandGroup}`)
            .setDescription(result);
          interaction.reply({ embeds: [embed] });
        }
        break;
      case 'remove':
        {
          await removeAccount(network, address);
          const embed = new EmbedBuilder()
            .setTitle(`Remove ${subCommandGroup}`)
            .setDescription('Finished');
          interaction.reply({ embeds: [embed] });
        }
        break;
      default:
        interaction.reply({ content: 'Unknown subcommand.' });
    }
  } else if (subCommandGroup === 'token') {
    switch (subCommand) {
      case 'add':
        {
          const result = await addToken(network, name, address);
          const embed = new EmbedBuilder()
            .setTitle(`Add/Update ${subCommandGroup}`)
            .setDescription(result);
          interaction.reply({ embeds: [embed] });
        }
        break;
      default:
        interaction.reply({ content: 'Unknown subcommand.' });
    }
  }
};

export default { command, execute };
