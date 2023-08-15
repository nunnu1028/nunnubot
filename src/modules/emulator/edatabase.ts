import { IDatabaseManager } from "core";
import { existsSync, readFileSync, writeFileSync } from "fs";

export class EDatabaseManager<T = string> implements IDatabaseManager<T> {
	private _lastData: T | null = null;
	private _lastDataString: string | null = null;

	constructor(
		private readonly _filePath: string,
		private readonly _serializer: (data: unknown) => T = (data: unknown) => {
			return data as T;
		},
		private readonly _deserializer: (data: T) => string = (data: T) => {
			return data as string;
		}
	) {
		this._filePath = _filePath.replace("/sdcard/botData/", "./");
	}

	public get lastData(): T {
		return this._lastData;
	}

	public load(defaultData: T): T {
		if (!existsSync(this._filePath)) {
			writeFileSync(this._filePath, this._deserializer(defaultData));
		}

		this._lastData = this._serializer(readFileSync(this._filePath, "utf8"));

		setInterval(() => {
			if (this._lastDataString !== this._deserializer(this._lastData)) {
				this.save(this._lastData!);

				this._lastDataString = this._deserializer(this._lastData);
			}
		}, 1);

		return this._lastData;
	}

	public save(data: T): void {
		writeFileSync(this._filePath, this._deserializer(data));
		this._lastData = data;
	}
}
