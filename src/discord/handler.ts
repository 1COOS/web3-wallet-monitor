import { REST, Routes } from 'discord.js';
import AdminCommand from './commands/admin';
import AccountCommand from './commands/account';
import config from '../utils/config';
import { DiscordConstants } from '../utils/constants';
import { refreshAccountMap } from '../service/accounts';
import { refreshTokenMap } from '../service/tokens';

export const registerCommands = async () => {
  const rest = new REST({ version: '10' }).setToken(
    config.discord.DISCORD_BOT_TOKEN,
  );
  try {
    await rest.put(
      Routes.applicationCommands(config.discord.DISCORD_CLIENT_ID),
      {
        body: Commands,
      },
    );
    console.log('Application commands registered successfully.');
  } catch (error) {
    console.error(error);
  }
};

const Commands = [AdminCommand.command, AccountCommand.command];

export const handleMessage = async (interaction) => {
  if (interaction.isChatInputCommand()) {
    switch (interaction.commandName) {
      case DiscordConstants.Commands.ADMIN:
        await AdminCommand.execute(interaction);
        break;
      case DiscordConstants.Commands.ACCOUNT:
        await AccountCommand.execute(interaction);
        break;

      default:
        await interaction.reply({ content: 'Command Not Found' });
    }
  }
};

await refreshTokenMap();
await refreshAccountMap();
