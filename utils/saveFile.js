import fs from 'fs';

const saveFile = (file) => {
	const data = fs.readFileSync(file.filepath);
	fs.writeFileSync(`./public/storage/${file.originalFilename}`, data);
	fs.unlinkSync(file.filepath);
	return `storage/${file.originalFilename}`;
};

export default saveFile;