import { existsSync, readFileSync, writeFileSync } from "fs";
import { Server, WebSocket } from "ws";
import { PacketHandler, LoginPacketHandler, AddChannelPacketHandler, SendMessagePacketHandler } from "./handlers";

export * from "./handlers";

export interface EmulationUser {
	id: string;
	joinedChannelIds: string[];
	userName: string;
	profileImage: string;
}

export interface EmulationChat {
	senderId: string;
	message: string;
}

export interface EmulationChannel {
	id: string;
	name: string;
	chats: EmulationChat[];
	userIds: string[];
}

export interface EmulationDatabase {
	users: EmulationUser[];
	channels: EmulationChannel[];
}

export interface EmulationPacket<T = {}> {
	method: string;
	packetId: number;
	data: T;
}

export interface EmulationSession {
	socket: WebSocket;
	user: EmulationUser | null;
}

export class EmulationServer {
	private readonly _server: Server;
	private readonly _packetHandlerMap: Map<string, PacketHandler<any>> = new Map();
	private readonly _sessions: EmulationSession[] = [];
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

	public get packetHandlerMap(): Map<string, PacketHandler<any>> {
		return this._packetHandlerMap;
	}

	public get sessions(): { socket: WebSocket; user: EmulationUser | null }[] {
		return this._sessions;
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

	/* ADD, EDIT 기능을 동시에, 절대 귀찮아서는 아님.. */
	public editUser(user: EmulationUser): void {
		this._database.users = this._database.users.filter((e) => e.id !== user.id);
		this._database.users.push(user);
		this._save();
	}

	public addChat(chat: EmulationChat, channelId: string): void {
		const channel = this.findChannel(channelId);

		if (channel) {
			channel.chats.push(chat);
			this._save();
		}
	}

	public editChannel(channel: EmulationChannel): void {
		this._database.channels = this._database.channels.filter((e) => e.id !== channel.id);
		this._database.channels.push(channel);
		this._save();
	}

	private _start(): void {
		this._server.on("connection", (socket) => {
			this._sessions.push({
				socket,
				user: null
			});

			socket.on("message", (raw) => {
				const packet: EmulationPacket = JSON.parse(raw.toString());

				this._processPacket(socket, packet);
			});

			socket.on("close", () => {
				const session = this._sessions.find((e) => e.socket === socket);

				if (session) {
					this._sessions.splice(this._sessions.indexOf(session), 1);
				}
			});
		});

		this._packetHandlerMap.set(LoginPacketHandler.METHOD, new LoginPacketHandler(this));
		this._packetHandlerMap.set(AddChannelPacketHandler.METHOD, new AddChannelPacketHandler(this));
		this._packetHandlerMap.set(SendMessagePacketHandler.METHOD, new SendMessagePacketHandler(this));
	}

	public findUser(id: string): EmulationUser | null {
		return this._database.users.find((e) => e.id === id);
	}

	public findChannel(id: string): EmulationChannel | null {
		return this._database.channels.find((e) => e.id === id);
	}

	public sendRes(
		method: string,
		data: {
			status: string;
			[key: string]: any;
		},
		packetId: number,
		socket: WebSocket
	): void {
		socket.send(
			JSON.stringify(
				{
					method,
					packetId,
					data
				},
				null,
				4
			)
		);
	}

	public sendData(
		packet: EmulationPacket<any>,
		data: {
			status: string;
			[key: string]: any;
		},
		socket: WebSocket,
		packetId?: number
	): void {
		this.sendRes(packet.method, data, packetId || packet.packetId, socket);
	}

	private _processPacket(socket: WebSocket, data: EmulationPacket): void {
		const handler = this._packetHandlerMap.get(data.method);
		const session = this._sessions.find((e) => e.socket === socket);

		if (handler) {
			handler.handle(data, session);
		} else {
			console.log(`Unhandled packet: ${data.method}`);
			socket.send(
				JSON.stringify(
					{
						packetId: data.packetId,
						method: "ERROR",
						data: {
							status: "unknown_method"
						}
					},
					null,
					4
				)
			);
		}
	}
}
