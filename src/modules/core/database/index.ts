export class DatabaseManager<T = string> {
	private _lastData: T | null = null;

	constructor(
		private readonly _filePath: string,
		private readonly _serializer: (data: unknown) => T = (data: unknown) => {
			return data as T;
		},
		private readonly _deserializer: (data: T) => unknown = (data: T) => {
			return data;
		}
	) {}

	public get lastData(): T | null {
		return this._lastData;
	}

	private _createFile(): void {
		const dir = new java.io.File(this._filePath).getParentFile();
		if (!dir.exists()) dir.mkdirs();
		const file = new java.io.File(this._filePath);
		if (!file.exists()) file.createNewFile();
	}

	public load(defaultData: T): T | null {
		if (!new java.io.File(this._filePath).exists()) {
			this._createFile();
			this.save(defaultData);
			return defaultData;
		}

		const data = FileStream.read(this._filePath);
		this._lastData = this._serializer(data);
		return this._lastData;
	}

	public save(data: T): void {
		FileStream.write(this._filePath, this._deserializer(data) as string);
		this._lastData = data;
		return;
	}
}
