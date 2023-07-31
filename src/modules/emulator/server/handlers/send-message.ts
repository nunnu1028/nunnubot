import { PacketHandler } from ".";
import { EmulationPacket, EmulationSession } from "..";

export interface PEmulationSendMsgQ {
	channelId: string;
	message: string;
}

export class SendMessagePacketHandler extends PacketHandler<PEmulationSendMsgQ> {
	public static readonly METHOD: string = "SENDMESSAGE";

	public async handle(packet: EmulationPacket<PEmulationSendMsgQ>, session: EmulationSession): Promise<void> {
		const channelInfo = this.server.findChannel(packet.data.channelId);
		if (!channelInfo) {
			return this.server.sendData(
				packet,
				{
					status: "unknown_channel"
				},
				session.socket
			);
		}

		if (!channelInfo.userIds.includes(session.user.id))
			return this.server.sendData(
				packet,
				{
					status: "unknown_channel"
				},
				session.socket
			);

		this.server.editChannel({
			...channelInfo,
			chats: [
				...channelInfo.chats,
				{
					senderId: session.user.id,
					message: packet.data.message
				}
			]
		});

		this.server.sendData(
			packet,
			{
				status: "success"
			},
			session.socket
		);

		const sessions = this.server.sessions.filter((e) => channelInfo.userIds.includes(e.user.id) && e.user.id !== session.user.id);
		sessions.forEach((e) => {
			this.server.sendRes(
				"MESSAGE",
				{
					status: "success"
				},
				-1,
				e.socket
			);
		});
	}
}
