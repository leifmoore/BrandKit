import { createHash } from 'node:crypto'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const handoffRoot = path.resolve(process.cwd(), '_comp-lib')
const inventoryRelativePath = 'validation/reports/file-inventory.json'
const inventoryPath = path.join(handoffRoot, inventoryRelativePath)
const expectedInventoryHash = '760895e83d1ffbb1f487d3d39110d8e283f0998995c3da09d3ad44208b86dc4c'

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

async function listFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const relativePath = path.posix.join(prefix, entry.name)
    const absolutePath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...await listFiles(absolutePath, relativePath))
    } else if (entry.isFile()) {
      files.push(relativePath)
    }
  }

  return files.sort()
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const inventoryBytes = await readFile(inventoryPath)
assert(
  sha256(inventoryBytes) === expectedInventoryHash,
  'The handoff inventory report changed; review the package before trusting its per-file hashes.',
)

const inventory = JSON.parse(inventoryBytes.toString('utf8'))
assert(inventory.algorithm === 'sha256', 'Unsupported inventory algorithm: ' + inventory.algorithm)
assert(inventory.count === inventory.items.length, 'Handoff inventory count does not match its items.')

const expectedPaths = new Set([inventoryRelativePath])

for (const item of inventory.items) {
  expectedPaths.add(item.path)
  const absolutePath = path.join(handoffRoot, item.path)
  const bytes = await readFile(absolutePath)
  const fileStat = await stat(absolutePath)

  assert(fileStat.size === item.bytes, 'Byte count changed: ' + item.path)
  assert(sha256(bytes) === item.sha256, 'SHA-256 changed: ' + item.path)
}

const actualPaths = await listFiles(handoffRoot)
const unexpectedPaths = actualPaths.filter(file => !expectedPaths.has(file))
const missingPaths = [...expectedPaths].filter(file => !actualPaths.includes(file))

assert(unexpectedPaths.length === 0, 'Unexpected handoff files: ' + unexpectedPaths.join(', '))
assert(missingPaths.length === 0, 'Missing handoff files: ' + missingPaths.join(', '))

const catalog = JSON.parse(await readFile(path.join(handoffRoot, 'catalog/catalog.json'), 'utf8'))
const expectedCounts = {
  components: 39,
  deferredComponents: 10,
  recipes: 6,
  foundations: 6,
  utilities: 1,
}

for (const [key, expectedCount] of Object.entries(expectedCounts)) {
  assert(Array.isArray(catalog[key]), 'Catalog field is not an array: ' + key)
  assert(
    catalog[key].length === expectedCount,
    'Catalog count changed for ' + key + ': expected ' + expectedCount + ', received ' + catalog[key].length,
  )
}

console.log(
  'Handoff verified: ' + inventory.count + ' immutable files, ' +
  catalog.components.length + ' components, ' +
  catalog.deferredComponents.length + ' deferred components, ' +
  catalog.recipes.length + ' recipes, and ' +
  catalog.foundations.length + ' foundations.',
)
