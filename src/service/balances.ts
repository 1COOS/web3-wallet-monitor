import { NetworkEnum } from '../utils/network';
import { getAlchemy } from '../utils/provider';
import { TokenMetadata, TokenBalance } from '../utils/types';
import { getTokenAddresses, getTokenMetadata } from './tokens';

export const getTokensBalance = async (
  network: NetworkEnum,
  account: string,
  tokens: string[],
): Promise<TokenBalance[]> => {
  let tokenBalances: TokenBalance[] = [];
  const idx = tokens.indexOf('ETH');
  if (idx > -1) {
    const ethBalance = await getETHBalance(network, [account]);
    // tokenBalances.concat(ethBalance);
    tokenBalances = ethBalance;
    tokens.splice(idx, 1);
  }

  const alchemy = getAlchemy(network);
  const tokenAddresses = await getTokenAddresses(network, tokens);

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
  if (token.toUpperCase() === 'ETH') {
    return getETHBalance(network, accounts);
  } else {
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
  }
};

export const getETHBalance = async (
  network: NetworkEnum,
  accounts: string[],
): Promise<TokenBalance[]> => {
  const alchemy = getAlchemy(network);
  const ethMetadata = await getTokenMetadata('ETH');
  const tokenBalances: TokenBalance[] = [];

  await Promise.all(
    accounts.map(async (account) => {
      const ethBalance = await alchemy.core.getBalance(account);
      const convertedBalance =
        parseInt(ethBalance.toString()) / Math.pow(10, ethMetadata.decimals);

      const tokenBalance: TokenBalance = {
        balance: convertedBalance.toFixed(2),
        token: ethMetadata.symbol,
        account,
        symbol: ethMetadata.symbol,
        logo: ethMetadata.logo,
      };
      tokenBalances.push(tokenBalance);
    }),
  );
  return tokenBalances;
};
