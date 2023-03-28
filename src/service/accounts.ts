import { AccountDB } from '../db/account.db';
import { NetworkEnum } from '../utils/types';

export const addAccount = async (
  network: NetworkEnum,
  address: string,
  name: string,
): Promise<string> =>
  await AccountDB.setAccount(network, address, name)
    .then(() => {
      return `Add account ${name} ${address} on  ${network} successfully`;
    })
    .catch((error) => {
      return error.reason;
    });

export const getName = async (network: NetworkEnum, address: string) => {
  return await AccountDB.getName(network, address);
};

export const getAccounts = async (network: NetworkEnum) => {
  return await AccountDB.getAddresses(network);
};

export const removeAccount = async (
  network: NetworkEnum,
  address: string,
): Promise<string> => {
  return await AccountDB.removeAccount(network, address)
    .then(() => {
      return `Remove account ${address} on  ${network} successfully`;
    })
    .catch((error) => {
      return error.reason;
    });
};
