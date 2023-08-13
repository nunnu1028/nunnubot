import { FishData, FishLevel } from "../fish-data";

export const MACKEREL_FISH: FishData = {
	id: "MACKEREL",
	name: "고등어",
	description: "많은 사람들이 키워보는 물고기, 열대어이다.",
	length: -1,
	minLength: 15,
	maxLength: 45,
	level: FishLevel.NORMAL,
	price: 233,
	exp: 20
};
