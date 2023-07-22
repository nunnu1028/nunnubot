export * from "./server";

import { DatabaseManager, WebClient } from "core";
import { EWebClient } from "./eweb-client";
import { EDatabaseManager } from "./edatabase";
import { EmulationServer } from "./server";

export function supportEmulatorMode(): void {
	WebClient.classConstructor = EWebClient;
	DatabaseManager.classConstructor = EDatabaseManager;
}

export function startEmulatorMode(
	listeningFunction: (room: string, message: string, sender: string, isGroupChat: boolean, replier: Replier, imageDB: ImageDB, packageName: string, chatId?: string, hashedUserId?: string) => void
): void {
	const server = new EmulationServer();

	console.log("Emulation Server started, port 12345");
}
