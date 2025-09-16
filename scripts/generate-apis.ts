import fs from 'fs';
import path from 'path';
import { generate } from 'openapi-typescript-codegen';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileName);

const specsDir = path.join(__dirname, '..', 'src/api', 'openapi');
const outDir = path.join(__dirname, '..', 'src/clients');

const apis = [
  { name: 'ReferenceData', file: 'referenceData.json' },
  { name: 'CapEventPackage', file: 'capEventPackage.json' },
  { name: 'TemplateLibrary', file: 'templateLibrary.json' },
];

(async () => {
  for (const api of apis) {
    const specPath = path.join(specsDir, api.file);
    const dest = path.join(outDir, api.name);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    console.log(`Generating client for ${api.name} from ${specPath} -> ${dest}`);

    await generate({
      input: specPath,
      output: dest,
      httpClient: 'axios',
      clientName: `${api.name}Client`,
    });
  }
})();
