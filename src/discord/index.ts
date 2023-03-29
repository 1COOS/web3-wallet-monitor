import { Client, GatewayIntentBits, Events, TextChannel } from 'discord.js';
import { registerCommands } from './handler';
import { handleMessage } from './handler';
import config from '../utils/config';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.MessageContent,
  ],
});

export let channel;

const start = async () => {
  client.once(Events.ClientReady, () => {
    if (!client.user || !client.application) {
      return;
    }
    console.log(`Discord bot 【${client.user.tag}】 logs in`);
    channel = client.channels.cache.get(
      config.discord.DISCORD_CHANNEL_ID,
    ) as TextChannel;
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    handleMessage(interaction);
  });

  client.on(Events.MessageCreate, async (message) => {
    // if (!config.discord.ENABLE_DIRECT_MESSAGE || message.author.bot) {
    //   return;
    // }
    const user = message.author;
    // console.log(message);
    console.log('----Direct Message---');
    console.log('Date    : ' + new Date());
    console.log('UserId  : ' + user.id);
    console.log('User    : ' + user.username);
    console.log('Message : ' + message.content);
    console.log('--------------');

    // if (message.mentions.has(client.user.id)) {
    //   const response = await chatGPTReply(message.content, user.id);
    //   await message.reply(response);
    // }
  });
  client.login(config.discord.DISCORD_BOT_TOKEN);
  await registerCommands();
};


start().catch((err) => {
  console.error(err);
});
