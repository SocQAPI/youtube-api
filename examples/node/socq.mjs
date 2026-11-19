#!/usr/bin/env node
// Submit a SocQ task, poll it, read every result page and save the records.
// Usage: node examples/node/socq.mjs <publicId> [params.json | '{"json":"object"}']
//        node examples/node/socq.mjs --list
// Node.js 20+, no dependencies. Reads only SOCQ_API_KEY.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = "https://api.socq.ai";
const POLL_MS = 3000;
const TIMEOUT_MS = 10 * 60 * 1000;
const PAGE_LIMIT = 100;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const catalog = JSON.parse(await readFile(resolve(root, "endpoints.json"), "utf8"));
const [publicId, paramsArg] = process.argv.slice(2);

if (!publicId || ["-h", "--help", "--list"].includes(publicId)) {
  console.log("Usage: node examples/node/socq.mjs <publicId> [params.json | '{\"json\":\"object\"}']");
  console.log("Endpoints:");
  for (const endpoint of catalog.endpoints) console.log(`  ${endpoint.publicId}\t${endpoint.name}`);
  process.exit(publicId ? 0 : 1);
}

const endpoint = catalog.endpoints.find((item) => item.publicId === publicId);
if (!endpoint) throw new Error(`Unknown endpoint ${publicId}. Run with --list.`);

async function loadParams() {
  if (!paramsArg) return JSON.parse(await readFile(resolve(root, endpoint.payload), "utf8"));
  if (paramsArg.trim().startsWith("{")) return JSON.parse(paramsArg);
  return JSON.parse(await readFile(resolve(paramsArg), "utf8"));
}

const params = await loadParams();
if (!params || typeof params !== "object" || Array.isArray(params)) {
  throw new Error("Params must be a JSON object.");
}

const apiKey = process.env.SOCQ_API_KEY;
if (!apiKey || apiKey === "your-api-key") throw new Error("Set SOCQ_API_KEY first.");

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

// Retries 429 on every request and transient 5xx/network errors on GET only,
// so a submit is never silently duplicated.
async function request(method, path, body, attempt = 0) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (error) {
    if (method === "GET" && attempt < 3) {
      await sleep(1000 * 2 ** attempt);
      return request(method, path, body, attempt + 1);
    }
    throw error;
  }
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  const retryable = response.status === 429 || (method === "GET" && response.status >= 500);
  if (retryable && attempt < 3) {
    const retryAfter = Number(response.headers.get("retry-after"));
    await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt);
    return request(method, path, body, attempt + 1);
  }
  if (!response.ok) {
    const message = data?.error?.message || data?.message || `HTTP ${response.status}`;
    throw new Error(`SocQ request failed (${response.status}): ${message}`);
  }
  return data;
}

const submitted = await request("POST", endpoint.path, params);
const taskId = submitted?.data?.task_id;
if (!taskId) throw new Error("Submit response did not include data.task_id.");
console.log(`Submitted ${publicId} task ${taskId}`);

const taskPath = `/v1/tasks/${encodeURIComponent(taskId)}`;
const deadline = Date.now() + TIMEOUT_MS;
let task;
while (true) {
  task = (await request("GET", `${taskPath}?limit=${PAGE_LIMIT}`))?.data;
  if (task?.status === "succeeded") break;
  if (task?.status === "failed") throw new Error(task.error_message || `Task ${taskId} failed.`);
  if (Date.now() > deadline) throw new Error(`Timed out waiting for task ${taskId} (status ${task?.status}).`);
  await sleep(POLL_MS);
}

const items = [...(task.results?.items || [])];
let cursor = task.results?.has_more === true ? task.results?.next_cursor : null;
while (cursor) {
  const query = new URLSearchParams({ limit: String(PAGE_LIMIT), cursor });
  const page = (await request("GET", `${taskPath}?${query}`))?.data;
  items.push(...(page?.results?.items || []));
  cursor = page?.results?.has_more === true ? page?.results?.next_cursor : null;
}

const seen = new Set();
const records = items.filter((item) => {
  const key = item?.id != null ? String(item.id) : JSON.stringify(item);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const slug = publicId.split("/")[1];
const outputPath = resolve(root, "output", `${slug}-${taskId}.json`);
await mkdir(dirname(outputPath), { recursive: true });
const output = {
  endpoint: endpoint.path,
  task_id: taskId,
  status: task.status,
  result_count: records.length,
  credits_amount: task.credits_amount ?? null,
  collected_at: new Date().toISOString(),
  items: records,
};
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Saved ${records.length} records to ${outputPath}`);
