export enum FishLevel {
	NORMAL = "NORMAL",
	RARE = "RARE",
	EPIC = "EPIC",
	LEGENDARY = "LEGENDARY"
}

export interface Fish {
	id: string;
	name: string;
	description: string;

	level: FishLevel;
	length: number;
	price: number;
}

export interface FishData extends Fish {
	minLength: number;
	maxLength: number;
	exp: number;
}

export interface Rod {
	id: string;
	name: string;
	description: string;

	percentage: {
		normal: number;
		rare: number;
		epic: number;
		legendary: number;
	};

	speedBetween: [number, number];
	exp: number;
	price: number;
}

export interface FishingRoom {
	id: string;
	name: string;

	requiredLevel: number;
	fishIds: string[];
}

export interface FishTag {
	id: string;
	name: string;
	description: string;

	price: number;
}

export interface FishingUserLevel {
	name: string;
	levelBetween: [number, number];
	requiredExpToNextLevel: number;
}

export interface FishingUser {
	id: string;
	name: string;

	fishes: Fish[];
	rodIds: string[];
	tagIds: string[];
	baitIds: string[];

	selectedRodId: string;
	selectedTagId: string;

	money: number;

	level: FishingUserLevel;
	currentLevel: number;
	currentExp: number;
	currentRoomId: string;
	currentBaitId: string;
}

export interface Bait {
	id: string;
	name: string;
	price: number;

	percentage: {
		normal: number;
		rare: number;
		epic: number;
		legendary: number;
	};

	speedEffect: number;
}

export interface FishingDB {
	users: FishingUser[];
	fishes: FishData[];
	rods: Rod[];
	tags: FishTag[];
	baits: Bait[];
	levels: FishingUserLevel[];
	rooms: FishingRoom[];
}
