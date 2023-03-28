import { tokenMap } from '../service/tokens';
import { accountMap } from '../service/accounts';
import { NetworkEnum } from './types';

export const networkOptions = () => {
  return Object.keys(NetworkEnum).map((key) => ({
    name: key.toLowerCase(),
    value: key,
  }));
};

export const tokenOptions = (networkName: string) => {
  const network: NetworkEnum =
    NetworkEnum[networkName.toUpperCase() as keyof typeof NetworkEnum];
  const tokenOptions = tokenMap[network].map((token) => ({
    name: token,
    value: token,
  }));
  return tokenOptions;
};

export const accountOptions = (networkName: string) => {
  const network: NetworkEnum =
    NetworkEnum[networkName.toUpperCase() as keyof typeof NetworkEnum];
  const result = Object.entries(accountMap[network]).map(([name, value]) => ({
    name,
    value,
  }));
  return result;
};
