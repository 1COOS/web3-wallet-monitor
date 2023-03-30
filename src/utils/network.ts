export enum NetworkEnum {
  MAINNET = 'MAINNET',
  POLYGON = 'POLYGON',
  MUMBAI = 'MUMBAI',
}

export const toEnum = (network: string) => {
  return NetworkEnum[network.toUpperCase() as keyof typeof NetworkEnum];
};
