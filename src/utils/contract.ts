import { ethers } from 'ethers';

export const isERC20Contract = async (
  address: string,
  provider: ethers.providers.Provider,
): Promise<boolean> => {
  const code = await provider.getCode(address);
  const ERC20Code = '0x6080604052';
  return code.startsWith(ERC20Code);
};

export const isERC721Contract = async (
  address: string,
  provider: ethers.providers.Provider,
): Promise<boolean> => {
  const code = await provider.getCode(address);
  const ERC721Code = '0x6080604052';
  return code.startsWith(ERC721Code);
};

// ABI for ERC721 interface
export const ERC721Abi = [
  'event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'function name() public view returns (string memory)',
  'function symbol() public view returns (string memory)',
];

// ABI for ERC721 interface
export const ERC20Abi = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function symbol() public view  returns (string memory)',
];
