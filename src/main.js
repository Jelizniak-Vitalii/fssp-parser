import path from 'path';

import { parseExcel, saveExcel } from './services/excel.service.js';
import { filterClients, getFsspAndFilterClients } from './services/fssp.service.js';

export async function parseFssp() {
  const inputFile = path.join(process.cwd(), 'assets', 'input', 'list.xlsx');
  const outputFilePath = path.join(process.cwd(), 'assets', 'output', 'list.xlsx');
  const entries = await parseExcel(inputFile);
  const clients = await filterClients(entries);
  const filteredClients = await getFsspAndFilterClients(clients, 20);

  await saveExcel(filteredClients.filteredEntries, outputFilePath);
  await saveExcel(clients.slice(filteredClients.count), inputFile);
}
