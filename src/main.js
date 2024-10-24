import path from 'path';

import { parseExcel, saveExcel } from './services/excel.service.js';
import { filterClients, getFsspAndFilterClients } from './services/fssp.service.js';
import { logger } from './services/logger.service.js';

export async function parseFssp() {
  try {
    const inputFilePath = path.join(process.cwd(), 'assets', 'input', 'list.xlsx');
    const outputFilePath = path.join(process.cwd(), 'assets', 'output', 'list.xlsx');
    const entries = await parseExcel(inputFilePath);
    const clients = await filterClients(entries);
    const filteredClients = await getFsspAndFilterClients(clients, 2000);

    await saveExcel(
      [
        ...await parseExcel(outputFilePath),
        ...filteredClients.filteredEntries
      ],
      outputFilePath
    );
    await saveExcel(clients.slice(filteredClients.count), inputFilePath);

    if ((await parseExcel(inputFilePath)).length) {
      await parseFssp();
    }
  } catch (error) {
    logger.error(error.message);
  }
}
