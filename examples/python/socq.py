#!/usr/bin/env python3
"""Submit a SocQ task, poll it, read every result page and save the records.

Usage: python3 examples/python/socq.py <publicId> [params.json | '{"json":"object"}']
       python3 examples/python/socq.py --list
Python 3.8+, standard library only. Reads only SOCQ_API_KEY.
"""

import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASE_URL = "https://api.socq.ai"
POLL_SECONDS = 3
TIMEOUT_SECONDS = 10 * 60
PAGE_LIMIT = 100
ROOT = Path(__file__).resolve().parent.parent.parent


def load_json(path):
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def usage(catalog):
    print("Usage: python3 examples/python/socq.py <publicId> [params.json | '{\"json\":\"object\"}']")
    print("Endpoints:")
    for endpoint in catalog["endpoints"]:
        print("  {}\t{}".format(endpoint["publicId"], endpoint["name"]))


def request(api_key, method, path, body=None):
    """Retry 429 on every request and transient 5xx/network errors on GET only."""
    data = None if body is None else json.dumps(body).encode("utf-8")
    for attempt in range(4):
        req = urllib.request.Request(
            BASE_URL + path,
            data=data,
            method=method,
            headers={
                "Authorization": "Bearer " + api_key,
                "Content-Type": "application/json",
            },
        )
        retry_after = None
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as error:
            status = error.code
            raw = error.read().decode("utf-8", "replace")
            retryable = status == 429 or (method == "GET" and status >= 500)
            if not retryable or attempt == 3:
                message = "HTTP {}".format(status)
                try:
                    payload = json.loads(raw)
                    message = (payload.get("error") or {}).get("message") or payload.get("message") or message
                except (ValueError, AttributeError):
                    pass
                raise RuntimeError("SocQ request failed ({}): {}".format(status, message))
            retry_after = error.headers.get("Retry-After")
        except urllib.error.URLError:
            if method != "GET" or attempt == 3:
                raise
        try:
            delay = float(retry_after) if retry_after else 2 ** attempt
        except ValueError:
            delay = 2 ** attempt
        time.sleep(delay)
    raise RuntimeError("SocQ request failed after retries.")


def main(argv):
    catalog = load_json(ROOT / "endpoints.json")
    if not argv or argv[0] in ("-h", "--help", "--list"):
        usage(catalog)
        return 0 if argv else 1
    public_id = argv[0]
    endpoint = next((e for e in catalog["endpoints"] if e["publicId"] == public_id), None)
    if endpoint is None:
        raise SystemExit("Unknown endpoint {}. Run with --list.".format(public_id))

    if len(argv) < 2:
        params = load_json(ROOT / endpoint["payload"])
    elif argv[1].strip().startswith("{"):
        params = json.loads(argv[1])
    else:
        params = load_json(argv[1])
    if not isinstance(params, dict):
        raise SystemExit("Params must be a JSON object.")

    api_key = os.environ.get("SOCQ_API_KEY")
    if not api_key or api_key == "your-api-key":
        raise SystemExit("Set SOCQ_API_KEY first.")

    submitted = request(api_key, "POST", endpoint["path"], params)
    task_id = (submitted.get("data") or {}).get("task_id")
    if not task_id:
        raise RuntimeError("Submit response did not include data.task_id.")
    print("Submitted {} task {}".format(public_id, task_id))

    task_path = "/v1/tasks/" + urllib.parse.quote(task_id, safe="")
    deadline = time.time() + TIMEOUT_SECONDS
    while True:
        task = request(api_key, "GET", "{}?limit={}".format(task_path, PAGE_LIMIT)).get("data") or {}
        if task.get("status") == "succeeded":
            break
        if task.get("status") == "failed":
            raise RuntimeError(task.get("error_message") or "Task {} failed.".format(task_id))
        if time.time() > deadline:
            raise TimeoutError("Timed out waiting for task {} (status {}).".format(task_id, task.get("status")))
        time.sleep(POLL_SECONDS)

    results = task.get("results") or {}
    items = list(results.get("items") or [])
    cursor = results.get("next_cursor") if results.get("has_more") is True else None
    while cursor:
        query = urllib.parse.urlencode({"limit": PAGE_LIMIT, "cursor": cursor})
        page = (request(api_key, "GET", "{}?{}".format(task_path, query)).get("data") or {}).get("results") or {}
        items.extend(page.get("items") or [])
        cursor = page.get("next_cursor") if page.get("has_more") is True else None

    seen = set()
    records = []
    for item in items:
        has_id = isinstance(item, dict) and item.get("id") is not None
        key = str(item["id"]) if has_id else json.dumps(item, sort_keys=True)
        if key in seen:
            continue
        seen.add(key)
        records.append(item)

    slug = public_id.split("/", 1)[1]
    output_path = ROOT / "output" / "{}-{}.json".format(slug, task_id)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output = {
        "endpoint": endpoint["path"],
        "task_id": task_id,
        "status": task.get("status"),
        "result_count": len(records),
        "credits_amount": task.get("credits_amount"),
        "collected_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "items": records,
    }
    output_path.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Saved {} records to {}".format(len(records), output_path))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
