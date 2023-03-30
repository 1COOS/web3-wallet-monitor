import { AccountDB } from '../db/account.db';
import { NetworkEnum } from '../utils/network';

export const accountMap = {};

export const addAccount = async (
  network: NetworkEnum,
  address: string,
  name: string,
): Promise<string> =>
  await AccountDB.setAccount(network, address, name)
    .then(async () => {
      await refreshAccountMap();
      return `Add account ${name} ${address} on  ${network} successfully`;
    })
    .catch((error) => {
      return error.reason;
    });

export const getName = async (network: NetworkEnum, address: string) => {
  return await AccountDB.getName(network, address);
};

export const getAccounts = async (network: NetworkEnum) => {
  return await AccountDB.getAccounts(network);
};

export const getAddresses = async (network: NetworkEnum) => {
  return await AccountDB.getAddresses(network);
};

export const removeAccount = async (
  network: NetworkEnum,
  address: string,
): Promise<string> => {
  return await AccountDB.removeAccount(network, address)
    .then(async () => {
      await refreshAccountMap();
      return `Remove account ${address} on  ${network} successfully`;
    })
    .catch((error) => {
      return error.reason;
    });
};

export const refreshAccountMap = async () => {
  console.log('refreshing account map');
  await Promise.all(
    Object.values(NetworkEnum).map(async (network) => {
      const accounts = await AccountDB.getAccounts(network);
      accountMap[network] = accounts;
    }),
  );
};

await refreshAccountMap();
