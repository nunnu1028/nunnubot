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
		const file = new java.io.File(this._filePath);
		if (!file.exists()) return null;

		const fis = new java.io.FileInputStream(file);
		const ois = new java.io.ObjectInputStream(fis);
		const data = ois.readObject();
		ois.close();
		fis.close();

		this._lastData = this._serializer(data);
		return this._lastData;
	}

	public save(data: T): void {
		const file = new java.io.File(this._filePath);
		if (!file.exists()) file.createNewFile();

		const fos = new java.io.FileOutputStream(file);
		const oos = new java.io.ObjectOutputStream(fos);
		oos.writeObject(this._deserializer(data));
		oos.close();
		fos.close();

		this._lastData = data;
		return;
	}
}
