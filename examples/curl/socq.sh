#!/usr/bin/env bash
# Submit a SocQ task, poll it, read every result page and save the records.
# Usage: bash examples/curl/socq.sh <publicId> [params.json | '{"json":"object"}']
#        bash examples/curl/socq.sh --list
# Requires curl and jq. Reads only SOCQ_API_KEY.
set -euo pipefail

BASE_URL="https://api.socq.ai"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CATALOG="$ROOT/endpoints.json"
POLL_SECONDS=3
TIMEOUT_SECONDS=600
PAGE_LIMIT=100

die() { echo "error: $*" >&2; exit 1; }

for tool in curl jq; do
  command -v "$tool" >/dev/null 2>&1 || die "$tool is required"
done

if [ "$#" -lt 1 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ] || [ "$1" = "--list" ]; then
  echo "Usage: bash examples/curl/socq.sh <publicId> [params.json | '{\"json\":\"object\"}']"
  echo "Endpoints:"
  jq -r '.endpoints[] | "  \(.publicId)\t\(.name)"' "$CATALOG"
  [ "$#" -ge 1 ] && exit 0 || exit 1
fi

PUBLIC_ID="$1"
PARAMS="${2:-}"
[[ "$PUBLIC_ID" =~ ^[a-z0-9-]+/[a-z0-9-]+$ ]] || die "invalid publicId: $PUBLIC_ID"
ENDPOINT="$(jq -c --arg id "$PUBLIC_ID" '.endpoints[] | select(.publicId == $id)' "$CATALOG")"
[ -n "$ENDPOINT" ] || die "unknown endpoint $PUBLIC_ID (run with --list)"

if [ -z "$PARAMS" ]; then
  BODY="$(cat "$ROOT/$(jq -r '.payload' <<<"$ENDPOINT")")"
elif [[ "$PARAMS" =~ ^[[:space:]]*\{ ]]; then
  BODY="$PARAMS"
else
  [ -f "$PARAMS" ] || die "params file not found: $PARAMS"
  BODY="$(cat "$PARAMS")"
fi
BODY="$(jq -ce 'if type == "object" then . else error("params must be a JSON object") end' <<<"$BODY")" \
  || die "params must be a JSON object"

[ -n "${SOCQ_API_KEY:-}" ] && [ "$SOCQ_API_KEY" != "your-api-key" ] || die "set SOCQ_API_KEY first"

# api METHOD PATH [BODY] -> prints the response body; retries 429 (and 5xx on GET).
api() {
  local method="$1" path="$2" body="${3:-}" attempt=0 response status payload
  while :; do
    if [ "$method" = "POST" ]; then
      response="$(curl -sS -X POST "$BASE_URL$path" \
        -H "Authorization: Bearer $SOCQ_API_KEY" \
        -H "Content-Type: application/json" \
        --data-binary "$body" -w $'\n%{http_code}')"
    else
      response="$(curl -sS "$BASE_URL$path" \
        -H "Authorization: Bearer $SOCQ_API_KEY" -w $'\n%{http_code}')"
    fi
    status="${response##*$'\n'}"
    payload="${response%$'\n'*}"
    if { [ "$status" = "429" ] || { [ "$method" = "GET" ] && [ "$status" -ge 500 ]; }; } && [ "$attempt" -lt 3 ]; then
      sleep $((2 ** attempt))
      attempt=$((attempt + 1))
      continue
    fi
    if [ "$status" -lt 200 ] || [ "$status" -ge 300 ]; then
      die "HTTP $status: $(jq -r '.error.message // .message // "request failed"' <<<"$payload" 2>/dev/null || echo "request failed")"
    fi
    printf '%s' "$payload"
    return 0
  done
}

SUBMITTED="$(api POST "/v1/$PUBLIC_ID" "$BODY")"
TASK_ID="$(jq -r '.data.task_id // empty' <<<"$SUBMITTED")"
[ -n "$TASK_ID" ] || die "submit response did not include data.task_id"
echo "Submitted $PUBLIC_ID task $TASK_ID"

DEADLINE=$(( $(date +%s) + TIMEOUT_SECONDS ))
while :; do
  TASK="$(api GET "/v1/tasks/$TASK_ID?limit=$PAGE_LIMIT")"
  STATUS="$(jq -r '.data.status' <<<"$TASK")"
  [ "$STATUS" = "succeeded" ] && break
  [ "$STATUS" = "failed" ] && die "task failed: $(jq -r '.data.error_message // "unknown error"' <<<"$TASK")"
  [ "$(date +%s)" -lt "$DEADLINE" ] || die "timed out waiting for task $TASK_ID (status $STATUS)"
  sleep "$POLL_SECONDS"
done

PAGES="$(mktemp -d)"
trap 'rm -rf "$PAGES"' EXIT
jq '.data.results.items // []' <<<"$TASK" >"$PAGES/0.json"
PAGE=0
CURSOR="$(jq -r 'if .data.results.has_more == true then .data.results.next_cursor // empty else empty end' <<<"$TASK")"
while [ -n "$CURSOR" ]; do
  PAGE=$((PAGE + 1))
  ENCODED="$(jq -rn --arg c "$CURSOR" '$c | @uri')"
  NEXT="$(api GET "/v1/tasks/$TASK_ID?limit=$PAGE_LIMIT&cursor=$ENCODED")"
  jq '.data.results.items // []' <<<"$NEXT" >"$PAGES/$PAGE.json"
  CURSOR="$(jq -r 'if .data.results.has_more == true then .data.results.next_cursor // empty else empty end' <<<"$NEXT")"
done

PAGE_FILES=()
for i in $(seq 0 "$PAGE"); do PAGE_FILES+=("$PAGES/$i.json"); done

SLUG="${PUBLIC_ID#*/}"
mkdir -p "$ROOT/output"
OUTPUT="$ROOT/output/$SLUG-$TASK_ID.json"
jq -s --arg endpoint "/v1/$PUBLIC_ID" --arg task "$TASK_ID" --arg at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '
  (add // []) as $all
  | (reduce $all[] as $item ({seen: {}, out: []};
      (($item.id // ($item | tostring)) | tostring) as $key
      | if .seen[$key] then . else .seen[$key] = true | .out += [$item] end) | .out) as $items
  | {endpoint: $endpoint, task_id: $task, status: "succeeded", result_count: ($items | length), collected_at: $at, items: $items}
' "${PAGE_FILES[@]}" >"$OUTPUT"
echo "Saved $(jq '.result_count' "$OUTPUT") records to $OUTPUT"
