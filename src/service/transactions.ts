import { TxDB } from '../db/transaction.db';
import { NetworkEnum } from '../utils/network';

export const accountMap = {};

export const setListenTokens = async (
  network: NetworkEnum,
  tokens: string[],
): Promise<string> =>
  await TxDB.setListeneTokens(network, tokens)
    .then(async () => {
      return `Listening ${tokens} on ${network} successfully`;
    })
    .catch((error) => {
      return error.reason;
    });

export const getListenTokens = async (
  network: NetworkEnum,
): Promise<string[]> => await TxDB.getListenTokens(network);

export const getAllListenTokens = async (): Promise<{
  [network: string]: string[];
}> => await TxDB.getAllListenTokens();
