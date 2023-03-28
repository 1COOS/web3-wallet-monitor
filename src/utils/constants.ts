const Constants = {
  Mainnet: {
    EXPLORER: 'https://etherscan.io',
    ALCHEMY_PROVIDER: 'wss://eth-mainnet.g.alchemy.com/v2',
  },
  Polygon: {
    EXPLORER: 'https://polygonscan.com',
    ALCHEMY_PROVIDER: 'https://polygon-mainnet.g.alchemy.com/v2',
  },
  Mumbai: {
    EXPLORER: 'https://mumbai.polygonscan.com',
    ALCHEMY_PROVIDER: 'wss://polygon-mumbai.g.alchemy.com/v2',
  },
};

const Tokens = {
  ETH: {
    MAINNET: '0x',
  },
  USDT: {
    MAINNET: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    POLYGON: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },
  USDC: {
    MAINNET: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    POLYGON: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
  LINK: {
    MAINNET: '0x514910771af9ca656af840dff83e8264ecf986ca',
    POLYGON: '0xb0897686c545045aFc77CF20eC7A532E3120E0F1',
  },
  UNI: {
    MAINNET: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  },
  APE: {
    MAINNET: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
  },
  CRV: {
    MAINNET: '0xd533a949740bb3306d119cc777fa900ba034cd52',
  },
  SHIB: {
    MAINNET: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  },
  MATIC: {
    MAINNET: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    POLYGON: '0x0000000000000000000000000000000000001010',
  },
};

const DiscordConstants = {
  PROMPT_STRING: 'prompt',
  Commands: {
    ADMIN: 'admin',
    ACCOUNT: 'account',
  },
};

export { Constants, Tokens, DiscordConstants };
