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
				joinedChannelIds: [],
				userName: packet.data.userName,
				profileImage: packet.data.profileImage
			});
		}

		const userInfo = this.server.findUser(packet.data.id);

		this.server.sendData(
			packet,
			{
				status: "success",
				userName: userInfo.userName,
				profileImage: userInfo.profileImage
			},
			session.socket
		);

		session.user = userInfo;
	}
}
