import { tokenMap } from '../service/tokens';
import { NetworkEnum } from './types';

export const networkOptions = () => {
  return Object.keys(NetworkEnum).map((key) => ({
    name: key.toLowerCase(),
    value: key,
  }));
};

export const tokenOptions = (networkName1: string) => {
  const networkName = networkName1.toUpperCase();
  let tokenOptions = [];
  if (networkName) {
    const network: NetworkEnum =
      NetworkEnum[networkName as keyof typeof NetworkEnum];
    console.log();

    tokenOptions = tokenMap[network].map((token) => ({
      name: token,
      value: token,
    }));
  }
  return tokenOptions;
};
