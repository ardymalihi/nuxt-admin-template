import { writeFile } from "fs/promises";
import fs from 'fs';
import path from 'path';

const PREFIX_PATH = "./assets/uploads/";

export default defineEventHandler(async (event) => {
    const formData: any = await readMultipartFormData(event);
    const file = formData.find((item: any) => item.name === "file");
    const folder = formData.find((item: any) => item.name === "folder");
    const filePath = `${PREFIX_PATH}${folder.data.toString()}/${file.filename}`;
    // Extract the directory path from the file path
    const directoryPath = path.dirname(filePath);
    // Create directories recursively if they don't exist
    directoryPath
        .split(path.sep)
        .reduce((currentPath, folder) => {
            currentPath += folder + path.sep;
            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
            }
            return currentPath;
        }, '');
    await writeFile(filePath, file.data);
    return {
        path: filePath.replace(PREFIX_PATH, "")
    }
});