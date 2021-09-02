//

const fs = require('fs');
const os = require('os');
const path = require('path');

//1.폴더이름 받아오기

const folder = process.argv[2];
const workingDir = path.join(os.homedir(), 'Pictures', process.argv[2]);
if (!folder || !fs.existsSync(workingDir)) {
	console.error('Please enter folder name in Pictures');
}

//2.폴더 생성하기s
const videoDir = path.join(workingDir, 'video');
const capturedDir = path.join(workingDir, 'captured');
const duplicatedDir = path.join(workingDir, 'duplicated');

!fs.existsSync(videoDir) && fs.mkdirSync(videoDir);
!fs.existsSync(capturedDir) && fs.mkdirSync(capturedDir);
!fs.existsSync(duplicatedDir) && fs.mkdirSync(duplicatedDir);

//3.파일 분류하기
fs.promises //
	.readdir(workingDir)
	.then(processFiles)
	.catch(console.log);

function processFiles(files) {
	files.forEach((file) => {
		if (isVideoFile(file)) {
			move(file, videoDir);
		} else if (isCapturedFile(file)) {
			move(file, capturedDir);
		} else if (isDuplicatedFile(files, file)) {
			move(file, duplicatedDir);
		}
	});
}

function isVideoFile(file) {
	const regExp = /(mp4|mov)$/gm;
	return regExp.test(file);
}

function isCapturedFile(file) {
	const regExp = /(png|aae)$/gm;
	return regExp.test(file);
}

function isDuplicatedFile(files, file) {
	if (!file.startsWith('IMG_') || file.startsWith('IMG_E')) {
		return false;
	}
	const edited = `IMG_E${file.split('_')[1]}`;
	const found = files.find((f) => f.includes(edited));
	return found;
}

function move(file, des) {
	const oldPath = path.join(workingDir, file);
	const newPath = path.join(des, file);
	fs.promises //
		.rename(oldPath, newPath)
		.catch(console.error);
}
