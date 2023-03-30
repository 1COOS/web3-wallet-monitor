import { JsonDB, Config } from 'node-json-db';
import { NetworkEnum } from '../utils/network';
import { TokenMetadata } from '../utils/types';

const tokenDB = new JsonDB(new Config('db/tokens.json', true, true, '/'));

const setToken = async (symbol: string, tokenOption: TokenMetadata) => {
  await tokenDB.push(`/${symbol.toUpperCase()}`, tokenOption);
};

const setTokenAddress = async (
  network: NetworkEnum,
  symbol: string,
  address: string,
) => {
  if (await tokenExists(symbol)) {
    await tokenDB.push(`/${symbol.toUpperCase()}/address/${network}`, address);
  }
};

const setTokenThreshold = async (symbol: string, threshold: number) => {
  if (await tokenExists(symbol)) {
    await tokenDB.push(`/${symbol.toUpperCase()}/threshold`, threshold);
  }
};

const getToken = async (symbol: string): Promise<TokenMetadata> => {
  if (await tokenExists(symbol)) {
    return await tokenDB.getObject<TokenMetadata>(`/${symbol.toUpperCase()}`);
  }
  return null;
};

const getTokenAddress = async (network: NetworkEnum, symbol: string) => {
  if (await tokenExists(symbol)) {
    return await tokenDB.getData(`/${symbol.toUpperCase()}/address/${network}`);
  }
  return null;
};

const tokenExists = async (symbol: string): Promise<boolean> => {
  try {
    await tokenDB.getData(`/${symbol.toUpperCase()}`);
    return true;
  } catch (error) {
    console.error(`Token ${symbol.toUpperCase()} not found`);
    // console.error(error);
    return false;
  }
};

const getSupportedTokens = async (network: NetworkEnum) => {
  const supportedTokens = [];
  const tokens: { [symbol: string]: TokenMetadata } = await tokenDB.getData(
    '/',
  );
  for (const symbol in tokens) {
    const token = await tokenDB.getObject<TokenMetadata>(
      `/${symbol.toUpperCase()}`,
    );
    if (token.address[network]) {
      supportedTokens.push(symbol);
    }
  }
  return supportedTokens;
};

const TokenDB = {
  setToken,
  setTokenAddress,
  setTokenThreshold,
  getToken,
  getTokenAddress,
  tokenExists,
  getSupportedTokens,
};
export { TokenDB };
