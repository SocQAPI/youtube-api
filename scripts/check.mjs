// Offline repository check: payloads, syntax, structure and secrets.
// Run with `npm run check`. Makes no network requests.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const failures = [];
const fail = (message) => failures.push(message);
const readJson = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));

// --- structure -------------------------------------------------------------
const requiredFiles = [
  "README.md", "LICENSE", ".gitignore", ".env.example", "SECURITY.md", "endpoints.json",
  ".socq-example.json", "package.json", "docs/production-notes.md",
  "examples/curl/socq.sh", "examples/curl/request.md", "examples/node/socq.mjs",
  "examples/node/package.json", "examples/python/socq.py",
  "fixtures/submit-response.json", "fixtures/task-response.json",
];
for (const path of requiredFiles) if (!existsSync(join(root, path))) fail(`missing ${path}`);

const catalog = readJson("endpoints.json");
const metadata = readJson(".socq-example.json");
const readme = readFileSync(join(root, "README.md"), "utf8");
if (metadata.schemaVersion !== 1 || metadata.templateVersion !== "2.0.0" || metadata.platform !== catalog.platform) {
  fail(".socq-example.json metadata is invalid");
}
if (metadata.endpointCount !== catalog.endpoints.length) fail("endpoint count mismatch");
if (readFileSync(join(root, ".env.example"), "utf8").trim() !== "SOCQ_API_KEY=your-api-key") {
  fail(".env.example must contain only SOCQ_API_KEY=your-api-key");
}

// --- minimal JSON Schema validator (keywords used by the SocQ OpenAPI) ------
function typeOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "number") return Number.isInteger(value) ? "integer" : "number";
  return typeof value;
}
function validate(schema, value, path = "$") {
  const errors = [];
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual = typeOf(value);
    if (!types.includes(actual) && !(actual === "integer" && types.includes("number"))) {
      return [`${path}: expected ${types.join("|")}, got ${actual}`];
    }
  }
  if (schema.enum && !schema.enum.some((option) => JSON.stringify(option) === JSON.stringify(value))) {
    errors.push(`${path}: not one of the allowed values`);
  }
  if ("const" in schema && JSON.stringify(schema.const) !== JSON.stringify(value)) errors.push(`${path}: const mismatch`);
  if (typeof value === "string") {
    const length = [...value].length;
    if (schema.minLength !== undefined && length < schema.minLength) errors.push(`${path}: shorter than ${schema.minLength}`);
    if (schema.maxLength !== undefined && length > schema.maxLength) errors.push(`${path}: longer than ${schema.maxLength}`);
    if (schema.pattern && !new RegExp(schema.pattern, "u").test(value)) errors.push(`${path}: does not match pattern`);
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${path}: below minimum ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${path}: above maximum ${schema.maximum}`);
    if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) errors.push(`${path}: not above ${schema.exclusiveMinimum}`);
    if (schema.multipleOf !== undefined && Math.abs(value / schema.multipleOf - Math.round(value / schema.multipleOf)) > 1e-9) {
      errors.push(`${path}: not a multiple of ${schema.multipleOf}`);
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path}: fewer than ${schema.minItems} items`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) errors.push(`${path}: more than ${schema.maxItems} items`);
    if (schema.items) value.forEach((item, index) => errors.push(...validate(schema.items, item, `${path}[${index}]`)));
  }
  if (typeOf(value) === "object") {
    const properties = schema.properties || {};
    for (const field of schema.required || []) if (!(field in value)) errors.push(`${path}: missing required field ${field}`);
    for (const [field, fieldValue] of Object.entries(value)) {
      if (properties[field]) errors.push(...validate(properties[field], fieldValue, `${path}.${field}`));
      else if (schema.additionalProperties === false) errors.push(`${path}: unsupported field ${field}`);
    }
  }
  if (schema.anyOf && !schema.anyOf.some((option) => validate(option, value, path).length === 0)) {
    errors.push(`${path}: does not satisfy any anyOf option`);
  }
  if (schema.oneOf && schema.oneOf.filter((option) => validate(option, value, path).length === 0).length !== 1) {
    errors.push(`${path}: must satisfy exactly one oneOf option`);
  }
  for (const option of schema.allOf || []) errors.push(...validate(option, value, path));
  if (schema.not && validate(schema.not, value, path).length === 0) errors.push(`${path}: matches a forbidden combination`);
  return errors;
}

// --- payloads --------------------------------------------------------------
const expectedPayloads = new Set();
for (const endpoint of catalog.endpoints) {
  const id = endpoint.publicId;
  if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(id) || endpoint.path !== `/v1/${id}`) fail(`${id}: invalid publicId or path`);
  if (endpoint.payload !== `payloads/${id.split("/")[1]}.json`) fail(`${id}: unexpected payload path`);
  expectedPayloads.add(endpoint.payload);
  if (!readme.includes(`\`${id}\``)) fail(`README does not document ${id}`);
  let payload;
  try {
    payload = readJson(endpoint.payload);
  } catch (error) {
    fail(`${endpoint.payload}: invalid JSON (${error.message})`);
    continue;
  }
  if (typeOf(payload) !== "object") {
    fail(`${endpoint.payload}: must be a JSON object`);
    continue;
  }
  for (const field of endpoint.required) if (!(field in payload)) fail(`${endpoint.payload}: missing required field ${field}`);
  const anyOf = endpoint.requiredAnyOf;
  if (anyOf.length && !anyOf.some((group) => group.every((field) => field in payload))) {
    fail(`${endpoint.payload}: needs one of ${anyOf.map((group) => group.join("+")).join(", ")}`);
  }
  for (const group of endpoint.mutuallyExclusive) {
    if (group.every((field) => field in payload)) fail(`${endpoint.payload}: ${group.join(" and ")} cannot be sent together`);
  }
  for (const error of validate(endpoint.requestSchema, payload)) fail(`${endpoint.payload}: ${error}`);
}
for (const name of readdirSync(join(root, "payloads"))) {
  if (!expectedPayloads.has(`payloads/${name}`)) fail(`payloads/${name} does not belong to any endpoint`);
}

// --- every JSON file parses ------------------------------------------------
function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    if ([".git", "node_modules", "output"].includes(name)) return [];
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const files = walk(root);
for (const path of files.filter((file) => file.endsWith(".json"))) {
  try {
    JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`${relative(root, path)}: invalid JSON`);
  }
}

// --- syntax ----------------------------------------------------------------
for (const script of ["examples/node/socq.mjs", "scripts/check.mjs"]) {
  const result = spawnSync(process.execPath, ["--check", join(root, script)], { encoding: "utf8" });
  if (result.status !== 0) fail(`node --check ${script}: ${result.stderr.trim()}`);
}

const pythonSource = readFileSync(join(root, "examples/python/socq.py"), "utf8");
const pythonCode = "import sys; compile(sys.stdin.read(), 'examples/python/socq.py', 'exec')";
let pythonChecked = false;
for (const [command, ...prefix] of [["python3"], ["python"], ["py", "-3"]]) {
  const result = spawnSync(command, [...prefix, "-c", pythonCode], { input: pythonSource, encoding: "utf8" });
  if (result.error || (result.status !== 0 && /not found|was not found/i.test(result.stderr || ""))) continue;
  pythonChecked = true;
  if (result.status !== 0) fail(`python compile examples/python/socq.py: ${(result.stderr || "").trim()}`);
  break;
}
if (!pythonChecked) fail("Python 3 is required to compile examples/python/socq.py");

const bash = spawnSync("bash", ["-n", join(root, "examples/curl/socq.sh")], { encoding: "utf8" });
if (bash.error) console.warn("bash not found; skipped bash -n examples/curl/socq.sh");
else if (bash.status !== 0) fail(`bash -n examples/curl/socq.sh: ${bash.stderr.trim()}`);

// --- secrets and local paths -------------------------------------------------
const checks = [
  { pattern: /-----BEGIN(?: [A-Z]+)? PRIVATE KEY-----/, message: "private key" },
  { pattern: /\b(?:AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|xox[abpr]-[A-Za-z0-9-]{10,})\b/, message: "credential" },
  { pattern: /Bearer\s+(?!\$SOCQ_API_KEY|\$\{SOCQ_API_KEY\}|<SOCQ_API_KEY>|YOUR_API_KEY)[A-Za-z0-9._~+/-]{20,}/, message: "bearer credential" },
  { pattern: /(?:x-api-key|api[_-]?key)["']?\s*[:=]\s*["'][A-Za-z0-9._-]{20,}["']/i, message: "API key literal" },
  { pattern: /SOCQ_API_KEY\s*=\s*(?!["']?your-api-key\b)["']?[^"'\s]+/, message: "API key assignment" },
  { pattern: /(?:\/Users\/[A-Za-z0-9._-]+\/|[A-Za-z]:\\Users\\|\/home\/[A-Za-z0-9._-]+\/)/, message: "local user path" },
];
for (const path of files) {
  if (/\.(png|jpe?g|webp)$/i.test(path)) continue;
  const contents = readFileSync(path, "utf8");
  for (const check of checks) {
    if (check.pattern.test(contents)) fail(`possible ${check.message} in ${relative(root, path)}`);
  }
}

if (failures.length) {
  console.error(`Check failed with ${failures.length} problem(s):`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}
console.log(`${catalog.platformName} API examples: ${catalog.endpoints.length} payloads valid, syntax and secret checks passed.`);
