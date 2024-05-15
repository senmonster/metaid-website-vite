/* eslint-disable @typescript-eslint/no-explicit-any */
import { BtcNetwork, MAN_BASE_URL_MAPPING, api } from './request';

// type MetaidService = {
//  };

export type MetaidItem = {
  number: number;
  rootTxId: string;
  name: string;
  nameId: string;
  address: string;
  avatar: string;
  avatarId: string;
  bio: string;
  bioId: string;
  soulbondToken: string;
  isInit: boolean;
};

export type Pin = {
  content: string;
  number: number;
  operation: string;
  height: number;
  id: string;
  type: string;
  path: string;
  pop: string;
  rootId: string;
};

export type PinDetail = {
  id: string;
  number: number;
  rootTxId: string;
  address: string;
  createAddress: string;
  output: string;
  outputValue: number;
  timestamp: number;
  genesisFee: number;
  genesisHeight: number;
  genesisTransaction: string;
  txInIndex: number;
  txInOffset: number;
  operation: string;
  path: string;
  parentPath: string;
  originalPath: string;
  encryption: string;
  version: string;
  contentType: string;
  contentTypeDetect: string; // text/plain; charset=utf-8
  contentBody: any;
  contentLength: number;
  contentSummary: '';
  status: number;
  originalId: '';
  isTransfered: boolean;
  preview: string; // "https://man-test.metaid.io/pin/4988b001789b5dd76db60017ce85ccbb04a3f2aa825457aa948dc3c1e3b6e552i0";
  content: string; // "https://man-test.metaid.io/content/4988b001789b5dd76db60017ce85ccbb04a3f2aa825457aa948dc3c1e3b6e552i0";
  pop: string;
};

type Count = {
  block: number;
  Pin: number;
  metaId: number;
  app: number;
};

type MetaidService = {
  getMetaidList: (
    params: {
      page: number;
      size: number;
    },
    network: BtcNetwork
  ) => Promise<MetaidItem[]>;
  getPinList: (
    params: {
      page: number;
      size: number;
    },
    network: BtcNetwork
  ) => Promise<{ Pins: Pin[]; Count: Count; Active: string }>;
  getPinListByAddress: (
    params: {
      addressType: string;
      address: string;
    },
    network: BtcNetwork
  ) => Promise<PinDetail[]>;
  getBlockList: (
    params: { page: number; size: number },
    network: BtcNetwork
  ) => Promise<{
    msgMap: Record<number, Pin[]>;
    msgList: number[];
    Active: string;
  }>;
  getMempoolList: (
    params: { page: number; size: number },
    network: BtcNetwork
  ) => Promise<{
    Count: Count;
    Active: string;
    Pins: Pin[];
  }>;
  getPinDetail: (
    params: { id: string },
    network: BtcNetwork
  ) => Promise<PinDetail>;
};

export const metaidService: MetaidService = {
  getMetaidList: (params, network) =>
    api.get(`${MAN_BASE_URL_MAPPING[network]}/api/metaid/list`, { params }),
  getPinList: (params, network) =>
    api.get(`${MAN_BASE_URL_MAPPING[network]}/api/pin/list`, { params }),
  getPinDetail: (params, network) =>
    api.get(`${MAN_BASE_URL_MAPPING[network]}/api/pin/${params.id}`),
  getBlockList: (params, network) =>
    api.get(`${MAN_BASE_URL_MAPPING[network]}/api/block/list`, { params }),
  getMempoolList: (params, network) =>
    api.get(`${MAN_BASE_URL_MAPPING[network]}/api/mempool/list`, { params }),
  getPinListByAddress: (params, network) =>
    api.get(
      `${MAN_BASE_URL_MAPPING[network]}/api/address/pin/list/${params.addressType}/${params.address}`
    ),
  //   getNodeList : (params) => api.get('/api/node/list', { params })
};

export type FeeRateApi = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

export async function fetchFeeRate({
  netWork,
}: {
  netWork?: 'testnet' | 'mainnet';
}): Promise<FeeRateApi> {
  const response = await fetch(
    `https://mempool.space/${
      netWork === 'mainnet' ? '' : 'testnet'
    }/api/v1/fees/recommended`,
    {
      method: 'get',
    }
  );
  return response.json();
}
