import { FishData, FishLevel } from "../fish-data";

export const TRASH_FISH: FishData = {
	id: "TRASH",
	name: "쓰레기",
	description: "환경 오염의 주범. 쓰레기를 버리지 말자.",
	length: -1,
	minLength: 1,
	maxLength: 3,
	level: FishLevel.NORMAL,
	price: 5,
	exp: 10
};
