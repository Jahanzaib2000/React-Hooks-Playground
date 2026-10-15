import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { checkLineCounts, countPhysicalLines } from './check-line-count.mjs';

test('physical lines include blanks, comments, and embedded code with either newline format', () => {
  assert.equal(countPhysicalLines(''), 0);
  assert.equal(countPhysicalLines('\n'), 1);
  assert.equal(countPhysicalLines('// comment\n\nconst code = `a\nb`;\n'), 4);
  assert.equal(countPhysicalLines('one\r\n\r\nthree'), 3);
  assert.equal(countPhysicalLines('one\rtwo\r'), 2);
});

test('CLI warns above 250, fails above 270, and excludes non-maintained evidence', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'refactor-line-check-'));
  try {
    const write = (file, lines) => {
      const target = path.join(root, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, '// source\n'.repeat(lines));
    };
    for (const file of ['node_modules/lib.js', 'dist/app.js', 'dist-ssr/server.js', 'build/app.js', 'coverage/data.json',
      'docs/archived-source.jsx', 'package-lock.json', 'pnpm-lock.yaml', 'README.md', '.phase7-browser/cache.js']) write(file, 500);
    write('src/lesson.js', 250);
    write('vite.config.js', 251);
    write('src/styles.css', 270);
    let result = checkLineCounts(root);
    assert.equal(result.files.length, 3);
    assert.deepEqual(result.warnings.map(f => f.lines).sort((a, b) => a - b), [251, 270]);
    const cli = fileURLToPath(new URL('./check-line-count.mjs', import.meta.url));
    let run = spawnSync(process.execPath, [cli], { cwd: root, encoding: 'utf8' });
    assert.equal(run.status, 0);
    assert.match(run.stderr, /WARN/);
    write('src/lesson.js', 271);
    result = checkLineCounts(root);
    assert.equal(result.failures[0].lines, 271);
    run = spawnSync(process.execPath, [cli], { cwd: root, encoding: 'utf8' });
    assert.equal(run.status, 1);
    assert.match(run.stderr, /FAIL src\/lesson.js: 271/);
  } finally {
    assert.equal(path.dirname(root), os.tmpdir());
    assert.ok(path.basename(root).startsWith('refactor-line-check-'));
    fs.rmSync(root, { recursive: true, force: true });
  }
});
