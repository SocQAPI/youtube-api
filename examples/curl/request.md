# cURL example

`socq.sh` runs the complete flow with `curl` and `jq`:

```bash
export SOCQ_API_KEY="your-api-key"
bash examples/curl/socq.sh <publicId>                     # sends payloads/<slug>.json
bash examples/curl/socq.sh <publicId> path/to/params.json
bash examples/curl/socq.sh <publicId> '{"field":"value"}'
bash examples/curl/socq.sh --list
```

The same flow by hand:

```bash
# 1. Submit
curl -X POST "https://api.socq.ai/v1/<publicId>" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  --data @payloads/<slug>.json

# 2. Poll with the returned data.task_id until data.status is succeeded or failed
curl "https://api.socq.ai/v1/tasks/$TASK_ID?limit=100" \
  -H "Authorization: Bearer $SOCQ_API_KEY"

# 3. While data.results.has_more is true, pass data.results.next_cursor
curl "https://api.socq.ai/v1/tasks/$TASK_ID?limit=100&cursor=$NEXT_CURSOR" \
  -H "Authorization: Bearer $SOCQ_API_KEY"
```
