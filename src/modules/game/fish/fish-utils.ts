import { DatabaseManager, IDatabaseManager } from "core";
import { Bait, Fish, FishData, FishLevel, FishingDB, FishingUser, Rod } from "./fish-data";
import { GOOFY_FISH, TRASH_FISH } from "./fishes";
import { NORMAL_ROD } from "./rods";
import { NORMAL_RIVER_FISHROOM } from "./rooms";
import { ADMIN_TAG } from "./tags";
import { DEFAULT_BAIT } from "./baits";

export namespace FishUtils {
	export let FISH_DATABASE: IDatabaseManager<FishingDB> | null = null;

	export function initDatabase(): IDatabaseManager<FishingDB> {
		if (!FISH_DATABASE)
			FISH_DATABASE = new DatabaseManager.classConstructor("/sdcard/botData/fish.json", JSON.parse, (data) => JSON.stringify(data, null, 4)) as unknown as IDatabaseManager<FishingDB>;
		FISH_DATABASE.load({
			fishes: [GOOFY_FISH, TRASH_FISH],
			levels: [],
			rods: [NORMAL_ROD],
			baits: [DEFAULT_BAIT],
			rooms: [NORMAL_RIVER_FISHROOM],
			tags: [ADMIN_TAG],
			users: []
		});

		return FISH_DATABASE;
	}

	export function getDefaultUserData(userName: string): FishingUser {
		return {
			id: "null",
			name: userName,
			fishes: [],
			rodIds: ["DEFAULT"],
			tagIds: [],
			baitIds: [],
			selectedRodId: "DEFAULT",
			selectedTagId: "",
			money: 10000,
			level: FishUtils.FISH_DATABASE.lastData.levels[0]!,
			currentLevel: 1,
			currentExp: 0,
			currentRoomId: "DEFAULT",
			currentBaitId: ""
		};
	}

	export function getRandomNumber(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	export function getFishLength(fish: FishData): number {
		return getRandomNumber(fish.minLength, fish.maxLength);
	}

	export function getFishPrice(length: number, price: number): number {
		return Math.floor(length * price) + getRandomNumber(-5, 5);
	}

	export function getFishExp(length: number, price: number, exp: number): number {
		return Math.floor(length * exp) + getRandomNumber(-5, 5) + price;
	}

	export function getRandomFish(usingRod: Rod, usingBait: Bait, fishes: FishData[]): Fish {
		const fishLevels: FishLevel[] = [
			...new Array(usingRod.percentage.normal + usingBait.percentage.normal).fill("NORMAL"),
			...new Array(usingRod.percentage.rare + usingBait.percentage.rare).fill("RARE"),
			...new Array(usingRod.percentage.epic + usingBait.percentage.epic).fill("EPIC"),
			...new Array(usingRod.percentage.legendary + usingBait.percentage.legendary).fill("LEGENDARY")
		];

		const fishLevel = fishLevels[Math.floor(Math.random() * fishLevels.length)] as FishLevel;
		const filteredFishes = fishes.filter((f) => f.level === fishLevel);
		const fish = filteredFishes[Math.floor(Math.random() * filteredFishes.length)];
		const fishLength = getFishLength(fish);

		return {
			...fish,
			length: fishLength,
			price: getFishPrice(fishLength, fish.price)
		};
	}

	export function sleep(seconds: number): Promise<void> {
		return new Promise((resolve) =>
			setTimeout(() => {
				resolve();
			}, seconds * 1000)
		);
	}
}
