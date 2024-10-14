import * as fs from 'node:fs';

import { formatDate } from '../utils/format-date.utils.js';
import { getFssp } from './api.service.js';

async function saveDataToFile(fileName, data) {
  try {
    await fs.promises.writeFile(fileName, JSON.stringify(data));
    console.log(`${fileName} успешно сохранён.`);
  } catch (err) {
    console.error(`Ошибка записи файла ${fileName}:`, err);
  }
}

export async function getFsspAndFilterClients(entries, numberOfClients = 10, from = 0) {
  const startTime = performance.now();
  const filteredEntries = [];
  const fsspData = [];
  let requests = [];
  let count = 0;

  console.log('Начало выполнения:', new Date().toLocaleString());

  try {
    for (const entry of entries?.slice(from, from + numberOfClients)) {
      if (count >= numberOfClients) break;

      const name = entry['name'];
      const birthDate = entry['birthDate'];
      const formattedBirthDate = formatDate(birthDate);

      requests.push(getFssp(name, formattedBirthDate));

      if (requests.length === 5) {
        const responses = await Promise.all(requests);

        for (const response of responses) {
          fsspData.push(response.data);

          if (!response.data.result.length) {
            filteredEntries.push({ ...entry, birthDate: formattedBirthDate });
          }

          count++;
          console.log(`Обработано ${count} клиентов`);
        }

        requests = [];
      }
    }

    if (requests.length > 0) {
      const responses = await Promise.all(requests);

      for (const response of responses) {
        fsspData.push(response.data);

        if (!response.data.result.length) {
          const entry = entries[from + count];
          filteredEntries.push({ ...entry, birthDate: formatDate(entry.birthDate) });
        }

        count++;
        console.log(`Обработано ${count} клиентов`);
      }
    }

  } catch (e) {
    console.error(`Ошибка при обработке запроса:`, e.message);
    await saveDataToFile('client-error.json', fsspData);
  }

  await saveDataToFile('fssp-data.json', fsspData);

  const endTime = performance.now();
  const duration = (endTime - startTime) / 1000;
  console.log(`Обработка завершена - общее время выполнения: ${duration.toFixed(2)} секунд`);

  return filteredEntries;
}
