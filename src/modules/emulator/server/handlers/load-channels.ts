import { PacketHandler } from ".";
import { EmulationPacket, EmulationSession } from "..";

export interface PEmulationLoadChannelsQ {
	ids: string[];
}

export class LoadChannelsPacketHandler extends PacketHandler<PEmulationLoadChannelsQ> {
	public static readonly METHOD: string = "LOADCHANNELS";

	public async handle(packet: EmulationPacket<PEmulationLoadChannelsQ>, session: EmulationSession): Promise<void> {
		const channels = packet.data.ids.map((e) => this.server.findChannel(e)).filter((e) => e !== undefined);

		this.server.sendData(
			packet,
			{
				status: "success",
				channels: channels.map((e) => ({
					...e,
					users: e.userIds.map((e) => this.server.findUser(e).userName)
				}))
			},
			session.socket
		);
	}
}
