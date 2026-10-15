import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Documentation includes archived source and generated audit fixtures, not app code.
const excludedDirectories = new Set([
  'node_modules', 'dist', 'dist-ssr', 'build', 'coverage', 'docs', '.git', '.codex', '.agents', '.aws'
]);
const excludedFiles = new Set([
  'package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lock', 'bun.lockb'
]);
const maintainedExtensions = new Set([
  '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.css', '.html', '.json', '.svg', '.yaml', '.yml', '.toml'
]);

export function countPhysicalLines(text) {
  if (!text) return 0;
  return text.split(/\r\n|\n|\r/).length - (/[\r\n]$/.test(text) ? 1 : 0);
}

export function checkLineCounts(root) {
  const files = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!excludedDirectories.has(entry.name) && !/^\.phase\d+-browser$/.test(entry.name)) visit(fullPath);
      } else if (entry.isFile() && !excludedFiles.has(entry.name) &&
        (maintainedExtensions.has(path.extname(entry.name)) || entry.name === '.gitignore')) {
        files.push({
          file: path.relative(root, fullPath).split(path.sep).join('/'),
          lines: countPhysicalLines(fs.readFileSync(fullPath, 'utf8'))
        });
      }
    }
  }
  visit(root);
  return {
    files,
    warnings: files.filter(({ lines }) => lines > 250 && lines <= 270),
    failures: files.filter(({ lines }) => lines > 270)
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = checkLineCounts(process.cwd());
  for (const { file, lines } of result.warnings) console.warn(`WARN ${file}: ${lines} lines (target 250)`);
  for (const { file, lines } of result.failures) console.error(`FAIL ${file}: ${lines} lines (maximum 270)`);
  console.log(`Checked ${result.files.length} maintained files: ${result.warnings.length} warnings, ${result.failures.length} failures.`);
  if (result.failures.length) process.exitCode = 1;
}
