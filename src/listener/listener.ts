import { Contract, ethers } from 'ethers';
import { ERC20Abi } from '../utils/contract';
import {
  TokenBalance,
  TokenMetadata,
  TransactionOptions,
} from '../utils/types';
import { send } from '../discord/messager';
import { getTokenAddresses, getTokenMetadata } from '../service/tokens';
import { getTokenBalance } from '../service/balances';
import { getAddresses } from '../service/accounts';
import { getName } from '../service/accounts';
import { TxDB } from '../db/transaction.db';
import { getProvider } from '../utils/provider';
import { NetworkEnum } from '../utils/network';

const activeListeners: { [network: string]: Contract[] } = {};

export const start = async (network: NetworkEnum, tokens: string[]) => {
  const tokenAddresses = await getTokenAddresses(network, tokens);
  const accounts = await getAddresses(network);
  const provider = getProvider(network);
  activeListeners[network] = [];

  if (tokenAddresses.length > 0 && !tokenAddresses.includes(null)) {
    tokenAddresses.forEach(async (address) => {
      const contract = new ethers.Contract(address, ERC20Abi, provider);
      const symbol = await contract.symbol();

      try {
        contract.on('Transfer', async (from, to, value, event) => {
          if (accounts.includes(from) || accounts.includes(to)) {
            const tokenMetadata: TokenMetadata = await getTokenMetadata(symbol);
            const amount = ethers.utils.formatUnits(
              value.toString(),
              tokenMetadata.decimals,
            );

            if (Number(amount) >= tokenMetadata.threshold) {
              const [fromBalance, toBalance]: TokenBalance[] =
                await getTokenBalance(network, [from, to], symbol);

              const tx: TransactionOptions = {
                from,
                to,
                amount,
                token: symbol,
                hash: event.transactionHash,
                fromBalance: Number(fromBalance.balance).toFixed(2),
                toBalance: Number(toBalance.balance).toFixed(2),
              };

              await send(network, tokenMetadata, tx);

              const info = ` [${amount}] ${await getName(
                network,
                from,
              )} -> ${await getName(network, to)}`;
              TxDB.add(network, symbol, info);
            }
          }
        });
      } catch (e) {
        console.log(e);
      }
      activeListeners[network].push(contract);
      console.log(`Listening on ${network} ${symbol}`);
    });
  }
};

export const reset = async (network: NetworkEnum, tokens: string[]) => {
  activeListeners[network]?.forEach((contract) => {
    contract.removeAllListeners('Transfer');
  });
  start(network, tokens);
};
