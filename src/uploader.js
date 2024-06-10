import fs from "fs";
import path from "path";
import { processChunks } from "./configs/chunks.js";

import { fileURLToPath } from "url";
import {log} from "./loggs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readFileAndUpload() {
  const filePath = path.join(__dirname, "./data.json");
  if (!fs.existsSync(filePath)) {
    log("error", `Data file not found: ${filePath}`);
    return;
  }

  let rawData;
  try {
    rawData = fs.readFileSync(filePath, "utf-8");
    log("info", `Read data from file: ${filePath}`);
  } catch (error) {
    log("error", `Failed to read file: ${filePath}, Error: ${error}`);
    return;
  }

  let dataArray;
  try {
    dataArray = JSON.parse(rawData);
    log("info", `Parsed data successfully from file: ${filePath}`);
  } catch (error) {
    log(
      "error",
      `Failed to parse data from file: ${filePath}, Error: ${error}`
    );
    return;
  }

  await processChunks(dataArray, 10); // Process data in chunks of 10
}
