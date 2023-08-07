export enum FishLevel {
	NORMAL = 0,
	RARE = 1,
	EPIC = 2,
	LEGENDARY = 3
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
	requiredExp: number;
	requiredExpToNextLevel: number;
}

export interface FishingUser {
	id: string;
	name: string;

	fishes: Fish[];
	rodIds: string[];
	tagIds: FishTag[];

	selectedRodId: string;
	selectedTagId: string;

	level: FishingUserLevel;
	currentLevel: number;
	currentExp: number;
	currentRoomId: string;
}

export interface FishingDB {
	users: FishingUser[];
	fishes: FishData[];
	rods: Rod[];
	tags: FishTag[];
	levels: FishingUserLevel[];
	rooms: FishingRoom[];
}
