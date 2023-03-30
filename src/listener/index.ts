import { getAllListenTokens } from '../service/transactions';
import { toEnum } from '../utils/network';
import { start } from './listener';

const init = async () => {
  const allTokens = await getAllListenTokens();
  for (const network in allTokens) {
    const tokens = allTokens[network];
    await start(toEnum(network), tokens);
  }
};

await init();
