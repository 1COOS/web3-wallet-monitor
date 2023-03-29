import { TokenDB } from '../db/token.db';
import { getAlchemy } from '../utils/alchemy';
import { NetworkEnum, TokenMetadata } from '../utils/types';

export const tokenMap = {};

export const addToken = async (
  network: NetworkEnum,
  token: string,
  tokenAddress: string,
): Promise<string> => {
  try {
    let metadata = await getTokenMetadata(token);
    if (!metadata) {
      metadata = await fetchTokenMetadata(network, tokenAddress);
      metadata.threshold = 1;
    }
    await TokenDB.setToken(metadata.symbol, metadata);
    await TokenDB.setTokenAddress(network, metadata.symbol, tokenAddress);
    await refreshTokenMap();
    return `Add token ${token} on ${network} successfully`;
  } catch (error) {
    return error.reason;
  }
};

export const setTokenThreshold = async (
  token: string,
  threshold: number,
): Promise<string> => {
  try {
    await TokenDB.setTokenThreshold(token, threshold);
    return `Set ${token} threashold to ${threshold} successfully`;
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

export const refreshTokenMap = async () => {
  console.log('refreshing token map');
  await Promise.all(
    Object.values(NetworkEnum).map(async (network) => {
      const tokens = await TokenDB.getSupportedTokens(network);
      tokenMap[network] = tokens;
    }),
  );
};

const fetchTokenMetadata = async (
  network: NetworkEnum,
  tokenAddress: string,
) => {
  const alchemy = getAlchemy(network);
  const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
  return metadata;
};
// await refreshTokenMap();
