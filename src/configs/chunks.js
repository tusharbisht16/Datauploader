
import { Entry } from "../modal/entrySchema.js";
import {log } from "../loggs.js"
export async function processChunks(dataArray, chunkSize) {
    for (let i = 0; i < dataArray.length; i += chunkSize) {
      const chunk = dataArray.slice(i, i + chunkSize);
      log('info', `Processing chunk: ${i / chunkSize + 1} / ${Math.ceil(dataArray.length / chunkSize)}`);
  
      const promises = chunk.map(async (data) => {
        try {
          const existingEntry = await Entry.findOne({ id: data.id });
          if (!existingEntry) {
            await Entry.create(data);
            log('success', `New entry added: ${JSON.stringify(data)}`);
          } else {
            await Entry.updateOne({ id: data.id }, data);
            log('success', `Existing entry updated: ${JSON.stringify(data)}`);
          }
        } catch (error) {
          log('error', `Error processing data: ${JSON.stringify(data)}, Error: ${error}`);
        }
      });
  
      await Promise.all(promises);
    }
  }