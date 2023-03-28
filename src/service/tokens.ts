import { TokenDB } from '../db/token.db';
import { getAlchemy } from '../utils/alchemy';
import { NetworkEnum, TokenMetadata, TokenBalance } from '../utils/types';
import { Tokens } from '../utils/constants';

export const tokenMap = {};

export const addToken = async (
  network: NetworkEnum,
  token: string,
  tokenAddress: string,
): Promise<string> => {
  try {
    let metadata = await getTokenMetadata(token);
    console.log('m1', metadata);
    if (!metadata) {
      metadata = await fetchTokenMetadata(network, tokenAddress);
      console.log('m2', metadata);
      await TokenDB.setToken(metadata.symbol, metadata);
    }
    await TokenDB.setTokenAddress(network, metadata.symbol, tokenAddress);
    return `Add token ${token} on  ${network} successfully`;
  } catch (error) {
    return error.reason;
  }
};

export const getTokenAddresses = async (
  network: NetworkEnum,
  tokens: string[],
): Promise<string[]> => {
  const tokenAddresses = await Promise.all(
    tokens.map(async (token) => {
      return await TokenDB.getTokenAddress(network, token);
    }),
  );
  return tokenAddresses;
};

export const getTokenMetadata = async (
  token: string,
): Promise<TokenMetadata> => {
  return await TokenDB.getToken(token);
};

export const getTokenBalances = async (
  network: NetworkEnum,
  account: string,
  tokens: string[],
): Promise<TokenBalance[]> => {
  const alchemy = getAlchemy(network);
  console.log(network, account, tokens);
  const tokenAddresses = await getTokenAddresses(network, tokens);

  const tokenBalances: TokenBalance[] = [];
  if (tokenAddresses.length > 0 && !tokenAddresses.includes(null)) {
    const fetchedTokens = await alchemy.core.getTokenBalances(
      account,
      tokenAddresses,
    );
    await Promise.all(
      fetchedTokens.tokenBalances.map(async (item, i) => {
        const tokenMetadata: TokenMetadata = await getTokenMetadata(tokens[i]);
        const { symbol, logo, decimals } = tokenMetadata;

        const hexBalance = item.tokenBalance;
        if (hexBalance && tokenMetadata.decimals) {
          const convertedBalance =
            parseInt(hexBalance) / Math.pow(10, decimals);

          const tokenBalance: TokenBalance = {
            contractAddress: item.contractAddress,
            balance: convertedBalance.toFixed(2),
            token: tokens[i],
            account,
            symbol,
            logo,
          };
          tokenBalances.push(tokenBalance);
        }
      }),
    );
  }
  return tokenBalances;
};

export const refreshTokenMap = async () => {
  console.log('refreshing token map');
  await Promise.all(
    Object.values(NetworkEnum).map(async (network) => {
      const tokens = await TokenDB.getSupportedTokens(network);
      tokenMap[network] = tokens;
    }),
  );
};
await refreshTokenMap();

export const initTokens = async () => {
  const defaultTokens = ['matic', 'usdc', 'usdt'];
  const network = NetworkEnum.POLYGON;
  await Promise.all(
    defaultTokens.map(async (token) => {
      await addToken(network, token, Tokens[token.toUpperCase()][network]);
    }),
  );
};

export const getETHBalance = async () => {
  // const ethBalanceObject = {
  //   name: 'Ethereum',
  //   symbol: 'ETH',
  //   logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  //   decimals: 18,
  //   balance: parsedEthBalance.toFixed(2),
  //   address: '0x',
  // };
  // const unifiedBalancedAndMetadata = [ethBalanceObject];
};

const fetchTokenMetadata = async (
  network: NetworkEnum,
  tokenAddress: string,
) => {
  const alchemy = getAlchemy(network);
  const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
  return metadata;
};
