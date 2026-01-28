import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

type GenConfig = {
  name: string;
  file: string;
  importMappings?: string[];
  typeMappings?: string[];
};

const fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileName);
const root = path.join(__dirname, '..');
const specsDir = path.join(root, 'src/api', 'openapi');
const outDir = path.join(root, 'src/clients');
const NPX = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const apis: GenConfig[] = [
  { name: 'Common', file: 'common.json' },
  {
    name: 'ReferenceData',
    file: 'referenceData.json',
    typeMappings: [
      'JournalEntry_properties_account=Account',
      'JournalEntry_properties_entity=Entity',
      'JournalEntry_properties_investment=Investment',
    ],
    importMappings: [
      'Account=@/clients/Common',
      'Entity=@/clients/Common',
      'Investment=@/clients/Common',
    ],
  },
  {
    name: 'CapEventPackage',
    file: 'capEventPackage.json',
    importMappings: ['ErrorResponse=@/clients/Common'],
  },
  { name: 'TemplateLibrary', file: 'templateLibrary.json' },
  { name: 'BoxConnector', file: 'boxConnector.json' },
];

const runGenerator = (cfg: GenConfig) => {
  const spec = path.join(specsDir, cfg.file);
  const out = path.join(outDir, cfg.name);

  // Clean previous output to avoid stale artifacts.
  if (fs.existsSync(out)) {
    fs.rmSync(out, { recursive: true, force: true });
  }
  fs.mkdirSync(out, { recursive: true });

  const parts = [
    NPX,
    '@openapitools/openapi-generator-cli',
    'generate',
    '-g',
    'typescript-axios',
    '-i',
    `"${spec}"`,
    '-o',
    `"${out}"`,
    '--additional-properties=useSingleRequestParameter=true,supportsES6=true',
  ];

  if (cfg.importMappings?.length) {
    parts.push('--import-mappings', cfg.importMappings.join(','));
  }

  if (cfg.typeMappings?.length) {
    parts.push('--type-mappings', cfg.typeMappings.join(','));
  }

  console.log(`Generating ${cfg.name} from ${spec} -> ${out}`);
  execSync(parts.join(' '), { stdio: 'inherit', cwd: root });
};

apis.forEach(runGenerator);
