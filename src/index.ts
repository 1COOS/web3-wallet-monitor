import { NetworkEnum } from './utils/types';

import './discord';
import { listen } from './listener';
import './service/balances';
await listen(NetworkEnum.MUMBAI);
