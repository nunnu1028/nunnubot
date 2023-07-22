import { existsSync, readFileSync, writeFileSync } from "fs";
import { Server, WebSocket } from "ws";

export interface EmulationUser {
	id: string;
	joinedChannelIds: string[];
	userName: string;
	profileImagePath: string;
}

export interface EmulationChat {
	senderId: string;
	message: string;
}

export interface EmulationChannel {
	id: string;
	chats: EmulationChat[];
	users: EmulationUser[];
}

export interface EmulationDatabase {
	users: EmulationUser[];
	channels: EmulationChannel[];
}

export interface EmulationPacket<T = {}> {
	method: string;
	packetId: string;
	data: T;
}

export interface PEmulationLogin {
	userId: string;
	userName?: string;
	profileImagePath?: string;
}

export class EmulationServer {
	private readonly _server: Server;
	private _database: EmulationDatabase;

	constructor(private readonly _port: number = 12345, private readonly _databasePath: string = "./database.json") {
		this._server = new Server({ port: this._port });
		this._load();
		this._start();
	}

	public get port(): number {
		return this._port;
	}

	public get databasePath(): string {
		return this._databasePath;
	}

	public get database(): EmulationDatabase {
		return this._database;
	}

	public get server(): Server {
		return this._server;
	}

	private _load(): void {
		if (!existsSync(this._databasePath)) {
			writeFileSync(
				this._databasePath,
				JSON.stringify(
					{
						channels: [],
						users: []
					},
					null,
					4
				)
			);
		}

		this._database = JSON.parse(readFileSync(this._databasePath, "utf8"));
	}

	private _save(): void {
		writeFileSync(this._databasePath, JSON.stringify(this._database, null, 4));
	}

	private _start(): void {
		this._server.on("connection", (socket) => {
			socket.on("message", (raw) => {
				const packet: EmulationPacket = JSON.parse(raw.toString());

				this._processPacket(socket, packet);
			});
		});
	}

	private _findUser(id: string): EmulationUser | null {
		return this._database.users.find((e) => e.id === id);
	}

	private _findChannel(id: string): EmulationChannel | null {
		return this._database.channels.find((e) => e.id === id);
	}

	private _processPacket(socket: WebSocket, data: EmulationPacket): void {
		if (data.method === "LOGIN") {
			const packet = data as EmulationPacket<PEmulationLogin>;

			if (!this._findUser(packet.data.userId)) {
				this._database.users.push({
					id: packet.data.userId,
					joinedChannelIds: [],
					userName: packet.data.userName!,
					profileImagePath: packet.data.profileImagePath!
				});

				this._save();
				const user = this._findUser(packet.data.userId)!;
				socket.send(
					JSON.stringify({
						method: "LOGIN",
						packetId: data.packetId,
						data: {
							joinedChannels: user.joinedChannelIds.map((e) => this._findChannel(e)),
							profileImage: user.profileImagePath ? readFileSync(user.profileImagePath).toString("base64") : null,
							userName: user.userName
						}
					})
				);
			}
		}
	}
}
