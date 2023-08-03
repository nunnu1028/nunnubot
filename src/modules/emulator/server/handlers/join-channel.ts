import { PacketHandler } from ".";
import { EmulationPacket, EmulationSession } from "..";

export interface PEmulationJoinChannelQ {
	id: string;
}

export class JoinChannelPacketHandler extends PacketHandler<PEmulationJoinChannelQ> {
	public static readonly METHOD: string = "JOINCHANNEL";

	public async handle(packet: EmulationPacket<PEmulationJoinChannelQ>, session: EmulationSession): Promise<void> {
		if (!this.server.findChannel(packet.data.id))
			return this.server.sendData(
				packet,
				{
					status: "not_found"
				},
				session.socket
			);

		this.server.editUser({
			...session.user,
			joinedChannelIds: [...session.user.joinedChannelIds, packet.data.id]
		});

		this.server.sendData(
			packet,
			{
				status: "success"
			},
			session.socket
		);

		const sessions = this.server.sessions.filter((e) => this.server.findChannel(packet.data.id)?.userIds.includes(e.user.id));
		sessions.forEach((e) => {
			this.server.sendRes(
				"JOINEDCHANNEL",
				{
					status: "success",
					user: session.user
				},
				-1,
				e.socket
			);
		});
	}
}
