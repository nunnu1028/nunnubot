import { DatabaseManager, IDatabaseManager } from "core";

export * from "./fish";
export * from "./p2p";
export * from "./mafia";

export interface GameDatabase {
    userNameDict: {
        [chatId: string]: string;
    }
}

let GAME_DATABASE: IDatabaseManager<GameDatabase> | null = null;

export const getGameDatabase = () => {
    if (!GAME_DATABASE) {
        GAME_DATABASE = new DatabaseManager.classConstructor("/sdcard/botData/game.json", JSON.parse, (data) => JSON.stringify(data, null, 4)) as unknown as IDatabaseManager<GameDatabase>;
        GAME_DATABASE.load({ userNameDict: {} });
    }

    return GAME_DATABASE;
}