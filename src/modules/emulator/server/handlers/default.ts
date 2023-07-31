import { WebSocket } from "ws";
import { EmulationPacket, EmulationServer, EmulationSession } from "..";

export class PacketHandler<Q> {
	public static readonly METHOD: string = "unknown";
	constructor(private readonly _server: EmulationServer) {}

	public get server(): EmulationServer {
		return this._server;
	}

	public async handle(packet: EmulationPacket<Q>, session: EmulationSession): Promise<void> {
		throw new Error("Not implemented");
	}
}
