import { P2PManager } from ".";

export enum P2PGameType {
    MAFIA = "mafia"
}

export const P2PGameData: {
    [gameType in P2PGameType]: {
        minPlayerCount: number;
        maxPlayerCount: number;
    }
} = {
    mafia: {
        minPlayerCount: 5,
        maxPlayerCount: 10
    }
}

export interface P2PGameInfo {
    name: string;
    ownerChatId: string;
    playerChatIds: string[];
    playerNameDict: {
        [chatId: string]: string;
    };
    
    gameType: P2PGameType;
    maxPlayerCount: number;
    minPlayerCount: number;
    isStarted: boolean;
    p2pManager: P2PManager;
}

export class P2PGameManager {
    constructor(private readonly _gameInfos: P2PGameInfo[] = []) {}

    public get gameInfos(): P2PGameInfo[] {
        return this._gameInfos;
    }

    public getGameInfo(name: string): P2PGameInfo | undefined {
        return this._gameInfos.find((e) => e.name === name);
    }

    public createGame(info: P2PGameInfo): void {
        this._gameInfos.push(info);
    }

    public removeGame(name: string): void {
        this._gameInfos.splice(this._gameInfos.findIndex((e) => e.name === name), 1);
    }

    public addPlayer(name: string, chatId: string, playerName: string): boolean {
        const gameInfo = this.getGameInfo(name);
        if (!gameInfo) return false;
        gameInfo.playerChatIds.push(chatId);
        gameInfo.playerNameDict[chatId] = playerName;
        return true;
    }

    public removePlayer(name: string, chatId: string): boolean {
        const gameInfo = this.getGameInfo(name);
        if (!gameInfo) return false;
        gameInfo.playerChatIds.splice(gameInfo.playerChatIds.indexOf(chatId), 1);
        delete gameInfo.playerNameDict[chatId];
        return true;
    }

    public startGame(name: string): boolean {
        const gameInfo = this.getGameInfo(name);
        if (!gameInfo) return false;
        gameInfo.isStarted = true;
        return true;
    }
}