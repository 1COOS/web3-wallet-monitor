export enum NetworkEnum {
  MAINNET = 'MAINNET',
  POLYGON = 'POLYGON',
  MUMBAI = 'MUMBAI',
}

export interface TokenBalance {
  token: string;
  contractAddress: string;
  account?: string;
  balance: number;
  symbol: string;
  logo: string;
}

export interface TokenOptions {
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
}

export interface EmbedOptions {
  color: string;
  title: string;
  url: string;
  name: string;
  icon: string;
  image: string;
  description?: string;
  network: string;
  contractAddress: string;
  from?: string;
  to?: string;
  txUrl?: string;
}
