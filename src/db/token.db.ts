import { JsonDB, Config } from 'node-json-db';
import { NetworkEnum, TokenOptions } from '../utils/types';

const tokenDB = new JsonDB(new Config('db/tokens.json', true, true, '/'));

const setToken = async (symbol: string, tokenOption: TokenOptions) => {
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

const getToken = async (symbol: string): Promise<TokenOptions> => {
  if (await tokenExists(symbol)) {
    return await tokenDB.getObject<TokenOptions>(`/${symbol.toUpperCase()}`);
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

const TokenDB = {
  setToken,
  setTokenAddress,
  getToken,
  getTokenAddress,
  tokenExists,
};
export { TokenDB };
