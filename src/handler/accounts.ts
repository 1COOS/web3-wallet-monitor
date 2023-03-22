import { AccountDB } from '../db/account.db';
import { NetworkEnum } from '../utils/types';

export const addAccount = async (
  network: NetworkEnum,
  address: string,
  name: string,
) => {
  await AccountDB.setAccount(network, address, name);
};

export const getName = async (network: NetworkEnum, address: string) => {
  return await AccountDB.getName(network, address);
};

export const getAccounts = async (network: NetworkEnum) => {
  return await AccountDB.getAddresses(network);
};
