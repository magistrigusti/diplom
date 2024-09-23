import {Address, Cell, Slice, Builder, contractAddress, beginCell, storeStateInit, Dictionary, DictionaryKey, DictionaryValue, DictionaryKeyTypes} from '@ton/core';
import { encodeOffChainContent } from '../nft-content/nftContent';

export type RoyaltyParams = {
  royaltyFactor: number,
  royaltyBase: number,
  royaltyAddress: Address 
}

export type NFTCollectionData = {
  ownerAddress: Address,
  nextItemIndex?: number | bigint,
  collectionContent: string | Cell,
  commonContent: string | Cell,
  nftItemCode: Cell,
  royaltyParams: RoyaltyParams
}

export function buildNftCollectionDataCell(data: NftCollectionData) {
  let dataCell = beginCell();

  dataCell.storeAddress(data.ownerAddress);
  dataCell.storeUint(data.nextItemIndex || 0, 64);

  let contentCell = beginCell();
  let collectionContent = (data.collectionContent instanceof Cell) ?
      data.collectionContent : encodeOffChainContent(data.collectionContent);
  let commonContent = (data.collectionContent instanceof Cell) ?
      data.commonContent : beginCell().storeStringTail(data.commonContent).endCell();
  
  contentCell.storeRef(collectionContent);
  contentCell.storeRef(commonContent);
  dataCell.storeRef(contentCell);
  dataCell.storeRef(data.nftItemCode);

  let royaltyCell = beginCell();
  royaltyCell.storeUint(data.royaltyParams.royaltyFactor, 16);
  royaltyCell.storeUint(data.royaltyParams.royaltyBase, 16);
  royaltyCell.storeAddress(data.royaltyParams.royaltyAddress);
  dataCell.storeRef(royaltyCell);

  return dataCell.endCell();
}

export function buildNftCollectionStateInit(conf: NFTCollectionData, code: Cell) {
  let dataCell = buildNftCollectionDataCell(conf);
  let stateInit = {
    code: code,
    data: dataCell 
  };
  let stateInitCell = storeStateInit(stateInit);
  let address = contractAddress(0, stateInit);

  return {
    stateInit: stateInitCell,
    stateInitMessage: stateInit,
    address,
  };
}

export const OperationCodes = {
  Mint: 1,
  BatchMint: 2,
  ChangeOwner: 3,
  EditContent: 4,
  GetRoyaltyParams: 0x693d3950,
  GetRoyaltyParamsResponse: 0xa8cb00ad
}

export type CollectionMintNftItemInput = {
  passAmount: bigint,
  index: number,
  ownerAddress: Address,
  content: string | Cell 
}

export type CollectionMintSbtItemInput = {
  passAmount: bigint,
  index: number,
  ownerAddress: Address,
  authorityAddress: Address,
  content: string | Cell 
}

export const Queries = {
  mintNft: (params: {queryId?: number, passAmount: bigint, itemIndex: number,
    itemOwnerAddress: Address, itemContent: string | Cell }) => {
      let msgBody = beginCell();

      msgBody.storeUint(OperationCodes.Mint, 32);
      msgBody.storeUint(params.queryId || 0, 64);
      msgBody.storeUint(params.itemIndex, 64);
      msgBody.storeCoins(params.passAmount);

      let itemContent = (params.itemContent instanceof Cell) ? params.itemContent :
      beginCell().storeStringTail(params.itemContent).endCell();
      let nftItemMessage = beginCell();
    }
}