import XLSX from 'xlsx';

export async function parseExcel(pathToFile) {
  try {
    const workbook = XLSX.readFile(pathToFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    throw new Error(`Ошибка при чтении файла: ${error.message}`)
  }
}

export async function saveExcel(data, pathToFile) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'clients');
    XLSX.writeFile(newWorkbook, pathToFile);
  } catch (error) {
    throw new Error(`Ошибка при сохранении файла: ${error.message}`);
  }
}
