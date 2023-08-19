import { Rod } from "../fish-data";

export const REINFORCED_ROD: Rod = {
	id: "REINFORCED",
	name: "보강된 낚싯대",
	description: "철/납 주괴 8개로 만들어진다.",
	percentage: {
		normal: 85,
		rare: 8,
		epic: 7,
		legendary: 0
	},
	usedCount: 0,
	maxCount: 150,
	price: 500000,
	speedBetween: [7, 50],
	exp: 15
};
