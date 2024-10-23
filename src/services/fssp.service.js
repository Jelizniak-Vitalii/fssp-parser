import * as fs from 'node:fs';
import path from 'path';

import { formatDate } from '../utils/format-date.utils.js';
import { Client } from '../client/client.js';
import { checkFsspError } from '../utils/errors.utils.js';
import { getFssp } from './api/api.service.js';
import { logger } from './logger.service.js';

async function saveDataToFile(fileName, data) {
  try {
    await fs.promises.writeFile(path.join(process.cwd(), 'assets', 'output', fileName), JSON.stringify(data));
    logger.info(`${fileName} успешно сохранён.`);
  } catch (err) {
    throw new Error(`Ошибка записи файла ${fileName}: ${err.message}`);
  }
}

export async function filterClients(clients) {
  return clients.filter(client => new Client(client['name'], client['birthDate']).isClientValid);
}

export async function getFsspAndFilterClients(clients, numberOfClients = 10, from = 0) {
  const startTime = performance.now();
  const filteredEntries = [];
  const fsspData = [];
  let requests = [];
  let count = 0;

  logger.info('Начало выполнения');

  try {
    const processRequests = async () => {
      const responses = await Promise.all(requests);

      for (const response of responses) {
        fsspData.push(response.data);

        checkFsspError(response);

        if (!response.data.result.length) {
          const entry = clients[from + count];
          filteredEntries.push({ ...entry, birthDate: formatDate(entry.birthDate) });
        }

        count++;
      }

      logger.info(`Обработано ${count} клиентов`);

      requests = [];
    };

    for (let i = 0; i < clients.slice(from, from + numberOfClients).length; i++) {
      if (count >= numberOfClients) break;

      const client = new Client(clients[i]['name'], clients[i]['birthDate']);

      requests.push(getFssp({ ...client, dob: formatDate(client.dob) }));

      if (requests.length === 5) {
        await processRequests();
      }
    }

    if (requests.length > 0) {
      await processRequests();
    }
  } catch (e) {
    logger.error(`Ошибка при обработке запроса: ${e.message}`);
  }

  await saveDataToFile('fssp-data.json', fsspData);

  const endTime = performance.now();
  logger.info(`Обработка завершена - общее время выполнения: ${((endTime - startTime) / 1000).toFixed(2)} секунд`);

  return { count, filteredEntries };
}
