import { Alchemy, Network } from 'alchemy-sdk';
import { NetworkEnum } from './types';
import config from '../utils/config';

const alchemyMainnet = new Alchemy({
  apiKey: config.alchemy.APP_KEY,
  network: Network.ETH_MAINNET,
});

const alchemyMumbai = new Alchemy({
  apiKey: config.alchemy.APP_KEY,
  network: Network.MATIC_MUMBAI,
});

const alchemyPolygon = new Alchemy({
  apiKey: config.alchemy.APP_KEY,
  network: Network.MATIC_MAINNET,
});

let alchemyInstance: Alchemy;

export const getAlchemy = (network: NetworkEnum): Alchemy => {
  switch (network) {
    case NetworkEnum.MAINNET:
      alchemyInstance = alchemyMainnet;
      break;
    case NetworkEnum.POLYGON:
      alchemyInstance = alchemyPolygon;
      break;
    case NetworkEnum.MUMBAI:
      alchemyInstance = alchemyMumbai;
      break;
    default:
  }
  return alchemyInstance;
};
