import { Alchemy, Network } from 'alchemy-sdk';
import { NetworkEnum } from './types';
import config from '../utils/config';

const alchemyMainnet = new Alchemy({
  apiKey: config.alchemy.APP_KEY,
  network: Network.ETH_MAINNET,
});

const alchemyMumbai = new Alchemy({
  apiKey: config.alchemy.APP_KEY,
  network: Network.MATIC_MUMBAI,
});

const alchemyPolygon = new Alchemy({
  apiKey: config.alchemy.APP_KEY,
  network: Network.MATIC_MAINNET,
});

let alchemyInstance: Alchemy;

// export const getContractMetadata = async (
//   network: NetworkEnum,
//   contractAddress: string,
// ) => {
//   alchemy = switchNetwork(network);
//   return await alchemy.core.getTokenMetadata(contractAddress);
// };

// const switchNetwork = (network: NetworkEnum) => {
//   switch (network) {
//     case NetworkEnum.MAINNET:
//       alchemy = alchemyMainnet;
//       break;
//     case NetworkEnum.POLYGON:
//       alchemy = alchemyPolygon;
//       break;
//     case NetworkEnum.MUMBAI:
//       alchemy = alchemyMumbai;
//       break;
//     default:
//   }
//   return alchemy;
// };

export const getAlchemy = (network: NetworkEnum): Alchemy => {
  switch (network) {
    case NetworkEnum.MAINNET:
      alchemyInstance = alchemyMainnet;
      break;
    case NetworkEnum.POLYGON:
      alchemyInstance = alchemyPolygon;
      break;
    case NetworkEnum.MUMBAI:
      alchemyInstance = alchemyMumbai;
      break;
    default:
  }
  return alchemyInstance;
};

/*
const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

const maticAddress = '0x0000000000000000000000000000000000001010';
const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

const bb = async (network: NetworkEnum, address: string) => {
  alchemy = switchNetwork(network);
  // const fetchedTokens = await alchemy.core.getTokenBalances(address);
  const fetchedTokens = await alchemy.core.getTokenBalances(vitalikAddress, [
    maticAddress,
    usdcAddress,
  ]);
  const ethBalance = await alchemy.core.getBalance(address);
  const parsedEthBalance = parseInt(ethBalance.toString()) / Math.pow(10, 18);
  console.log(parsedEthBalance);
  console.log(fetchedTokens);
  const ethBalanceObject = {
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    decimals: 18,
    balance: parsedEthBalance.toPrecision(2),
    address: '0x',
  };

  const fetchedTokenBalances = fetchedTokens.tokenBalances.map(
    (token) => token.tokenBalance,
  );

  const fetchedTokenAddresses = fetchedTokens.tokenBalances.map(
    (token) => token.contractAddress,
  );

  const fetchedTokenMetadata = await Promise.all(
    fetchedTokenAddresses.map(async (address) => {
      console.log(fetchedTokenAddresses);
      const metadata = await alchemy.core.getTokenMetadata(address);
      return metadata;
    }),
  );

  // const unifiedBalancedAndMetadata = [ethBalanceObject];

  for (let x = 0; x < fetchedTokenMetadata.length; x++) {
    const tokenMetadata = fetchedTokenMetadata[x];
    console.log(tokenMetadata);
    const { name, symbol, logo, decimals } = tokenMetadata;
    console.log(symbol);
    const hexBalance = fetchedTokenBalances[x];
    const address = fetchedTokenAddresses[x];
    let convertedBalance;

    if (hexBalance && tokenMetadata.decimals) {
      convertedBalance = parseInt(hexBalance) / Math.pow(10, decimals);

      if (convertedBalance > 0) {
        const tokenBalanceAndMetadata = {
          name,
          symbol,
          logo,
          decimals,
          // balance: convertedBalance.toPrecision(2),
          balance: convertedBalance,
          address,
        };
        console.log(tokenBalanceAndMetadata);
        // unifiedBalancedAndMetadata.push(tokenBalanceAndMetadata);
      }
    }
  }
};

await bb(NetworkEnum.POLYGON, '0xc1EA08a4Fb4AA13DC7dc56952B5F31E609a4bA5c');

// const usdcContract = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

// Print token balances of USDC in Vitalik's address
// alchemy.core
//   .getTokenBalances('0xc1EA08a4Fb4AA13DC7dc56952B5F31E609a4bA5c', [
//     maticAddress,
//     usdcAddress,
//   ])
//   .then(console.log);
*/
