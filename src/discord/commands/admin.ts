import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { networkOptions } from '../../utils/utils';
import { addAccount, removeAccount } from '../../service/accounts';
import { addToken, setTokenThreshold } from '../../service/tokens';

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
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('threshold')
          .setDescription('Set Token Threshold')
          .addStringOption((option) =>
            option
              .setName('name')
              .setDescription('Input token symbol')
              .setRequired(true),
          )
          .addStringOption((option) =>
            option
              .setName('threshold')
              .setDescription('Input token threshold')
              .setRequired(true),
          ),
      ),
  );

const execute = async (interaction) => {
  const subcommandGroup = interaction.options.getSubcommandGroup();
  const subcommand = interaction.options.getSubcommand();
  const network = interaction.options.getString('network');
  const address = interaction.options.getString('address');
  const name = interaction.options.getString('name');

  if (subcommandGroup === 'account') {
    switch (subcommand) {
      case 'add':
        {
          const result = await addAccount(network, address, name);
          const embed = new EmbedBuilder()
            .setTitle(`Add/Update ${subcommandGroup}`)
            .setDescription(result);
          interaction.reply({ embeds: [embed] });
        }
        break;
      case 'remove':
        {
          await removeAccount(network, address);
          const embed = new EmbedBuilder()
            .setTitle(`Remove ${subcommandGroup}`)
            .setDescription('Finished');
          interaction.reply({ embeds: [embed] });
        }
        break;
      default:
        interaction.reply({ content: 'Unknown subcommand.' });
    }
  } else if (subcommandGroup === 'token') {
    switch (subcommand) {
      case 'add':
        {
          const result = await addToken(network, name, address);
          const embed = new EmbedBuilder()
            .setTitle(`Add/Update ${subcommandGroup}`)
            .setDescription(result);
          interaction.reply({ embeds: [embed] });
        }
        break;
      case 'threshold':
        {
          const threshold = interaction.options.getString('threshold');
          const result = await setTokenThreshold(name, threshold);
          const embed = new EmbedBuilder()
            .setTitle(`Set Token Threshold`)
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
