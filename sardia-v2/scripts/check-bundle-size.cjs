#!/usr/bin/env node
/**
 * Bundle-size budget check. Run after `npm run build`. Fails (exit 1) if
 * the main entry chunk exceeds the budget — keeps Motion + future deps
 * from silently bloating the homepage. The lazy-loaded route chunks
 * (ReadingPage, Gallery, etc.) are not budgeted here; they're each
 * checked elsewhere or accepted because they affect only one route.
 *
 *   node scripts/check-bundle-size.js
 *
 * Tweak the budget cautiously. Bump only when a deliberate dep change
 * justifies it, never to silence a regression.
 */
const fs = require('node:fs');
const path = require('node:path');

const DIST = path.resolve(__dirname, '../dist/assets');
const BUDGET_BYTES = 525 * 1024; // 525 KB
const ENTRY_PATTERN = /^index-[A-Za-z0-9_-]+\.js$/;

function main() {
  if (!fs.existsSync(DIST)) {
    console.error(`✗ dist/assets not found — run \`npm run build\` first.`);
    process.exit(1);
  }

  const files = fs.readdirSync(DIST).filter((f) => ENTRY_PATTERN.test(f));
  if (files.length === 0) {
    console.error('✗ no main entry chunk found in dist/assets');
    process.exit(1);
  }
  if (files.length > 1) {
    console.error(`✗ expected one entry chunk, found ${files.length}: ${files.join(', ')}`);
    process.exit(1);
  }

  const file = files[0];
  const size = fs.statSync(path.join(DIST, file)).size;
  const kb = (size / 1024).toFixed(1);
  const budgetKb = (BUDGET_BYTES / 1024).toFixed(0);
  const utilization = ((size / BUDGET_BYTES) * 100).toFixed(1);

  if (size > BUDGET_BYTES) {
    console.error(`✗ bundle ${file} = ${kb} KB > budget ${budgetKb} KB (${utilization}%)`);
    console.error('  Run `npm run analyze` to see what grew. Bump the budget only after a deliberate review.');
    process.exit(1);
  }

  console.log(`✓ bundle ${file} = ${kb} KB / ${budgetKb} KB budget (${utilization}%)`);
}

main();
