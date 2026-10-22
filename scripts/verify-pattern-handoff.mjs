import { createHash } from 'node:crypto'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const handoffRoot = path.resolve(process.cwd(), '_pattern-lib')
const manifestRelativePath = 'export-manifest.json'
const manifestPath = path.join(handoffRoot, manifestRelativePath)
const expectedManifestHash = '6cdeab3ec820acc8ee921bd17d460464dc6ae44b377efb48703d745aeeddc3f8'

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const manifestBytes = await readFile(manifestPath)
assert(
  sha256(manifestBytes) === expectedManifestHash,
  'The pattern handoff export manifest changed; review the package before trusting its hashes.',
)

const manifest = JSON.parse(manifestBytes.toString('utf8'))
const excludedDirectories = new Set(manifest.excludedDirectories)
const excludedSuffixes = manifest.excludedFileSuffixes

async function listReleasedFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  entries.sort((left, right) => left.name.localeCompare(right.name, 'en'))
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue
    if (entry.isFile() && entry.name === manifestRelativePath) continue
    if (entry.isFile() && excludedSuffixes.some(suffix => entry.name.endsWith(suffix))) continue

    const relativePath = path.posix.join(prefix, entry.name)
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await listReleasedFiles(absolutePath, relativePath))
    else if (entry.isFile()) files.push(relativePath)
    else throw new Error('Unsupported pattern handoff filesystem entry: ' + relativePath)
  }

  return files
}

assert(Array.isArray(manifest.files), 'Pattern handoff manifest files must be an array.')
const expectedPaths = manifest.files.map(item => item.path)
const actualPaths = await listReleasedFiles(handoffRoot)
const unexpectedPaths = actualPaths.filter(file => !expectedPaths.includes(file))
const missingPaths = expectedPaths.filter(file => !actualPaths.includes(file))

assert(unexpectedPaths.length === 0, 'Unexpected released pattern files: ' + unexpectedPaths.join(', '))
assert(missingPaths.length === 0, 'Missing released pattern files: ' + missingPaths.join(', '))

const rootHash = createHash('sha256')
for (const item of manifest.files) {
  const absolutePath = path.join(handoffRoot, item.path)
  const bytes = await readFile(absolutePath)
  const fileStat = await stat(absolutePath)
  assert(fileStat.size === item.bytes, 'Pattern handoff byte count changed: ' + item.path)
  assert(sha256(bytes) === item.sha256, 'Pattern handoff SHA-256 changed: ' + item.path)
  rootHash.update(`${item.path}\0${item.bytes}\0${item.sha256}\n`)
}
assert(rootHash.digest('hex') === manifest.rootSha256, 'Pattern handoff root SHA-256 changed.')

const catalog = JSON.parse(await readFile(path.join(handoffRoot, 'catalog/catalog.json'), 'utf8'))
const combined = JSON.parse(await readFile(path.join(handoffRoot, 'catalog/combined-catalog.json'), 'utf8'))
const summary = JSON.parse(await readFile(path.join(handoffRoot, 'validation/reports/validation-summary.json'), 'utf8'))

assert(catalog.patterns?.length === 25, 'Pattern handoff must contain 25 add-on patterns.')
assert(combined.counts?.basePatterns === 6, 'Combined catalogue must retain six base patterns.')
assert(combined.counts?.addOnPatterns === 25, 'Combined catalogue must contain 25 add-on patterns.')
assert(combined.counts?.patterns === 31, 'Combined catalogue must contain 31 patterns.')
assert(summary.status === 'passed-with-findings', 'Unexpected pattern validation status: ' + summary.status)
assert(summary.retainedFindings?.length === 2, 'Expected two retained visual-parity accessibility findings.')

console.log(
  'Pattern handoff verified: ' + manifest.files.length + ' immutable released files, ' +
  catalog.patterns.length + ' add-on patterns / ' + combined.counts.patterns +
  ' combined patterns, with ' + summary.retainedFindings.length + ' retained findings.',
)
