/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, SubmitHandler } from "react-hook-form";
import { isEmpty, isNil } from "ramda";
import { image2Attach } from "../../../utils/file";
import { useClipboard } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

import { useMemo, useState } from "react";
import CustomFeerate from "./CustomFeerate";
import useImagesPreview from "../../../hooks/useImagesPreview";
import { fetchFeeRate } from "../../../utils/api";
import { IconCopy, IconCopyCheck } from "@tabler/icons-react";

import { Avatar, Button, Center, TextInput } from "@mantine/core";
import { UserInfo, globalFeeRateAtom, networkAtom } from "../../../store/user";
// import { useEffect, useState } from 'react';
import { useRecoilValue } from "recoil";
import { MAN_BASE_URL_MAPPING } from "../../../utils/request";

export type FormUserInfo = {
	name: string;
	avatar: FileList;
	bio?: string;
};

export type MetaidUserInfo = {
	name: string;
	bio?: string;
	avatar?: string;
	feeRate?: number;
};

type IProps = {
	onSubmit: (userInfo: MetaidUserInfo) => void;

	address: string;
	balance: string;
	hasMetaid: boolean;
	userInfo?: UserInfo;
};

const MetaidUserform = ({ onSubmit, address, balance, hasMetaid, userInfo }: IProps) => {
	const network = useRecoilValue(networkAtom);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormUserInfo>({
		defaultValues: { name: userInfo?.name },
	});

	const avatar = watch("avatar");

	const { data: feeRateData } = useQuery({
		queryKey: ["feeRate"],
		queryFn: () => fetchFeeRate({ netWork: "testnet" }),
	});
	const globalFeeRate = useRecoilValue(globalFeeRateAtom);
	const [customFee, setCustomFee] = useState<string>(globalFeeRate.toString());

	const feeRateOptions = useMemo(() => {
		return [
			{ name: "Slow", number: feeRateData?.hourFee ?? Number(globalFeeRate) },
			{ name: "Avg", number: feeRateData?.halfHourFee ?? Number(globalFeeRate) },
			{ name: "Fast", number: feeRateData?.fastestFee ?? Number(globalFeeRate) },
			{ name: "Custom", number: Number(customFee) },
		];
	}, [feeRateData, customFee, globalFeeRate]);
	const [selectFeeRate, setSelectFeeRate] = useState<{
		name: string;
		number: number;
	}>({
		name: "Custom",
		number: Number(customFee),
	});

	const [filesPreview, setFilesPreview] = useImagesPreview(avatar);
	const onCreateSubmit: SubmitHandler<FormUserInfo> = async (data) => {
		const submitAvatar =
			!isNil(data?.avatar) && data.avatar.length !== 0 ? await image2Attach(data.avatar) : [];

		const submitData = {
			...data,
			avatar: !isEmpty(submitAvatar)
				? Buffer.from(submitAvatar[0].data, "hex").toString("base64")
				: undefined,
			bio: isEmpty(data?.bio ?? "") ? undefined : data?.bio,
			feeRate: selectFeeRate?.number ?? 1,
		};
		console.log("submit profile data", submitData);
		onSubmit(submitData);
	};
	// console.log("avatar", avatar, !isEmpty(avatar));
	const clipboard = useClipboard({ timeout: 3000 });
	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit(onCreateSubmit)}
			className="mt-2 flex flex-col gap-6"
		>
			<div className="flex flex-col gap-2 text-[12px] text-slate-400">
				<div className="flex gap-6">
					<div className="flex gap-2 items-center">
						<div className="">Your Address: </div>
						<div> {address.slice(0, 4) + "..." + address.slice(-4)}</div>
						{!clipboard.copied ? (
							<IconCopy
								className="cursor-pointer text-gray/30 hover:text-gray"
								onClick={() => clipboard.copy(address)}
								size={16}
							/>
						) : (
							<IconCopyCheck className="cursor-pointer text-main" size={16} />
						)}
					</div>
					<div className="flex gap-2">
						<div>Your Balance: </div>
						<div> {balance}</div>
						<div>sats</div>
					</div>
				</div>
				<div className="">This address has not created MetaID.Please create one first.</div>
			</div>
			<div className="flex flex-col gap-8 mt-4">
				<TextInput
					type="text"
					placeholder="Your name"
					{...register("name", { required: true })}
					error={errors.name && "Username can not be empty."}
				/>

				<input type="file" id="addPFP" className="hidden" {...register("avatar")} />
				{hasMetaid && (isNil(avatar) || avatar.length === 0) && (
					<Center>
						<Avatar
							radius="xl"
							size={"lg"}
							className="w-[100px] h-[100px] shadow-md rounded-full"
							src={
								!isEmpty(userInfo?.avatar)
									? MAN_BASE_URL_MAPPING[network] + userInfo?.avatar
									: null
							}
						>
							{(userInfo?.name ?? "").slice(0, 1)}
						</Avatar>
					</Center>
				)}

				{!isNil(avatar) && avatar.length !== 0 ? (
					<>
						<div className="bg-inheirt border border-dashed  border-[var(--mantine-primary-color-filled)] rounded-full w-[100px] h-[100px] grid place-items-center mx-auto">
							<img
								className="self-center rounded-full"
								height={100}
								width={100}
								src={filesPreview[0]}
								alt=""
							/>
						</div>
						<Button
							variant="light"
							onClick={() => {
								setFilesPreview([]);
								setValue("avatar", [] as any);
							}}
						>
							clear current uploads
						</Button>
					</>
				) : (
					<Button
						onClick={() => {
							document.getElementById("addPFP")!.click();
						}}
						variant="light"
					>
						{hasMetaid ? "Change Your Avatar" : "Upload Your Avatar"}
					</Button>
				)}

				<CustomFeerate
					customFee={customFee}
					setSelectFeeRate={setSelectFeeRate}
					selectFeeRate={selectFeeRate}
					handleCustomFeeChange={setCustomFee}
					feeRateOptions={feeRateOptions}
				/>
			</div>

			<Button variant="light" type="submit" className="mt-8">
				Submit
			</Button>
		</form>
	);
};

export default MetaidUserform;
