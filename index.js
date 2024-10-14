import { fileURLToPath } from 'url';
import path from 'path';
import * as dotenv from 'dotenv';

import { parseFssp } from './src/main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

await parseFssp();
