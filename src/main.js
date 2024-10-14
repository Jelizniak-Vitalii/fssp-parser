import { fileURLToPath } from 'url';
import path from 'path';

import { parseExcel, saveExcel } from './services/excel.service.js';
import { getFsspAndFilterClients } from './services/fssp.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function parseFssp() {
  const inputFile = `${__dirname}/inputFile/list.xlsx`;
  const outputFilePath = `${__dirname}/outputFile/list.xlsx`;
  const entries = await parseExcel(inputFile);

  await saveExcel(await getFsspAndFilterClients(entries), outputFilePath);
}
