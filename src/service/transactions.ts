import { TxDB } from '../db/transaction.db';
import { NetworkEnum } from '../utils/types';

export const accountMap = {};

export const setListener = async (
  network: NetworkEnum,
  tokens: string[],
): Promise<string> =>
  await TxDB.setListener(network, tokens)

    .then(async () => {
      // await refreshAccountMap();
      return `Set Listener on ${network} successfully`;
    })
    .catch((error) => {
      return error.reason;
    });
