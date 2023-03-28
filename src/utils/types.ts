export enum NetworkEnum {
  MAINNET = 'MAINNET',
  POLYGON = 'POLYGON',
  MUMBAI = 'MUMBAI',
}

export interface TokenMetadata {
  decimals: number;
  logo: string | null;
  name: string;
  symbol: string;
  threshold?: number;
  address?: {
    [network: string]: string;
  };
}

export interface TokenBalance {
  token: string;
  contractAddress?: string;
  account?: string;
  balance: string;
  symbol: string;
  logo: string;
}

export interface TransactionOptions {
  hash: string;
  from: string;
  to: string;
  token: string;
  amount: string;
  fromBalance?: string;
  toBalance?: string;
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
