# Production notes

## Shared integration controls

- Keep `SOCQ_API_KEY` on the server and outside browser, mobile, fixture, screenshot, and log output.
- Validate every input before submit against the endpoint's request schema in `endpoints.json`; reject empty arrays, unsupported URL shapes, and invalid enum values.
- Persist `data.task_id` before polling so interrupted workers can resume. A client-side timeout does not cancel the task.
- Use bounded retries with backoff for `429` and transient `5xx` responses, and respect `Retry-After`. Do not resubmit blindly after a network timeout: query the existing task first so you are not charged twice.
- Treat `succeeded` and `failed` as terminal states and enforce an application-level timeout.
- Read every result page by following `results.next_cursor` until `results.has_more` is false (`limit` is at most 500).
- Deduplicate stored records by stable record ID when a workflow can be retried.
- Log task IDs, status transitions, durations, and record counts; never log credentials or full sensitive payloads.
- Keep callback handling idempotent and retain polling as a fallback when callbacks are used.
- Store `collected_at` with records whose public fields or metrics can change over time.
- API keys may carry an IP allowlist, requests-per-minute limits, and hourly or daily credit limits that apply independently of the account balance.

## Data handling

- Treat public records as changeable snapshots rather than permanent truth.
- Keep raw payloads and exported result files in access-controlled storage.
- Define a retention period and remove data that is no longer needed.
- Avoid using missing optional fields as evidence that a value is zero or false; declared fields stay present with `null` when unavailable.
- Review platform terms, privacy requirements, and applicable law before launch.
