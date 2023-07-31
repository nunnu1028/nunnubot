import { PacketHandler } from ".";
import { EmulationPacket, EmulationSession } from "..";

export interface PEmulationAddChannelQ {
	id: string;
	name: string;
	userIds: string[];
}

export class AddChannelPacketHandler extends PacketHandler<PEmulationAddChannelQ> {
	public static readonly METHOD: string = "ADDCHANNEL";

	public async handle(packet: EmulationPacket<PEmulationAddChannelQ>, session: EmulationSession): Promise<void> {
		if (this.server.findChannel(packet.data.id))
			return this.server.sendData(
				packet,
				{
					status: "already_exists"
				},
				session.socket
			);

		this.server.editChannel({
			id: packet.data.id,
			name: packet.data.name,
			chats: [],
			userIds: packet.data.userIds
		});

		this.server.sendData(
			packet,
			{
				status: "success"
			},
			session.socket
		);

		const sessions = this.server.sessions.filter((e) => packet.data.userIds.includes(e.user.id));
		sessions.forEach((e) => {
			if (e.user.id === session.user.id) {
				this.server.editUser({
					...e.user,
					joinedChannelIds: [...e.user.joinedChannelIds, packet.data.id]
				});
			}

			this.server.sendRes(
				"CHANNEL",
				{
					status: "success",
					id: packet.data.id
				},
				-1,
				e.socket
			);
		});
	}
}
