import { DatabaseManager } from "core";

export type StaticImplements<I extends new (...args: unknown[]) => unknown> = InstanceType<I>;

export interface GameDatabaseInstance<T = unknown> {
	dataBase: DatabaseManager<T>;
	dataBasePath: string;
	load(): void;
}

export interface GameDatabaseStatic {
	new (dataBasePath: string): GameDatabaseInstance;
	getInstance(): GameDatabaseInstance;
}

export * from "./user";
