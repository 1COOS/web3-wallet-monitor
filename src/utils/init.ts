import fs from 'fs';
import YAML from 'yaml';
import pLimit from 'p-limit';
import { addToken } from '../service/tokens';
import { addAccount } from '../service/accounts';
import { NetworkEnum } from './types';
import { setListener } from '../service/transactions';

let configPath = '/config/config.yaml';
if (!fs.existsSync(configPath)) {
  configPath = 'config.yaml';
}
const file = fs.readFileSync(configPath, 'utf8');
const y = YAML.parse(file);

type NetworkType = {
  tokens: {
    [symbol: string]: {
      address: string;
      listen: boolean;
    };
  };
  accounts: AccountObject[];
};

type AccountObject = {
  [address: string]: string;
};

type TokenObject = {
  [symbol: string]: string;
};

const initData: { [name: string]: NetworkType } = y.networks;
const defaultTokens: { [network: string]: TokenObject[] } = {};
const listenTokens: { [network: string]: string[] } = {};
const listenAccounts: { [network: string]: AccountObject[] } = {};

const parseConfig = async () => {
  for (const network in initData) {
    const tokens = initData[network].tokens;
    const accounts = initData[network].accounts;

    defaultTokens[network] = [];
    listenTokens[network] = [];
    listenAccounts[network] = [];

    for (const symbol in tokens) {
      const token = tokens[symbol];
      defaultTokens[network].push({ [symbol]: token.address });
      if (token.listen) {
        listenTokens[network].push(symbol);
      }
    }
    await setListener(
      NetworkEnum[network.toUpperCase() as keyof typeof NetworkEnum],
      listenTokens[network],
    );

    if (accounts) {
      for (const account of accounts) {
        const address = Object.keys(account)[0];
        const name = account[address];
        listenAccounts[network].push({ [address]: name });
      }
    }
  }

  console.log('\n\n[Default Tokens]\n', defaultTokens);
  console.log('\n\n[ListenTokens]\n', listenTokens);
  console.log('\n\n[ListenAccounts]\n', listenAccounts);
};

const initTokens = async () => {
  const limit = pLimit(1);
  Object.keys(defaultTokens).map(async (network) => {
    defaultTokens[network].map(async (token) => {
      const symbol = Object.keys(token)[0];
      const address = Object.values(token)[0];

      await limit(() =>
        addToken(
          NetworkEnum[network.toUpperCase() as keyof typeof NetworkEnum],
          symbol,
          address,
        ),
      );
    });
  });
};

const initAccounts = async () => {
  const limit = pLimit(1);
  Object.keys(listenAccounts).map(async (network) => {
    listenAccounts[network].map(async (account) => {
      const address = Object.keys(account)[0];
      const name = Object.values(account)[0];

      await limit(() =>
        addAccount(
          NetworkEnum[network.toUpperCase() as keyof typeof NetworkEnum],
          address,
          name,
        ),
      );
    });
  });
};

await parseConfig();
await initTokens();
await initAccounts();
