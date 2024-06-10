import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 export const logDirectory = path.join(__dirname, 'logs');


export function log(level, message) {
  const logMessage = `${new Date().toISOString()} [${level.toUpperCase()}] - ${message}\n`;
  const logFilePath = path.join(logDirectory, `${level.toLowerCase()}.log`);
  fs.appendFileSync(logFilePath, logMessage);
  console.log(logMessage);
}


