import { FishData, FishLevel } from "../fish-data";

export const COD_FISH: FishData = {
	id: "COD",
	name: "대구",
	description: "많은 사람들이 키워보는 물고기, 열대어이다.",
	length: -1,
	minLength: 50,
	maxLength: 120,
	level: FishLevel.NORMAL,
	price: 83,
	exp: 150
};
