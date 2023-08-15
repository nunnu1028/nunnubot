import { DatabaseManager, IDatabaseManager } from "core";
import { Bait, FishData, FishLevel, FishingDB, FishingRoom, FishingUser, FishingUserLevel, Rod } from "./fish-data";
import { GOOFY_FISH, MACKEREL_FISH, SACABAMBASPIS_FISH, SALMON_FISH, STURGEON_FISH, TRASH_FISH } from "./fishes";
import { ADMIN_ROD, NOOB_ROD, NORMAL_ROD } from "./rods";
import { HAN_RIVER_FISHROOM, NORMAL_RIVER_FISHROOM } from "./rooms";
import { ADMIN_TAG, GANGTAEGONG_TAG } from "./tags";
import { DEFAULT_BAIT, EARTHWORM_BAIT } from "./baits";
import { NOOB_LEVEL, NORMAL_LEVEL } from "./levels";

export namespace FishUtils {
	export let FISH_DATABASE: IDatabaseManager<FishingDB> | null = null;
	export const FISHES = [GOOFY_FISH, TRASH_FISH, MACKEREL_FISH, SACABAMBASPIS_FISH, STURGEON_FISH, SALMON_FISH];
	export const LEVELS: FishingUserLevel[] = [NORMAL_LEVEL, NOOB_LEVEL];
	export const RODS = [NORMAL_ROD, ADMIN_ROD, NOOB_ROD];
	export const BAITS = [DEFAULT_BAIT, EARTHWORM_BAIT];
	export const ROOMS = [NORMAL_RIVER_FISHROOM, HAN_RIVER_FISHROOM];
	export const TAGS = [ADMIN_TAG, GANGTAEGONG_TAG];

	export function checkMissingData(): void {
		const MISSING_FISHES = FISHES.filter((fish) => !FISH_DATABASE!.lastData.fishes.find((f) => f.id === fish.id));
		const MISSING_LEVELS = LEVELS.filter((level) => !FISH_DATABASE!.lastData.levels.find((l) => l.name === level.name));
		const MISSING_RODS = RODS.filter((rod) => !FISH_DATABASE!.lastData.rods.find((r) => r.id === rod.id));
		const MISSING_BAITS = BAITS.filter((bait) => !FISH_DATABASE!.lastData.baits.find((b) => b.id === bait.id));
		const MISSING_ROOMS = ROOMS.filter((room) => !FISH_DATABASE!.lastData.rooms.find((r) => r.id === room.id));
		const MISSING_TAGS = TAGS.filter((tag) => !FISH_DATABASE!.lastData.tags.find((t) => t.id === tag.id));

		FISH_DATABASE.lastData.fishes.push(...MISSING_FISHES);
		FISH_DATABASE.lastData.levels.push(...MISSING_LEVELS);
		FISH_DATABASE.lastData.rods.push(...MISSING_RODS);
		FISH_DATABASE.lastData.baits.push(...MISSING_BAITS);
		FISH_DATABASE.lastData.rooms.push(...MISSING_ROOMS);
		FISH_DATABASE.lastData.tags.push(...MISSING_TAGS);

		FISH_DATABASE.save(FISH_DATABASE.lastData);
	}

	export function checkWrongData(): void {
		for (const fish of FISH_DATABASE.lastData.fishes) {
			if (JSON.stringify(fish) !== JSON.stringify(FISHES.find((e) => e.id == fish.id)))
				FISH_DATABASE.lastData.fishes[FISH_DATABASE.lastData.fishes.indexOf(fish)] = FISHES.find((e) => e.id == fish.id)!;
		}

		for (const level of FISH_DATABASE.lastData.levels) {
			if (JSON.stringify(level) !== JSON.stringify(LEVELS.find((e) => e.name == level.name)))
				FISH_DATABASE.lastData.levels[FISH_DATABASE.lastData.levels.indexOf(level)] = LEVELS.find((e) => e.name == level.name)!;
		}

		for (const rod of FISH_DATABASE.lastData.rods) {
			if (JSON.stringify(rod) !== JSON.stringify(RODS.find((e) => e.id == rod.id))) FISH_DATABASE.lastData.rods[FISH_DATABASE.lastData.rods.indexOf(rod)] = RODS.find((e) => e.id == rod.id)!;
		}

		for (const bait of FISH_DATABASE.lastData.baits) {
			if (JSON.stringify(bait) !== JSON.stringify(BAITS.find((e) => e.id == bait.id)))
				FISH_DATABASE.lastData.baits[FISH_DATABASE.lastData.baits.indexOf(bait)] = BAITS.find((e) => e.id == bait.id)!;
		}

		for (const room of FISH_DATABASE.lastData.rooms) {
			if (JSON.stringify(room) !== JSON.stringify(ROOMS.find((e) => e.id == room.id)))
				FISH_DATABASE.lastData.rooms[FISH_DATABASE.lastData.rooms.indexOf(room)] = ROOMS.find((e) => e.id == room.id)!;
		}

		for (const tag of FISH_DATABASE.lastData.tags) {
			if (JSON.stringify(tag) !== JSON.stringify(TAGS.find((e) => e.id == tag.id))) FISH_DATABASE.lastData.tags[FISH_DATABASE.lastData.tags.indexOf(tag)] = TAGS.find((e) => e.id == tag.id)!;
		}

		FISH_DATABASE.save(FISH_DATABASE.lastData);
	}

	export function initDatabase(): IDatabaseManager<FishingDB> {
		if (!FISH_DATABASE)
			FISH_DATABASE = new DatabaseManager.classConstructor("/sdcard/botData/fish.json", JSON.parse, (data) => JSON.stringify(data, null, 4)) as unknown as IDatabaseManager<FishingDB>;
		FISH_DATABASE.load({
			fishes: FISHES,
			levels: LEVELS,
			rods: RODS,
			baits: BAITS,
			rooms: ROOMS,
			tags: TAGS,
			users: []
		});

		checkMissingData();
		checkWrongData();

		return FISH_DATABASE;
	}

	export function getDefaultUserData(userName: string): FishingUser {
		return {
			id: "",
			name: userName,

			fishes: [],
			rods: [NORMAL_ROD],
			tags: [],
			baits: [DEFAULT_BAIT],
			caughtFishIds: [],

			selectedRodIndex: 0,
			selectedTagIndex: -1,
			selectedBaitIndex: 0,
			currentRoomId: "DEFAULT",

			money: 10000,

			level: FishUtils.FISH_DATABASE.lastData.levels[0]!,
			currentLevel: 1,
			currentExp: 0,
			currentLevelExp: 0
		};
	}

	export function getUserName(user: FishingUser): string {
		const tag = user.tags[user.selectedTagIndex];
		return `${user.name}${tag ? ` [${tag.name}]` : ""}`;
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

	export function getFishExp(length: number, price: number, exp: number, fishExp: number): number {
		return Math.floor(length * (exp + fishExp)) + getRandomNumber(-5, 5) + Math.floor(price / 4);
	}

	export function getRandomFish(room: FishingRoom, usingRod: Rod, usingBait: Bait, fishes: FishData[]): FishData {
		const fishLevels: FishLevel[] = [
			...new Array(usingRod.percentage.normal + usingBait.percentage.normal).fill("NORMAL"),
			...new Array(usingRod.percentage.rare + usingBait.percentage.rare).fill("RARE"),
			...new Array(usingRod.percentage.epic + usingBait.percentage.epic).fill("EPIC"),
			...new Array(usingRod.percentage.legendary + usingBait.percentage.legendary).fill("LEGENDARY")
		];

		let fishLevel = fishLevels[Math.floor(Math.random() * fishLevels.length)] as FishLevel;
		if (!room.fishIds.some((e) => FishUtils.FISH_DATABASE.lastData.fishes.find((k) => k.id === e).level === fishLevel)) fishLevel = FishLevel.NORMAL;

		const filteredFishes = fishes.filter((f) => room.fishIds.includes(f.id) && f.level === fishLevel);
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
