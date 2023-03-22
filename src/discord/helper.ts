import { ethers } from 'ethers';
import { EmbedOptions, NetworkEnum } from '../utils/types';

import config from '../utils/config';

export const createEmbedOptions = (
  network: NetworkEnum,
  contractAddress: string,
  name: string,
  symbol: string,
  txHash: string,
  from: string,
  to: string,
  tokenId: string,
  icon: string,
  image: string,
  description: string,
) => {
  const explorer = config.explorer[`${network}`];
  const txUrl = `${explorer}/tx/${txHash}`;
  const url = `${explorer}/address/${contractAddress}`;
  const fromUrl = `${explorer}/address/${from}`;
  const toUrl = `${explorer}/address/${to}`;

  let title = 'Transfer';
  let color = 'Gold';

  if (from === ethers.constants.AddressZero) {
    title = 'Mint';
    color = 'Aqua';
  } else {
    // from = `[${getAddressName(network, from)}](${fromUrl})`;
  }
  if (to === ethers.constants.AddressZero) {
    title = 'Burn';
    color = 'DarkGrey';
  } else {
    // to = `[${getAddressName(network, to)}](${toUrl})`;
  }

  const embedOptions: EmbedOptions = {
    color,
    title: `${network} - ${symbol} #${tokenId} - ${title} `,
    url,
    name,
    network,
    contractAddress,
    txUrl,
    from,
    to,
    icon,
    image,
    description,
  };
  return embedOptions;
};
