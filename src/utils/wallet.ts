import { toast } from 'react-toastify';
import { errors } from './errors';

export const checkMetaletInstalled = async () => {
  const metalet = window?.metaidwallet;

  if (typeof metalet === 'undefined') {
    toast.error(errors.NO_METALET_DETECTED);
    throw new Error(errors.NO_METALET_DETECTED);
  }
  // const connectRes = await metalet.connect();
  // if (connectRes?.status === "not-logged-in") {
  // 	toast.error(errors.NO_METALET_LOGIN);
  // 	throw new Error(errors.NO_METALET_LOGIN);
  // }
};

export const conirmMetaletTestnet = async () => {
  const metalet = window?.metaidwallet;
  const network = await metalet?.getNetwork();
  if (network?.network === 'mainnet') {
    toast.error(errors.SWITCH_TESTNET_ALERT);
    await window.metaidwallet.switchNetwork({ network: 'testnet' });

    throw new Error(errors.SWITCH_TESTNET_ALERT);
  }
};
export const conirmMetaletMainnet = async () => {
  const metalet = window?.metaidwallet;
  const network = await metalet?.getNetwork();
  console.log('network', network);
  if (network?.network !== 'mainnet') {
    toast.error(errors.SWITCH_MAINNET_ALERT);
    await window.metaidwallet.switchNetwork({ network: 'mainnet' });

    throw new Error(errors.SWITCH_MAINNET_ALERT);
  }
};

export const checkMetaletConnected = async (connected: boolean) => {
  if (!connected) {
    toast.error(errors.NO_WALLET_CONNECTED);
    throw new Error(errors.NO_WALLET_CONNECTED);
  }
};
