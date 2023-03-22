import { ethers } from 'ethers';
import { getTokenAddresses, getTokenMetadata } from '../handler/tokens';
import { getAccounts } from '../handler/accounts';
import { webhook } from '../discord/webhook';
import { ERC20Abi } from '../utils/contract';
import { NetworkEnum, TokenOptions } from '../utils/types';
import { getName } from '../handler/accounts';
import { TxDB } from '../db/transaction.db';

import config from '../utils/config';

export const listen = async (network: NetworkEnum) => {
  const tokens = ['usdc', 'matic'];
  const tokenAddresses = await getTokenAddresses(network, tokens);
  const accounts = await getAccounts(network);

  const provider = new ethers.providers.WebSocketProvider(
    config.provider[`${network}`],
  );

  if (tokenAddresses.length > 0 && !tokenAddresses.includes(null)) {
    tokenAddresses.forEach(async (address) => {
      const contract = new ethers.Contract(address, ERC20Abi, provider);
      const symbol = await contract.symbol();
      console.log(symbol, address);
      try {
        contract.on('Transfer', async (from, to, value, event) => {
          if (accounts.includes(from) || accounts.includes(to)) {
            const tokenMetadata: TokenOptions = await getTokenMetadata(symbol);
            console.log(tokenMetadata);
            const { logo, decimals } = tokenMetadata;

            const amount = ethers.utils.formatUnits(value.toString(), decimals);

            const info = ` [${amount}] ${await getName(
              network,
              from,
            )} -> ${await getName(network, to)}`;
            TxDB.add(network, symbol, info);
          }
        });
      } catch (e) {
        console.log(e);
      }
      console.log(`Listening on ${network} ${symbol}`);
    });
  }
};

await listen(NetworkEnum.MUMBAI);
