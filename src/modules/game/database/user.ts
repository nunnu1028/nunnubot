import { DatabaseManager } from "core";
import { GameDatabaseStatic, StaticImplements } from "game";

export interface User {
	id: string;
	name: string;
	chatHistory: string[];
}

export class UserDatabase implements StaticImplements<GameDatabaseStatic> {
	private _dataBase: DatabaseManager<User[]>;
	private static _instance: UserDatabase;

	constructor(private readonly _dataBasePath: string) {
		this._dataBase = new DatabaseManager(this._dataBasePath, JSON.parse, JSON.stringify);
	}

	public static getInstance(): UserDatabase {
		if (!this._instance) {
			this._instance = new UserDatabase("/sdcard/botData/user.json");
			this._instance.load();
		}

		return this._instance;
	}

	public get dataBase(): DatabaseManager<User[]> {
		return this._dataBase;
	}

	public get dataBasePath(): string {
		return this._dataBasePath;
	}

	public load(): void {
		this._dataBase.load([]);
	}

	public registerUser(user: User): void {
		this._dataBase.save([...this._dataBase.lastData, user]);
	}

	public getUser(id: string): User | undefined {
		return this._dataBase.lastData.find((user) => user.id === id);
	}

	public getUserByName(name: string): User | undefined {
		return this._dataBase.lastData.find((user) => user.name === name);
	}
}
