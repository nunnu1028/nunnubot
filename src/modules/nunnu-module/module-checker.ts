import { DatabaseManager, WebClient } from "nunnu-module";
const BOT_FOLDER_PATH = "./sdcard/msgbot/Bots/bot";
const moduleInfos: ModuleInfo[] = new DatabaseManager(BOT_FOLDER_PATH + "/modules/moduleInfo.json", JSON.parse, JSON.stringify).load();

export interface ModuleInfo {
	moduleName: string;
	moduleAuthor: string;
	moduleCommit: string;
}

export function fileDownload(src: string, path: string): void {
	const url = new java.net.URL(src);
	const urlConn = url.openConnection();

	urlConn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36");
	urlConn.setRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");

	const raw = urlConn.getInputStream();
	const buffer = new java.io.BufferedInputStream(raw);
	const file = new java.io.File(path);
	const fos = new java.io.FileOutputStream(file);
	const buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);

	let count = 0;

	while ((count = buffer.read(buf)) !== -1) {
		fos.write(buf, 0, count);
	}

	fos.close();
}

export function unzip(path: string, dest: string): void {
	const zip = new java.util.zip.ZipFile(path);
	const entries = zip.entries();

	while (entries.hasMoreElements()) {
		const entry = entries.nextElement();
		const entryPath = dest + "/" + entry.getName();
		if (entry.isDirectory()) {
			new java.io.File(entryPath).mkdirs();
		} else {
			const is = zip.getInputStream(entry);
			const fos = new java.io.FileOutputStream(entryPath);
			const buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);

			let count = 0;

			while ((count = is.read(buf)) !== -1) {
				fos.write(buf, 0, count);
			}

			fos.close();
			is.close();
		}
	}
}

export function moveFolder(src: string, dest: string): void {
	const srcFolder = new java.io.File(src);
	const destFolder = new java.io.File(dest);

	if (!srcFolder.exists()) return;
	if (!destFolder.exists()) destFolder.mkdirs();

	const files = srcFolder.listFiles();

	for (let i = 0; i < files.length; i++) {
		if (files[i].isDirectory()) {
			moveFolder(files[i].getAbsolutePath(), dest + "/" + files[i].getName());
			files[i].delete();
		} else {
			const srcFile = new java.io.File(files[i].getAbsolutePath());
			const destFile = new java.io.File(dest + "/" + files[i].getName());

			srcFile.renameTo(destFile);
		}
	}
}

export function moduleInstall(moduleName: string) {
	const moduleInfo = moduleInfos.find((e) => e.moduleName === moduleName);
	const modulePath = BOT_FOLDER_PATH + "/modules/" + moduleName;

	if (!moduleInfo) return;

	fileDownload("https://github.com/" + moduleInfo.moduleAuthor + "/" + moduleInfo.moduleName + "/archive/" + moduleInfo.moduleCommit + ".zip", modulePath + ".zip");
	unzip(modulePath + ".zip", modulePath + "-dummy");

	new java.io.File(modulePath + ".zip").delete();

	moveFolder(modulePath + "-dummy/" + moduleInfo.moduleName + "-" + moduleInfo.moduleCommit, modulePath);
}
