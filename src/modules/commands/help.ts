import { CheckLevelRes, Command, CommandManager, MessageInfo } from "core";

export class HelpCommand implements Command {
	public get name(): string {
		return "help";
	}

	public get description(): string {
		return "도와줘요!";
	}

	public get usage(): string {
		return "";
	}

	public check_level(info: MessageInfo): CheckLevelRes {
		return { permission: true };
	}

	public execute(info: MessageInfo, manager: CommandManager): void {
		const commands = manager.commands.filter((e) => !e.name.startsWith("_") && !e.name.startsWith("*"));
		const texts = [`[ 눈누봇 도움말 ]${"\u200b".repeat(500)}\n`];

		for (const command of commands) {
			if (texts.includes(`${command.name} - ${command.description} ${command.alias && command.alias.length > 0 ? `(${command.alias.join(", ")})` : ""}`)) continue;

			texts.push(`${command.name} - ${command.description} ${command.alias && command.alias.length > 0 ? `(${command.alias.join(", ")})` : ""}`);
			texts.push(`    사용법 - ${command.name} ${command.usage}\n`);
		}

		info.replier.reply(texts.join("\n").trim());
	}
}
