import { IBtcConnector, IMetaletWalletForBtc } from '@metaid/metaid';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export type UserInfo = {
  number: number;
  rootTxId: string;
  name: string;
  nameId: string;
  avatarId: string;
  bioId: string;
  address: string;
  avatar: string | null;
  bio: string;
  soulbondToken: string;
  unconfirmed: string;
  metaid: string;
};

export const connectedAtom = atom({
  key: 'connectedAtom',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const btcConnectorAtom = atom<IBtcConnector | null>({
  key: 'btcConnectorAtom',
  default: null,
  effects_UNSTABLE: [persistAtom],
});
export const userInfoAtom = atom<UserInfo | null>({
  key: 'userInfoAtom',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const walletAtom = atom<IMetaletWalletForBtc | null>({
  key: 'walletAtom',
  default: null,
  // effects_UNSTABLE: [persistAtom],
});

export const walletRestoreParamsAtom = atom<{
  address: string;
  pub: string;
} | null>({
  key: 'walletRestoreParamsAtom',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const balanceAtom = atom<string>({
  key: 'balanceAtom',
  default: '0',
  effects_UNSTABLE: [persistAtom],
});

export const hasNameAtom = atom<boolean>({
  key: 'hasNameAtom',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const globalFeeRateAtom = atom<number>({
  key: 'globalFeeRateAtom',
  default: 30,
});
