/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	ActionIcon,
	Avatar,
	Box,
	Button,
	Divider,
	LoadingOverlay,
	Menu,
	Modal,
	Skeleton,
	Text,
	NumberInput,
} from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import {
	IconCopy,
	IconCopyCheck,
	IconLogout,
	IconSwitch2,
	IconWallet,
	// IconSearch,
	// IconSettings,
} from "@tabler/icons-react";
import classes from "./AdminHeader.module.css";
import { Logo } from "../Logo/Logo";
import ThemModeControl from "../ThemeModeControl";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isEmpty, isNil } from "ramda";

import {
	UserInfo,
	balanceAtom,
	btcConnectorAtom,
	connectedAtom,
	globalFeeRateAtom,
	hasNameAtom,
	networkAtom,
	userInfoAtom,
	walletAtom,
	walletRestoreParamsAtom,
} from "../../store/user";
import { useCallback, useEffect, useState } from "react";

import cls from "classnames";
import MetaidUserform, { MetaidUserInfo } from "./MetaidUserform";
import { MetaletWalletForBtc, btcConnect } from "@metaid/metaid";
import { IBtcConnector } from "@metaid/metaid";

import { useNavigate } from "react-router-dom";
import { metaidService } from "../../utils/api";
import { checkMetaletInstalled } from "../../utils/wallet";
// import { conirmMetaletTestnet } from "../../utils/wallet";
import { errors } from "../../utils/errors";
import { BtcNetwork, MAN_BASE_URL_MAPPING } from "../../utils/request";

interface Props {
	burger?: React.ReactNode;
}

export default function AdminHeader({ burger }: Props) {
	const [network, setNetwork] = useRecoilState(networkAtom);
	const [globalFeeRate, setGlobalFeeRate] = useRecoilState(globalFeeRateAtom);
	const [connected, setConnected] = useRecoilState(connectedAtom);
	const [wallet, setWallet] = useRecoilState(walletAtom);
	const [walletParams, setWalletParams] = useRecoilState(walletRestoreParamsAtom);
	const setBtcConnector = useSetRecoilState<IBtcConnector | null>(btcConnectorAtom);
	const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
	const [metaidFormOpened, metaidFormHandler] = useDisclosure(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [balance, setBalance] = useRecoilState(balanceAtom);
	const [hasName, setHasName] = useRecoilState(hasNameAtom);
	const navigate = useNavigate();

	const clipboard = useClipboard({ timeout: 3000 });
	const { data, isLoading } = useQuery({
		queryKey: ["pin", "list", 1],
		queryFn: () => metaidService.getPinList({ page: 1, size: 1 }, network),
	});

	const handleBeforeUnload = async () => {
		console.log("refresh ..........................", window, window.metaidwallet);
		if (!isNil(walletParams)) {
			const _wallet = MetaletWalletForBtc.restore(walletParams!);
			console.log("refeshing wallet", _wallet);

			setWallet(_wallet);
			const _btcConnector = await btcConnect({ wallet: _wallet, network: network });
			setUserInfo(_btcConnector.user);
			console.log("refetch user", _btcConnector.user);
		}
	};

	const wrapHandleBeforeUnload = useCallback(handleBeforeUnload, [walletParams, setUserInfo]);

	useEffect(() => {
		wrapHandleBeforeUnload();
	}, [wrapHandleBeforeUnload]);

	const MetaidInfo = ({
		hasMetaid,
		userInfo,
	}: {
		hasMetaid: boolean;
		userInfo: UserInfo | null;
	}) => {
		if (hasMetaid && !isNil(userInfo)) {
			return (
				<Menu shadow="md" width={120} position="bottom-end" withArrow classNames={{}}>
					<Menu.Target>
						<div>
							<Avatar
								radius="xl"
								size={"md"}
								src={
									!isEmpty(userInfo?.avatar)
										? MAN_BASE_URL_MAPPING[network] + userInfo.avatar
										: null
								}
								className="shadow-md cursor-pointer"
							>
								{(userInfo?.name ?? "").slice(0, 1)}
							</Avatar>
						</div>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Item onClick={() => navigate("/dashboard/my-pin")}>My Pin</Menu.Item>
						<Menu.Item onClick={metaidFormHandler.open}>Edit Profile</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			);
		}
		return (
			<Button variant="light" onClick={metaidFormHandler.open}>
				Create MetaID
			</Button>
		);
	};
	const onLogout = () => {
		setConnected(false);
		setBtcConnector(null);
		setUserInfo(null);
		window.metaidwallet.removeListener("accountsChanged", handleAcccountsChanged);
		window.metaidwallet.removeListener("networkChanged", handleNetworkChanged);
	};

	const handleAcccountsChanged = () => {
		onLogout();
		toast.error(
			"Wallet Account Changed ---- You have been automatically logged out of your current MetaID account. Please login again..."
		);
	};

	const handleNetworkChanged = async (network: BtcNetwork) => {
		console.log("network", network);
		if (connected) {
			onLogout();
		}
		toast.error("Wallet Network Changed  ");
		setNetwork(network ?? "testnet");
	};

	useEffect(() => {
		if (connected) {
			console.log("here");

			if (!isNil(window?.metaidwallet)) {
				window.metaidwallet.on("accountsChanged", handleAcccountsChanged);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [connected, window?.metaidwallet]);

	useEffect(() => {
		if (!isNil(window?.metaidwallet)) {
			window.metaidwallet.on("networkChanged", handleNetworkChanged);
		}
	}, [window?.metaidwallet]);

	const onWalletConnectStart = async () => {
		await checkMetaletInstalled();
		const _wallet = await MetaletWalletForBtc.create();
		const _network = (await window.metaidwallet.getNetwork()).network;
		setNetwork(_network);
		setWallet(_wallet);
		setWalletParams({ address: _wallet.address, pub: _wallet.pub });
		setBalance(((await _wallet?.getBalance())?.confirmed ?? 0).toString());
		// await conirmMetaletTestnet();
		if (isNil(_wallet?.address)) {
			toast.error(errors.NO_METALET_LOGIN);
			throw new Error(errors.NO_METALET_LOGIN);
		}
		setConnected(true);

		const _btcConnector = await btcConnect({ wallet: _wallet, network: _network });
		setBtcConnector(_btcConnector);

		const resUser = await _btcConnector.getUser({ network });
		setUserInfo(_btcConnector.user);
		setHasName(isNil(resUser?.name) ? false : true);

		console.log("user now", resUser);
		console.log("your btc address: ", _btcConnector.address);
	};

	const handleSubmitMetaId = async (userInfo: MetaidUserInfo) => {
		// console.log("userInfo", userInfo);

		setBalance(((await window.metaidwallet?.btc.getBalance())?.confirmed ?? 0).toString());
		setIsSubmitting(true);

		const _wallet = await MetaletWalletForBtc.restore(walletParams!);

		const _btcConnector = await btcConnect({ wallet: _wallet, network });
		if (hasName) {
			const res = await _btcConnector!
				.updateUserInfo({ ...userInfo, network })
				.catch((error) => {
					console.log("error", error);
					const errorMessage = error as TypeError;
					console.log(errorMessage.message);
					const toastMessage = errorMessage?.message?.includes(
						"Cannot read properties of undefined"
					)
						? "User Canceled"
						: errorMessage.message;
					toast.error(toastMessage);
					setIsSubmitting(false);
				});
			console.log("update res", res);
			if (res) {
				console.log("after create", await _btcConnector!.getUser({ network }));
				setUserInfo(await _btcConnector!.getUser({ network }));
				setIsSubmitting(false);
				toast.success("Updating Your Profile Successfully!");
			}
		} else {
			const res = await _btcConnector!
				.createUserInfo({ ...userInfo, network })
				.catch((error: any) => {
					setIsSubmitting(false);

					const errorMessage = TypeError(error).message;

					const toastMessage = errorMessage?.includes(
						"Cannot read properties of undefined"
					)
						? "User Canceled"
						: errorMessage;
					toast.error(toastMessage);
				});

			if (!res) {
				toast.error("Create Failed");
			} else {
				toast.success("Successfully created!Now you can connect your wallet again!");
				setHasName(true);
			}
		}

		setIsSubmitting(false);
		metaidFormHandler.close();
		// await onWalletConnectStart();
	};
	// console.log("useinfo hasMetaid", userInfo, hasMetaid);

	const handleSwitchNetwork = async (network: BtcNetwork) => {
		const res = await window.metaidwallet.switchNetwork({ network: network });
		if (res.status === "ok") {
			toast.success("switch network successfully!");
			setNetwork(res.network);
		} else if (res.status === "canceled") {
			toast.error("switch cancelled!", {
				className: "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
			});
			return;
		} else {
			toast.error("switch network failed!", {
				className: "!text-[#DE613F]!bg-[black] border border-[#DE613f]!rounded-lg",
			});
		}
	};
	return (
		<>
			{isLoading ? (
				<div className="flex justify-between w-full h-[60%] mt-3 mx-2">
					<Skeleton visible={isLoading} className="w-[30%] h-full"></Skeleton>
					<Skeleton visible={isLoading} className="w-[30%] h-full"></Skeleton>
				</div>
			) : (
				<header className={cls(classes.header, "pt-3 px-3")}>
					{burger && burger}
					<div className="flex items-center gap-6">
						<Logo />
						<Button variant="light" size="xs" radius="lg" className="hidden xl:block">
							{`total MetaID: ${data?.Count.metaId}` +
								"    |    " +
								`total PIN: ${data?.Count.Pin}` +
								"    |    " +
								`total Block: ${data?.Count.block}` +
								"    |    " +
								`total APP: ${data?.Count.app}`}
						</Button>
					</div>

					{/* <Box style={{ flex: 1 }} /> */}
					<div className="flex gap-2 items-center">
						<div className="hidden xl:flex gap-2 items-center">
							<Text size="sm" c="dimmed">
								Global FeeRate:
							</Text>
							<NumberInput
								size="xs"
								placeholder="Enter Here"
								variant="filled"
								className="w-[60px]"
								value={globalFeeRate}
								onChange={setGlobalFeeRate}
							/>
						</div>
						<Menu shadow="md" width={200}>
							<Menu.Target>
								<Button
									size="xs"
									leftSection={<IconSwitch2 size={16} />}
									variant="light"
									className="hidden xl:block"
								>
									{network ?? "testnet"}
								</Button>
							</Menu.Target>

							<Menu.Dropdown>
								{["Mainnet", "Testnet", "Regtest"].map((network) => {
									return (
										<Menu.Item
											key={network}
											onClick={() =>
												handleSwitchNetwork(
													network.toLowerCase() as BtcNetwork
												)
											}
										>
											{network}
										</Menu.Item>
									);
								})}
							</Menu.Dropdown>
						</Menu>
						<ThemModeControl />
						<Divider orientation="vertical" className="h-[20px] my-auto !mx-2" />
						{!connected ? (
							<Button
								variant="light"
								onClick={async () => {
									await onWalletConnectStart();
								}}
							>
								Connect Wallet
							</Button>
						) : (
							<div
								className={cls("flex items-center gap-4 relative", {
									"pr-2": hasName,
								})}
							>
								<div className="flex gap-1 text-gray-400 items-center">
									<IconWallet
										style={{ width: "70%", height: "70%" }}
										stroke={1.5}
									/>
									<div>
										{!isNil(wallet?.address) &&
											wallet?.address.slice(0, 4) +
												"..." +
												wallet?.address.slice(-4)}
									</div>

									{!clipboard.copied ? (
										<ActionIcon
											variant={"subtle"}
											color="gray"
											size="lg"
											aria-label="Settings"
										>
											<IconCopy
												className="cursor-pointer"
												style={{ width: "70%", height: "70%" }}
												stroke={1.5}
												onClick={() =>
													clipboard.copy(wallet?.address ?? "")
												}
											/>
										</ActionIcon>
									) : (
										<ActionIcon
											variant={"subtle"}
											color="gray"
											size="lg"
											aria-label="Settings"
										>
											<IconCopyCheck
												className="cursor-pointer"
												style={{ width: "70%", height: "70%" }}
												stroke={1.5}
											/>
										</ActionIcon>
									)}
									<Divider
										orientation="vertical"
										className="h-[20px] my-auto mx-2"
									/>
									<ActionIcon
										variant={"subtle"}
										color="gray"
										size="lg"
										aria-label="Settings"
									>
										<IconLogout
											onClick={onLogout}
											className="cursor-pointer"
											style={{ width: "70%", height: "70%" }}
											stroke={1.5}
										/>
									</ActionIcon>
								</div>
								<MetaidInfo hasMetaid={hasName} userInfo={userInfo} />
							</div>
						)}
					</div>
				</header>
			)}
			<Modal
				opened={metaidFormOpened}
				onClose={metaidFormHandler.close}
				title={hasName ? "Edit MetaID Detail" : "Create MetaID Detail"}
				size={"lg"}
			>
				<Box pos="relative">
					<LoadingOverlay
						visible={isSubmitting}
						zIndex={1000}
						overlayProps={{ radius: "sm", blur: 2 }}
					/>
					{/* ...other content */}
					<MetaidUserform
						onSubmit={handleSubmitMetaId}
						address={(wallet?.address || walletParams?.address) ?? ""}
						balance={balance}
						hasMetaid={hasName}
						userInfo={hasName && !isNil(userInfo) ? userInfo : undefined}
					/>
				</Box>
			</Modal>
		</>
	);
}
