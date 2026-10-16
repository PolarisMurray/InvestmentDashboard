import { access, copyFile } from 'node:fs/promises';

const privateFiles = [
  ['src/local-data.ts','src/local-data.example.ts'],
  ['src/local-market-data.ts','src/local-market-data.example.ts']
];

for (const [localPath,examplePath] of privateFiles) {
  try {
    await access(localPath);
  } catch {
    await copyFile(examplePath,localPath);
    console.log(`Created ${localPath} from public demo data.`);
  }
}
