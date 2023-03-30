import { JsonDB, Config } from 'node-json-db';
import { ethers } from 'ethers';
import { NetworkEnum } from '../utils/network';

const accountDB = new JsonDB(new Config('db/accounts.json', true, true, '/'));

const setAccount = async (
  network: NetworkEnum,
  address: string,
  name: string,
) => {
  await accountDB.push(`/${network}/${ethers.utils.getAddress(address)}`, name);
};

const removeAccount = async (network: NetworkEnum, address: string) => {
  await accountDB.delete(`/${network}/${ethers.utils.getAddress(address)}`);
};

const getName = async (
  network: NetworkEnum,
  address: string,
): Promise<string> => {
  const addr = ethers.utils.getAddress(address);
  console.log(addr, network);
  if (await addressExists(network, addr)) {
    return await accountDB.getObject(`/${network}/${addr}`);
  }
  return address;
};

const addressExists = async (
  network: NetworkEnum,
  address: string,
): Promise<boolean> => {
  try {
    await accountDB.getData(`/${network}/${address}`);
    return true;
  } catch (error) {
    return false;
  }
};

const getAccounts = async (network: NetworkEnum) => {
  return await accountDB.getData(`/${network}`);
};

const getAddresses = async (network: NetworkEnum) => {
  const addressesObj = await accountDB.getData(`/${network}`);
  return Object.entries(addressesObj).map(([address]) => address);
};

const AccountDB = {
  setAccount,
  removeAccount,
  getName,
  getAccounts,
  getAddresses,
};
export { AccountDB };
