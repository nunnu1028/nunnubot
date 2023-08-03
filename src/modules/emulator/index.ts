export * from "./server";

import { DatabaseManager, WebClient } from "core";
import { EWebClient } from "./eweb-client";
import { EDatabaseManager } from "./edatabase";
import { EmulationServer } from "./server";
import WebSocket from "ws";
import { createHash } from "crypto";
import { exec } from "child_process";

export function supportEmulatorMode(): void {
	WebClient.classConstructor = EWebClient;
	DatabaseManager.classConstructor = EDatabaseManager;
}

export function startEmulatorMode(
	listeningFunction: (room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string, chatId?: string, hashedUserId?: string) => void
): void {
	const server = new EmulationServer();

	console.log("Emulation Server started, port 12345");

	const ws = new WebSocket("ws://localhost:12345");
	ws.onopen = () => {
		ws.send(
			JSON.stringify({
				method: "LOGIN",
				data: {
					id: "BOT_",
					userName: "nunnuBot"
				},
				packetId: 1
			})
		);
	};

	ws.onmessage = (e) => {
		const data = JSON.parse(e.data.toString());
		if (data.method === "MESSAGE") {
			listeningFunction(
				data.data.channelName,
				data.data.message,
				data.data.userName,
				true,
				{
					reply: (message: string | number) => {
						ws.send(
							JSON.stringify({
								method: "SENDMESSAGE",
								data: {
									channelId: data.data.channelId,
									message: message.toString()
								},
								packetId: Math.floor(Math.random() * 10)
							})
						);
					}
				},
				{
					getProfileBase64: () => {
						return data.data.profileImage;
					}
				},
				"com.kakao.talk",
				data.data.channelId,
				createHash("sha512").update(data.data.userId).digest("hex").substring(0, 16)
			);
		}
	};

	exec("start ./src/modules/emulator/client/web.html", {
		cwd: process.cwd()
	});
}
