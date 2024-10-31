import path from 'path';

import { parseExcel, saveExcel } from './services/excel.service.js';
import { filterClients, getFsspAndFilterClients } from './services/fssp.service.js';
import { logger } from './services/logger.service.js';
import * as fs from 'node:fs';

async function getFsspClients(filePath) {
  try {
    await fs.promises.access(filePath);

    return await parseExcel(filePath);
  } catch (error) {
    return [];
  }
}

export async function parseFssp() {
  try {
    const inputFilePath = path.join(process.cwd(), 'assets', 'input', 'list.xlsx');
    const outputFilePath = path.join(process.cwd(), 'assets', 'output', 'list.xlsx');
    const outputFsspFilePath = path.join(process.cwd(), 'assets', 'output', 'fssp-list.xlsx');
    const clients = await filterClients(await parseExcel(inputFilePath));
    const filteredClients = await getFsspAndFilterClients(clients, 2000);

    await saveExcel(
      [
        ...await getFsspClients(outputFilePath),
        ...filteredClients.filteredClients
      ],
      outputFilePath
    );
    await saveExcel(
      [
        ...await getFsspClients(outputFsspFilePath),
        ...filteredClients.fsspClients
      ],
      outputFsspFilePath
    );
    await saveExcel(clients.slice(filteredClients.count), inputFilePath);

    if ((await parseExcel(inputFilePath)).length) {
      await parseFssp();
    }
  } catch (error) {
    logger.error(error.message);
  }
}
