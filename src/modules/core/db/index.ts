export class DatabaseManager<T = string> {
	private _lastData: T | null = null;

	constructor(
		private readonly _filePath: string,
		private readonly _serializer: (data: any) => T = (data: any) => {
			return data as T;
		},
		private readonly _deserializer: (data: T) => any = (data: T) => {
			return data;
		}
	) {}

	public get lastData(): T | null {
		return this._lastData;
	}

	public load(): T | null {
		const data = FileStream.read(this._filePath);
		this._lastData = this._serializer(data);
		return this._lastData;
	}

	public save(data: T): void {
		FileStream.write(this._filePath, this._deserializer(data));
		this._lastData = data;
		return;
	}
}
