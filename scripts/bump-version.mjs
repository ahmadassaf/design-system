#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const VALID_BUMPS = new Set(['major', 'minor', 'patch', 'prerelease']);
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

function parseArgs(argv) {
  const args = argv.slice(2);
  const bump = args.find((arg) => !arg.startsWith('-')) ?? process.env.RELEASE_BUMP ?? 'patch';

  return {
    bump,
    dryRun: args.includes('--dry-run') || process.env.RELEASE_DRY_RUN === 'true'
  };
}

function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);

  if (!match) {
    throw new Error(`Invalid package version "${version}". Expected semver like 1.2.3.`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? null
  };
}

function nextPrerelease(prerelease) {
  if (!prerelease) return '0';

  const parts = prerelease.split('.');
  const last = parts.at(-1);

  if (/^\d+$/.test(last)) {
    parts[parts.length - 1] = String(Number(last) + 1);
    return parts.join('.');
  }

  return `${prerelease}.1`;
}

function bumpVersion(currentVersion, bump) {
  if (VERSION_PATTERN.test(bump)) return bump;
  if (!VALID_BUMPS.has(bump)) {
    throw new Error(`Invalid bump "${bump}". Use major, minor, patch, prerelease, or an explicit semver version.`);
  }

  const version = parseVersion(currentVersion);

  if (bump === 'major') return `${version.major + 1}.0.0`;
  if (bump === 'minor') return `${version.major}.${version.minor + 1}.0`;
  if (bump === 'patch') return `${version.major}.${version.minor}.${version.patch + 1}`;

  return `${version.major}.${version.minor}.${version.patch}-${nextPrerelease(version.prerelease)}`;
}

const { bump, dryRun } = parseArgs(process.argv);
const packagePath = resolve('package.json');
const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
const previousVersion = packageJson.version;
const nextVersion = bumpVersion(previousVersion, bump);

if (nextVersion === previousVersion) {
  console.log(`Version is already ${nextVersion}.`);
  process.exit(0);
}

packageJson.version = nextVersion;

if (!dryRun) {
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

console.log(`${previousVersion} -> ${nextVersion}${dryRun ? ' (dry run)' : ''}`);
