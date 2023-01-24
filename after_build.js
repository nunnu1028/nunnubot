const fs = require("fs");
const botName = "bot";

const moduleCheckerSrc = `
var NUNNUMODULE = require("nunnu-module");
/* @ts-ignore */
function requireInit() {
	var o_require = require;
	require = function(moduleName) {
		if (moduleName !== "nunnu-module" && new java.io.File(NUNNUMODULE.BOT_FOLDER_PATH + "/modules/" + moduleName).exists()) return o_require(moduleName);
	
		NUNNUMODULE.moduleInstall(moduleName);
	
		return o_require(moduleName);
	}
}

requireInit();
`;

const indexFileData = fs.readFileSync("./dist/index.js", "utf8");
const editedFileData = indexFileData.replace(`Object.defineProperty(exports, "__esModule", { value: true });\r\n`, moduleCheckerSrc);

fs.writeFileSync("./dist/index.js", editedFileData, "utf8");

const runOSCommand = (command) => {
	const { execSync } = require("child_process");
	execSync(command, { stdio: "inherit" });
};

runOSCommand(`adb push ./dist/index.js /sdcard/msgbot/Bots/${botName}/index.js`);
runOSCommand(`adb push ./dist/modules/nunnu-module /sdcard/msgbot/Bots/${botName}/modules/`);
runOSCommand(`adb push ./src/modules/moduleInfo.json /sdcard/msgbot/Bots/${botName}/modules/`);

const compiledCount = JSON.parse(fs.readFileSync("./src/data/compiledCount.json", "utf8"));
fs.writeFileSync("./src/data/compiledCount.json", JSON.stringify({ count: compiledCount.count + 1 }), "utf8");

runOSCommand(`adb push ./src/data /sdcard/msgbot/Bots/${botName}/`);

console.log("after build finished.");
