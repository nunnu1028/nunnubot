import { Bait } from "../fish-data";

export const DEFAULT_BAIT: Bait = {
	id: "DEFAULT",
	name: "기본 미끼",
	description: "기본 미끼입니다.",
	price: -1,

	percentage: {
		normal: 0,
		epic: 0,
		rare: 0,
		legendary: 0
	},

	speedEffect: 0
};

export * from "./earthworm";
