import XLSX from 'xlsx';
import { logger } from './logger.service.js';

export async function parseExcel(pathToFile) {
  const workbook = XLSX.readFile(pathToFile);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(worksheet);
}

export async function saveExcel(data, pathToFile) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'clients');
    XLSX.writeFile(newWorkbook, pathToFile);
  } catch (error) {
    logger.error(`Ошибка при сохранении файла: ${error.message}`);
  }
}
