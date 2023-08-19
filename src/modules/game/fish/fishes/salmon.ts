import { FishData, FishLevel } from "../fish-data";

export const SALMON_FISH: FishData = {
	id: "SALMON",
	name: "연어",
	description: "거꾸로 강을 거슬러 오르는 이 힘찬 연어처럼",
	length: -1,
	minLength: 50,
	maxLength: 150,
	level: FishLevel.RARE,
	price: 687.5,
	exp: 50
};
