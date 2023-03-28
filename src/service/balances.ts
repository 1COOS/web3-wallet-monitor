import { getAlchemy } from '../utils/alchemy';
import { NetworkEnum, TokenMetadata, TokenBalance } from '../utils/types';
import { getTokenAddresses, getTokenMetadata } from './tokens';

export const getTokensBalance = async (
  network: NetworkEnum,
  account: string,
  tokens: string[],
): Promise<TokenBalance[]> => {
  const alchemy = getAlchemy(network);
  console.log(network, account, tokens);
  const tokenAddresses = await getTokenAddresses(network, tokens);

  const tokenBalances: TokenBalance[] = [];
  if (tokenAddresses.length > 0 && !tokenAddresses.includes(null)) {
    const fetchedTokens = await alchemy.core.getTokenBalances(
      account,
      tokenAddresses,
    );
    await Promise.all(
      fetchedTokens.tokenBalances.map(async (item, i) => {
        const tokenMetadata: TokenMetadata = await getTokenMetadata(tokens[i]);
        const { symbol, logo, decimals } = tokenMetadata;

        const hexBalance = item.tokenBalance;
        if (hexBalance && tokenMetadata.decimals) {
          const convertedBalance =
            parseInt(hexBalance) / Math.pow(10, decimals);

          const tokenBalance: TokenBalance = {
            contractAddress: item.contractAddress,
            balance: convertedBalance.toFixed(2),
            token: tokens[i],
            account,
            symbol,
            logo,
          };
          tokenBalances.push(tokenBalance);
        }
      }),
    );
  }
  return tokenBalances;
};

export const getTokenBalance = async (
  network: NetworkEnum,
  accounts: string[],
  token: string,
): Promise<TokenBalance[]> => {
  const alchemy = getAlchemy(network);
  console.log(network, accounts, token);
  const tokenMetadata = await getTokenMetadata(token);

  const tokenBalances: TokenBalance[] = [];

  await Promise.all(
    accounts.map(async (account) => {
      const fetchedTokens = await alchemy.core.getTokenBalances(account, [
        tokenMetadata.address[network],
      ]);

      fetchedTokens.tokenBalances.map(async (item) => {
        const hexBalance = item.tokenBalance;
        if (hexBalance && tokenMetadata.decimals) {
          const convertedBalance =
            parseInt(hexBalance) / Math.pow(10, tokenMetadata.decimals);

          const tokenBalance: TokenBalance = {
            contractAddress: item.contractAddress,
            balance: convertedBalance.toFixed(2),
            token,
            account,
            symbol: tokenMetadata.symbol,
            logo: tokenMetadata.logo,
          };
          tokenBalances.push(tokenBalance);
        }
      });
    }),
  );
  return tokenBalances;
};
