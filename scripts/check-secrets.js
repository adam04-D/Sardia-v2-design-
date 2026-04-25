#!/usr/bin/env node
/**
 * Pre-commit secret scanner. Reads staged file contents from `git` and bails
 * if any line matches a high-confidence secret pattern. Zero deps.
 *
 * Bypass: `git commit --no-verify` (don't make a habit of it).
 */
const { execSync } = require('node:child_process');

const PATTERNS = [
  ['JWT secret literal', /JWT_SECRET\s*=\s*[^=\s][^\s]{12,}/],
  ['DATABASE_URL with credentials', /\b(postgres|postgresql|mysql):\/\/[^:\/\s]+:[^@\/\s]+@/],
  ['AWS access key id', /\bAKIA[0-9A-Z]{16}\b/],
  ['AWS secret key', /\baws_secret_access_key\s*=\s*['"]?[A-Za-z0-9/+=]{40}\b/i],
  ['Generic API key', /\b(api[_-]?key|secret[_-]?key|access[_-]?token)\s*[:=]\s*['"][A-Za-z0-9_\-]{24,}['"]/i],
  ['Cloudinary URL', /cloudinary:\/\/\d+:[A-Za-z0-9_\-]+@/],
  ['Stripe secret key', /\bsk_(live|test)_[0-9a-zA-Z]{24,}\b/],
  ['Slack token', /\bxox[baprs]-[0-9A-Za-z\-]{10,}\b/],
  ['GitHub PAT', /\bghp_[A-Za-z0-9]{36}\b/],
  ['Private key block', /-----BEGIN (RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/],
];

const FORBIDDEN_PATHS = [/(^|\/)\.env$/, /(^|\/)\.env\.[^/]*$/];
const FORBIDDEN_ALLOW = [/\.env\.example$/, /\.env\.sample$/];

function staged() {
  return execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
    .split('\n').map((s) => s.trim()).filter(Boolean);
}

function showStagedDiff(file) {
  try {
    const out = execSync(`git diff --cached --no-color -U0 -- "${file}"`, { encoding: 'utf8' });
    return out.split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++')).map((l) => l.slice(1)).join('\n');
  } catch { return ''; }
}

function main() {
  const files = staged();
  if (files.length === 0) process.exit(0);

  const findings = [];

  for (const file of files) {
    if (FORBIDDEN_PATHS.some((re) => re.test(file)) && !FORBIDDEN_ALLOW.some((re) => re.test(file))) {
      findings.push({ file, line: '(whole file)', name: 'forbidden path (.env-style)' });
      continue;
    }
    if (/\.(png|jpe?g|gif|webp|ico|woff2?|pdf|zip|lock)$|package-lock\.json$|pnpm-lock\.yaml$/.test(file)) continue;

    const added = showStagedDiff(file);
    if (!added) continue;

    for (const [name, re] of PATTERNS) {
      const match = added.match(re);
      if (match) findings.push({ file, line: match[0].slice(0, 120), name });
    }
  }

  if (findings.length === 0) process.exit(0);

  console.error('\n✗ Pre-commit secret scan blocked this commit.\n');
  for (const f of findings) {
    console.error(`  • ${f.name}`);
    console.error(`    file: ${f.file}`);
    console.error(`    match: ${f.line}\n`);
  }
  console.error('Fix the matches above, or — if 100% sure — bypass with `git commit --no-verify`.\n');
  process.exit(1);
}

main();
