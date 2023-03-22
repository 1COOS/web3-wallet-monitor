import { NetworkEnum, TokenOptions } from '../utils/types';
import { getName } from './accounts';
import { getTokenMetadata, getTokenBalances, initTokens } from './tokens';

export const getBalances = async (
  network: NetworkEnum,
  address: string,
  tokens: string[],
) => {
  const fetchedTokenBalances = await getTokenBalances(network, address, tokens);
  console.log(fetchedTokenBalances);
};

// await initTokens();
await getBalances(
  NetworkEnum.POLYGON,
  '0xc1EA08a4Fb4AA13DC7dc56952B5F31E609a4bA5c',
  ['usdc', 'usdt', 'matic', 'link'],
);
