import express from 'express';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import { config } from 'dotenv';
import { readFileAndUpload } from './src/uploader.js';
import { log, logDirectory } from "./src/loggs.js";
import { connectDb } from './src/configs/database.js';
config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000;
const uri = process.env.SERVER_URI;
connectDb(uri);





if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, '/src/logs/access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));


app.get('/', (req, res) => {
  const level = req.query.level ? req.query.level.toUpperCase() : 'INFO';
  const logFilePath = path.join(__dirname, `/src/logs/${level.toLowerCase()}.log`);
  let filteredLogs = [];

  if (fs.existsSync(logFilePath)) {
    const logFile = fs.readFileSync(logFilePath, 'utf-8');
    filteredLogs = logFile.split('\n').filter(log => log.includes(level));
  }

  res.send(`
    <h1>Log Dashboard</h1>
    <form method="get" style="margin-bottom: 20px;">
      <label for="level">Log Level:</label>
      <select id="level" name="level" onchange="this.form.submit()">
        <option value="INFO" ${level === 'INFO' ? 'selected' : ''}>INFO</option>
        <option value="WARN" ${level === 'WARN' ? 'selected' : ''}>WARN</option>
        <option value="ERROR" ${level === 'ERROR' ? 'selected' : ''}>ERROR</option>
        <option value="SUCCESS" ${level === 'SUCCESS' ? 'selected' : ''}>SUCCESS</option>
      </select>
    </form>
    <pre>${filteredLogs.join('\n')}</pre>
  `);
});



cron.schedule('0 0,12 * * *', () => {
  log('info', 'Running scheduled task');
  readFileAndUpload().catch(err => log('error', `Error in scheduled task: ${err}`));
});



app.listen(port, () => {
  log('info', `Server is running on port ${port}`);
});