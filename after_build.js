const fs = require("fs");
const botName = "bot";

const runOSCommand = (command) => {
	const { execSync } = require("child_process");
	execSync(command, { stdio: "inherit" });
};

function afterBuild() {
	const indexFileData = fs.readFileSync("./dist/index.js", "utf8");
	const editedFileData = indexFileData.replace(`Object.defineProperty(exports, "__esModule", { value: true });\r\n`, "");
	fs.writeFileSync("./dist/index.js", editedFileData, "utf8");

	runOSCommand(`adb push ./dist/index.js /sdcard/msgbot/Bots/${botName}/index.js`);
<<<<<<< HEAD
	runOSCommand(`adb push ./dist/modules /sdcard/msgbot/Bots/${botName}/`);
=======
	runOSCommand(`adb push ./dist/modules /sdcard/msgbot/Bots/${botName}/modules`);
>>>>>>> d7a1ed1f858e6ed09510b2521bf3599f98f639c6

	const compiledCount = JSON.parse(fs.readFileSync("./src/data/compiledCount.json", "utf8"));
	fs.writeFileSync("./src/data/compiledCount.json", JSON.stringify({ count: compiledCount.count + 1 }), "utf8");
	runOSCommand(`adb push ./src/data /sdcard/msgbot/Bots/${botName}/`);

	console.log("after build finished.");
}

afterBuild();
