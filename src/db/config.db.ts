import { JsonDB, Config } from 'node-json-db';
import { ethers } from 'ethers';
import { NetworkEnum } from '../utils/types';

const configDB = new JsonDB(new Config('db/config.json', true, true, '/'));

// const init = async (network: NetworkEnum, ) => {
//   await configDB.push(`/${ethers.utils.getAddress(address)}`, name);
// };

// const getName = async (address: string): Promise<string> => {
//   const addr = ethers.utils.getAddress(address);
//   if (await addressExists(addr)) {
//     return await accountDB.getObject(`/${addr}`);
//   }
//   return address;
// };

// const addressExists = async (address: string): Promise<boolean> => {
//   try {
//     await accountDB.getData(`/${address}`);
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

// const AccountDB = {
//   setAccount,
//   getName,
// };
// export { AccountDB };
