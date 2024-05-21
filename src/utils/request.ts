import axios from "axios";
import { equals } from "ramda";

export type BtcNetwork = "mainnet" | "testnet" | "regtest";

const BASE_METAID_URL_TESTNET = `https://man-test.metaid.io`;
const BASE_METAID_URL_REGEST = `https://man.somecode.link`;
const BASE_METAID_URL_MAINNET = `https://man.metaid.io`;

export const MAN_BASE_URL_MAPPING = {
	testnet: BASE_METAID_URL_TESTNET,
	regtest: BASE_METAID_URL_REGEST,
	mainnet: BASE_METAID_URL_MAINNET,
};

export const api = axios.create({
	//   baseURL: BASE_URL,
	// timeout: 15000,
	headers: {
		"Content-Type": "application/json",
	},
	//    paramsSerializer:()=>{}
});

api.interceptors.response.use(
	({ data }) => {
		if (equals(data.code, 1) || equals(data.code, 100)) {
			return data.data;
		} else if (equals(data.code, 401)) {
			localStorage.setItem("token", "");
		} else if (equals(data.code, 400)) {
			throw data;
		} else {
			throw data;
		}
		// if (data.success || data.msg === 'success') {
		//     return data.data
		// } else {
		//     throw data.message
		// }
	},
	(err) => {
		console.log("server error", err);
		return Promise.reject(err);
	}
);
