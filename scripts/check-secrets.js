#!/usr/bin/env node
/**
 * Pre-commit secret scanner. Reads staged file contents from `git` and bails
 * if any line matches a high-confidence secret pattern. Zero deps so it runs
 * the same on every machine — no `brew install` required.
 *
 * To bypass intentionally: `git commit --no-verify` (don't make this a habit).
 */
const { execSync } = require('node:child_process');

// Patterns chosen for low false-positive rate. Each entry: [name, regex, opts].
// `inFixturesOk: true` means the pattern is expected to occur in test fixtures
// (e.g. a fake JWT_SECRET literal) — we skip it for files under tests/.
const PATTERNS = [
  ['JWT secret literal', /JWT_SECRET\s*=\s*[^=\s][^\s]{12,}/, { inFixturesOk: true }],
  ['DATABASE_URL with credentials', /\b(postgres|postgresql|mysql):\/\/[^:\/\s]+:[^@\/\s]+@/, { inFixturesOk: true }],
  // High-entropy patterns below are real-format-specific and should fire even in tests —
  // there's no good reason to paste a real AWS/Stripe/GitHub token into a fixture.
  ['AWS access key id', /\bAKIA[0-9A-Z]{16}\b/],
  ['AWS secret key', /\baws_secret_access_key\s*=\s*['"]?[A-Za-z0-9/+=]{40}\b/i],
  ['Generic API key', /\b(api[_-]?key|secret[_-]?key|access[_-]?token)\s*[:=]\s*['"][A-Za-z0-9_\-]{24,}['"]/i, { inFixturesOk: true }],
  ['Cloudinary URL', /cloudinary:\/\/\d+:[A-Za-z0-9_\-]+@/],
  ['Stripe secret key', /\bsk_(live|test)_[0-9a-zA-Z]{24,}\b/],
  ['Slack token', /\bxox[baprs]-[0-9A-Za-z\-]{10,}\b/],
  ['GitHub PAT', /\bghp_[A-Za-z0-9]{36}\b/],
  ['Private key block', /-----BEGIN (RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/],
];

// Paths we should never commit even if no secret matches.
const FORBIDDEN_PATHS = [/(^|\/)\.env$/, /(^|\/)\.env\.[^/]*$/];
// .env.production ships an empty VITE_API_BASE_URL so the FE uses the
// same-origin /api proxy. It's a build-time template, not a secret store.
// The pattern scanner still inspects its contents for accidental leaks.
const FORBIDDEN_ALLOW = [/\.env\.example$/, /\.env\.sample$/, /\.env\.production$/];

// Test fixtures get a pass on the patterns flagged `inFixturesOk`.
const isTestFile = (file) => /(^|\/)tests?\//.test(file) || /\.test\.[jt]sx?$/.test(file);

function staged() {
  return execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function showStagedDiff(file) {
  // We scan only ADDED lines to avoid flagging untouched secrets that were
  // already present (still bad, but not introduced by this commit).
  try {
    const out = execSync(`git diff --cached --no-color -U0 -- "${file}"`, { encoding: 'utf8' });
    return out
      .split('\n')
      .filter((l) => l.startsWith('+') && !l.startsWith('+++'))
      .map((l) => l.slice(1))
      .join('\n');
  } catch {
    return '';
  }
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

    // Skip binaries / lockfiles / minified — too much noise, low signal.
    if (/\.(png|jpe?g|gif|webp|ico|woff2?|pdf|zip|lock)$|package-lock\.json$|pnpm-lock\.yaml$/.test(file)) {
      continue;
    }

    const added = showStagedDiff(file);
    if (!added) continue;

    const inFixtures = isTestFile(file);
    for (const [name, re, opts] of PATTERNS) {
      if (inFixtures && opts && opts.inFixturesOk) continue;
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
  console.error('Fix the matches above, or — if you are 100% sure this is a false positive —');
  console.error('bypass with `git commit --no-verify` (and consider tightening the regex).\n');
  process.exit(1);
}

main();
