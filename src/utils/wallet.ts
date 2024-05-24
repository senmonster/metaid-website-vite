import { toast } from 'react-toastify';
import { errors } from './errors';
import { environment } from './envrionments';

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

export const conirmCurrentNetwork = async () => {
  const metalet = window?.metaidwallet;
  const network = await metalet?.getNetwork();
  if (network?.network !== environment.network) {
    toast.error(errors.SWITCH_NETWORK_ALERT);
    await window.metaidwallet.switchNetwork({ network: environment.network });

    throw new Error(errors.SWITCH_NETWORK_ALERT);
  }
};

export const checkMetaletConnected = async (connected: boolean) => {
  if (!connected) {
    toast.error(errors.NO_WALLET_CONNECTED);
    throw new Error(errors.NO_WALLET_CONNECTED);
  }
};
