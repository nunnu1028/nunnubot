import { PacketHandler } from ".";
import { EmulationPacket, EmulationSession } from "..";

export interface PEmulationLoginQ {
	id: string;
	userName?: string;
	profileImage?: string;
}

export class LoginPacketHandler extends PacketHandler<PEmulationLoginQ> {
	public static readonly METHOD: string = "LOGIN";

	public async handle(packet: EmulationPacket<PEmulationLoginQ>, session: EmulationSession): Promise<void> {
		if (!this.server.findUser(packet.data.id)) {
			this.server.editUser({
				id: packet.data.id,
				joinedChannelIds: ["global"],
				userName: packet.data.userName,
				profileImage: packet.data.profileImage
			});

			if (!this.server.findChannel("global")) {
				this.server.editChannel({
					id: "global",
					name: "global",
					chats: [],
					userIds: []
				});
			}

			const channel = this.server.findChannel("global");
			this.server.editChannel({
				...channel,
				userIds: [...channel.userIds, packet.data.id]
			});
		}

		const userInfo = this.server.findUser(packet.data.id);

		this.server.sendData(
			packet,
			{
				status: "success",
				userName: userInfo.userName,
				joinedChannelIds: userInfo.joinedChannelIds,
				profileImage: userInfo.profileImage
			},
			session.socket
		);

		session.user = userInfo;
	}
}
