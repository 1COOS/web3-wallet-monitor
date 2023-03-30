import { Alchemy, Network } from 'alchemy-sdk';
import { NetworkEnum } from './network';
import config from './config';
import { ethers } from 'ethers';

let providerInstance: ethers.providers.Provider;

let alchemyInstance: Alchemy;

const providerMainnet = new ethers.providers.WebSocketProvider(
  config.provider[NetworkEnum.MAINNET],
);

const providerPolygon = new ethers.providers.WebSocketProvider(
  config.provider[NetworkEnum.POLYGON],
);
const providerMumbai = new ethers.providers.WebSocketProvider(
  config.provider[NetworkEnum.MUMBAI],
);

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

export const getProvider = (
  network: NetworkEnum,
): ethers.providers.Provider => {
  switch (network) {
    case NetworkEnum.MAINNET:
      providerInstance = providerMainnet;
      break;
    case NetworkEnum.POLYGON:
      providerInstance = providerPolygon;
      break;
    case NetworkEnum.MUMBAI:
      providerInstance = providerMumbai;
      break;
    default:
  }
  return providerInstance;
};

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
