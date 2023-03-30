import { JsonDB, Config } from 'node-json-db';
import dayjs from 'dayjs';
import { NetworkEnum } from '../utils/network';

const configDB = new JsonDB(new Config('db/tx.config.json', true, true, '/'));

const txMainnetDB = new JsonDB(
  new Config('db/tx.mainnet.json', true, true, '/'),
);
const txPolygonDB = new JsonDB(
  new Config('db/tx.polygon.json', true, true, '/'),
);
const txMumbaiDB = new JsonDB(new Config('db/tx.mumbai.json', true, true, '/'));

const setListeneTokens = async (network: NetworkEnum, tokens: string[]) => {
  await configDB.push(`/listener/${network}`, tokens);
};

const getListenTokens = async (network: NetworkEnum): Promise<string[]> => {
  return await configDB.getData(`/listener/${network}`);
};

const getAllListenTokens = async (): Promise<{
  [network: string]: string[];
}> => {
  return await configDB.getData(`/listener`);
};

const add = async (network: NetworkEnum, symbol: string, info: string) => {
  let txDB;
  switch (network) {
    case NetworkEnum.MAINNET:
      txDB = txMainnetDB;
      break;
    case NetworkEnum.POLYGON:
      txDB = txPolygonDB;
      break;
    case NetworkEnum.MUMBAI:
      txDB = txMumbaiDB;
      break;
    default:
  }
  await txDB.push(
    `/${symbol.toUpperCase()}[]`,
    `${dayjs().format('YYYY-MM-DD HH:mm:ss')} ${info}`,
  );
};

const TxDB = {
  add,
  setListeneTokens,
  getListenTokens,
  getAllListenTokens,
};
export { TxDB };
