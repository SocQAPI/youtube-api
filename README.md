<!-- Generated from the SocQ API catalog and docs. Do not edit by hand. -->
# YouTube API

[![SocQ YouTube API](https://img.shields.io/badge/API-SocQ%20YouTube%20API-F64C31)](https://socq.ai/apis/youtube?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)
[![API documentation](https://img.shields.io/badge/Docs-docs.socq.ai-111827)](https://docs.socq.ai/api-manual/youtube/overview)
[![License: MIT](https://img.shields.io/badge/License-MIT-2563EB)](LICENSE)
[![Check examples](https://github.com/SocQAPI/youtube-api/actions/workflows/check.yml/badge.svg)](https://github.com/SocQAPI/youtube-api/actions/workflows/check.yml)

20 endpoints for public YouTube data through one SocQ API key, with runnable cURL, Node.js and Python examples and a valid request body for every endpoint.

[Browse YouTube APIs](https://socq.ai/apis/youtube?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api) · [Get an API key](https://socq.ai/dashboard/api-key?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api) · [Documentation](https://docs.socq.ai/api-manual/youtube/overview) · [All SocQ examples](https://github.com/SocQAPI/socq-examples)

## Endpoints

Prices are in SocQ credits; 1 credit = $0.005.

| Endpoint | publicId | What it returns | Price | Launched |
| --- | --- | --- | --- | --- |
| [YouTube Channel Videos API](#youtube-channel-videos-api) | `youtube/channel-videos` | Collect normalized regular-video records from one or more public YouTube channel URLs, excluding Shorts and live streams. | 0.5 credits ($0.0025) per result | 2026-07-16 |
| [YouTube Comments API](#youtube-comments-api) | `youtube/comments` | Collect normalized publicly visible YouTube comments, author context, reply references, and engagement from video URLs. | 0.3 credits ($0.0015) per result | 2026-07-16 |
| [YouTube Transcripts API](#youtube-transcripts-api) | `youtube/transcripts` | Retrieve an available plain-text transcript for each public YouTube video URL, with an optional preferred BCP-47 language. | 0.5 credits ($0.0025) per result | 2026-07-16 |
| [YouTube Channels API](#youtube-channels-api) | `youtube/channels` | Retrieve normalized public YouTube channel profiles and visible statistics from one or more channel URLs. | 0.26 credits ($0.0013) per result | 2026-07-16 |
| [YouTube Videos API](#youtube-videos-api) | `youtube/videos` | Retrieve normalized metadata and visible engagement for known public YouTube video or Short URLs. | 0.5 credits ($0.0025) per result | 2026-07-16 |
| [YouTube Shorts API](#youtube-shorts-api) | `youtube/shorts` | Collect normalized public Shorts from one or more YouTube channel URLs, excluding regular videos and live streams. | 0.5 credits ($0.0025) per result | 2026-07-16 |
| [YouTube Search API](#youtube-search-api) | `youtube/search` | Search public YouTube videos by query and return normalized video records with supported sort, date, duration, and caption filters. | 0.5 credits ($0.0025) per result | 2026-07-16 |
| [YouTube Channel Live Videos API](#youtube-channel-live-videos-api) | `youtube/channel-live-videos` | Collect normalized public broadcast records exposed on one or more YouTube channel live surfaces. | 0.5 credits ($0.0025) per result | 2026-07-25 |
| [YouTube Comment Replies API](#youtube-comment-replies-api) | `youtube/comment-replies` | Collect public YouTube replies from a stable video URL and parent comment ID, including text, authors, engagement, timestamps, and thread context. | 0.5 credits ($0.0025) per result | 2026-07-26 |
| [YouTube Community Posts API](#youtube-community-posts-api) | `youtube/community-posts` | Collect public YouTube Community posts from channel URLs, returning post text, channel identity, timestamps, image references, and source context as normalized records. | 0.5 credits ($0.0025) per result | 2026-07-26 |
| [YouTube Hashtag Search API](#youtube-hashtag-search-api) | `youtube/hashtag-search` | Find public YouTube videos from one or more hashtag feeds and return normalized video, channel, media, engagement, and source-hashtag fields. | 0.5 credits ($0.0025) per result | 2026-07-26 |
| [YouTube Playlist Videos API](#youtube-playlist-videos-api) | `youtube/playlist-videos` | Collect normalized videos from public YouTube playlist URLs or IDs, returning titles, channel context, thumbnails, duration, and playlist provenance per record. | 0.5 credits ($0.0025) per result | 2026-07-27 |
| [YouTube Trending Shorts API](#youtube-trending-shorts-api) | `youtube/trending-shorts` | Sample the Shorts trending on YouTube right now, with titles, channels, views, likes, comments, duration, and publish times; each run draws a fresh set. | 0.5 credits ($0.0025) per result | 2026-11-17 |
| [YouTube Community Post API](#youtube-community-post-api) | `youtube/community-post` | Read one YouTube community post from its link, returning the full text, every attached image, the like count, and the posting channel. | 0.5 credits ($0.0025) per call | 2026-11-17 |
| [YouTube Community Post Comments API](#youtube-community-post-comments-api) | `youtube/community-post-comments` | Collect the comments under a YouTube community post from its link, with commenter channels, like counts, and reply counts. | 0.3 credits ($0.0015) per result | 2026-11-17 |
| [YouTube Related Videos API](#youtube-related-videos-api) | `youtube/related-videos` | List the videos YouTube recommends next to a video URL, with titles, channels, view counts, and thumbnails for each recommendation. | 0.5 credits ($0.0025) per result | 2026-11-17 |
| [YouTube Channel Search API](#youtube-channel-search-api) | `youtube/search-channels` | Search YouTube channels by keyword and get channel IDs, names, subscriber counts, avatars, and the description snippet shown in results. | 0.6 credits ($0.003) per result | 2026-11-17 |
| [YouTube Shorts Search API](#youtube-shorts-search-api) | `youtube/search-shorts` | Search YouTube Shorts by keyword and get each Short's link, caption, view count, and vertical thumbnail in YouTube's search order. | 0.6 credits ($0.003) per result | 2026-11-17 |
| [YouTube Search Suggestions API](#youtube-search-suggestions-api) | `youtube/search-suggestions` | Get the autocomplete suggestions YouTube's search box offers for a partial query, ranked, for the language and region you choose. | 0.5 credits ($0.0025) per call | 2026-11-17 |
| [YouTube Email Finder API](#youtube-email-finder-api) | `youtube/channel-email` | Find the public business emails behind a YouTube channel URL, with the pages each address was found on; billed only when an email is found. | 15 credits ($0.075) per result; maximum 15 credits ($0.075) per call | 2026-11-17 |

## Quick start

1. Create an API key at [socq.ai/dashboard/api-key](https://socq.ai/dashboard/api-key?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api).
2. Export it. The examples read only `SOCQ_API_KEY`.

```bash
git clone https://github.com/SocQAPI/youtube-api.git
cd youtube-api
export SOCQ_API_KEY="your-api-key"
```

3. Run any endpoint by its publicId. Without a second argument the script sends `payloads/<slug>.json`; pass a JSON file or an inline JSON object to change the input.

```bash
# Node.js 20+
node examples/node/socq.mjs youtube/channel-videos

# Python 3.8+ (standard library only)
python3 examples/python/socq.py youtube/channel-videos payloads/channel-videos.json

# cURL + jq
bash examples/curl/socq.sh youtube/channel-videos '{"urls":["https://www.youtube.com/@example"],"results_limit":100}'
```

Each script submits the task, polls it until it succeeds or fails, follows every result page, and writes the records to `output/<slug>-<task_id>.json`. Run `npm run check` to validate the payloads and scripts offline.

Never expose `SOCQ_API_KEY` in browser code, mobile apps, public repositories, screenshots, fixtures or logs.

## How the API works

Base URL `https://api.socq.ai`. Every request sends the API key as a bearer token:

```http
Authorization: Bearer <SOCQ_API_KEY>
Content-Type: application/json
```

All endpoints are asynchronous:

```text
POST /v1/<publicId>  ->  data.task_id  ->  GET /v1/tasks/{task_id}  ->  queued | running | succeeded | failed
```

1. **Submit** the JSON body to `POST https://api.socq.ai/v1/<publicId>`. The response returns `data.task_id` immediately; it means the task was created, not that data is ready.
2. **Poll** `GET https://api.socq.ai/v1/tasks/{task_id}` until `data.status` is `succeeded` or `failed` (a failed task carries `data.error_message`).
3. **Read results.** A succeeded task returns normalized records in `data.results.items`. Use `limit` (default 50, max 500) and pass `data.results.next_cursor` as `cursor` while `data.results.has_more` is true. `fields` selects up to 50 comma-separated fields or dot paths.
4. **Raw files (optional).** `GET https://api.socq.ai/v1/tasks/{task_id}/files` lists raw JSONL exports.

```bash
curl "https://api.socq.ai/v1/tasks/$TASK_ID?limit=100" \
  -H "Authorization: Bearer $SOCQ_API_KEY"

curl "https://api.socq.ai/v1/tasks/$TASK_ID?limit=100&cursor=$NEXT_CURSOR" \
  -H "Authorization: Bearer $SOCQ_API_KEY"
```

`callback_url` (where an endpoint accepts it) makes SocQ POST to your URL when the task reaches a terminal state; keep polling as a fallback.

**Billing.** A submit may reserve credits from `results_limit` or the number of submitted inputs; when the task finishes SocQ settles the charge from the actual result count and returns unused reserved credits. `402` means insufficient credits.

**Errors.** `400` invalid body or unsupported field, `401` missing or invalid key, `402` insufficient credits, `403` IP allowlist or task owned by another account, `404` endpoint or task not found, `422` input validation failed, `429` rate or credit-window limit (respect `Retry-After`), `500` submission failed. A client-side timeout does not cancel a task: resume polling the same `task_id` instead of submitting again.

Reference: [Authentication](https://docs.socq.ai/api-manual/agent-api/authentication) · [Task status and results](https://docs.socq.ai/api-manual/agent-api/status) · [Task files](https://docs.socq.ai/api-manual/agent-api/files) · [Callbacks](https://docs.socq.ai/api-manual/agent-api/callbacks) · [Errors](https://docs.socq.ai/api-manual/agent-api/errors)

## Endpoint reference

### YouTube Channel Videos API

Collect normalized regular-video records from one or more public YouTube channel URLs, excluding Shorts and live streams.

- **Request:** `POST https://api.socq.ai/v1/youtube/channel-videos`
- **publicId:** `youtube/channel-videos`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-07-16
- **Example body:** [`payloads/channel-videos.json`](payloads/channel-videos.json)

Collect regular videos from one or more public channels.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `results_limit` | integer | No | (value 1 to 2000) |
| `urls` | array of string | Yes | Public profile or content URLs. (items at least 1) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/channel-videos" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "urls": [
    "https://www.youtube.com/@example"
  ],
  "results_limit": 100
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/channel-videos](https://docs.socq.ai/api-manual/youtube/channel-videos) · Landing page: [socq.ai/apis/youtube/channel-videos](https://socq.ai/apis/youtube/channel-videos?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Comments API

Collect normalized publicly visible YouTube comments, author context, reply references, and engagement from video URLs.

- **Request:** `POST https://api.socq.ai/v1/youtube/comments`
- **publicId:** `youtube/comments`
- **Price:** 0.3 credits ($0.0015) per result
- **Launched:** 2026-07-16
- **Example body:** [`payloads/comments.json`](payloads/comments.json)

Collect comments from one or more public video URLs.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `results_limit` | integer | No | (value 1 to 2000) |
| `sort_by` | string | No | - |
| `urls` | array of string | Yes | Public profile or content URLs. (items at least 1) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/comments" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "urls": [
    "https://www.youtube.com/watch?v=VIDEO_ID"
  ],
  "results_limit": 100,
  "sort_by": "newest"
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/comments](https://docs.socq.ai/api-manual/youtube/comments) · Landing page: [socq.ai/apis/youtube/comments](https://socq.ai/apis/youtube/comments?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Transcripts API

Retrieve an available plain-text transcript for each public YouTube video URL, with an optional preferred BCP-47 language.

- **Request:** `POST https://api.socq.ai/v1/youtube/transcripts`
- **publicId:** `youtube/transcripts`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-07-16
- **Example body:** [`payloads/transcripts.json`](payloads/transcripts.json)

Collect one plain-text transcript for each public video URL.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `language` | string | No | - |
| `urls` | array of string | Yes | Public profile or content URLs. (items at least 1) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/transcripts" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "urls": [
    "https://www.youtube.com/watch?v=VIDEO_ID"
  ],
  "language": "en"
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/transcripts](https://docs.socq.ai/api-manual/youtube/transcripts) · Landing page: [socq.ai/apis/youtube/transcripts](https://socq.ai/apis/youtube/transcripts?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Channels API

Retrieve normalized public YouTube channel profiles and visible statistics from one or more channel URLs.

- **Request:** `POST https://api.socq.ai/v1/youtube/channels`
- **publicId:** `youtube/channels`
- **Price:** 0.26 credits ($0.0013) per result
- **Launched:** 2026-07-16
- **Example body:** [`payloads/channels.json`](payloads/channels.json)

Collect channel metadata for one or more public channel URLs.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `urls` | array of string | Yes | Public profile or content URLs. (items at least 1) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/channels" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "urls": [
    "https://www.youtube.com/@example"
  ]
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/channels](https://docs.socq.ai/api-manual/youtube/channels) · Landing page: [socq.ai/apis/youtube/channels](https://socq.ai/apis/youtube/channels?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Videos API

Retrieve normalized metadata and visible engagement for known public YouTube video or Short URLs.

- **Request:** `POST https://api.socq.ai/v1/youtube/videos`
- **publicId:** `youtube/videos`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-07-16
- **Example body:** [`payloads/videos.json`](payloads/videos.json)

Collect metadata for one or more public video URLs.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `urls` | array of string | Yes | Public profile or content URLs. (items at least 1) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/videos" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "urls": [
    "https://www.youtube.com/watch?v=VIDEO_ID"
  ]
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/videos](https://docs.socq.ai/api-manual/youtube/videos) · Landing page: [socq.ai/apis/youtube/videos](https://socq.ai/apis/youtube/videos?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Shorts API

Collect normalized public Shorts from one or more YouTube channel URLs, excluding regular videos and live streams.

- **Request:** `POST https://api.socq.ai/v1/youtube/shorts`
- **publicId:** `youtube/shorts`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-07-16
- **Example body:** [`payloads/shorts.json`](payloads/shorts.json)

Collect Shorts from one or more public channels.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `results_limit` | integer | No | (value 1 to 2000) |
| `urls` | array of string | Yes | Public profile or content URLs. (items at least 1) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/shorts" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "urls": [
    "https://www.youtube.com/@example"
  ],
  "results_limit": 100
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/shorts](https://docs.socq.ai/api-manual/youtube/shorts) · Landing page: [socq.ai/apis/youtube/shorts](https://socq.ai/apis/youtube/shorts?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Search API

Search public YouTube videos by query and return normalized video records with supported sort, date, duration, and caption filters.

- **Request:** `POST https://api.socq.ai/v1/youtube/search`
- **publicId:** `youtube/search`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-07-16
- **Example body:** [`payloads/search.json`](payloads/search.json)

Search public videos using stable, provider-independent filters.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `duration` | string | No | - |
| `has_captions` | boolean | No | - |
| `published_within` | string | No | - |
| `query` | string | Yes | Search query. |
| `results_limit` | integer | No | (value 1 to 2000) |
| `sort_by` | string | No | - |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/search" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "query": "web scraping tutorials",
  "results_limit": 50,
  "sort_by": "relevance",
  "published_within": "month",
  "duration": "medium",
  "has_captions": true
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/search](https://docs.socq.ai/api-manual/youtube/search) · Landing page: [socq.ai/apis/youtube/search](https://socq.ai/apis/youtube/search?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Channel Live Videos API

Collect normalized public broadcast records exposed on one or more YouTube channel live surfaces.

- **Request:** `POST https://api.socq.ai/v1/youtube/channel-live-videos`
- **publicId:** `youtube/channel-live-videos`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-07-25
- **Example body:** [`payloads/channel-live-videos.json`](payloads/channel-live-videos.json)

Collect public live videos from YouTube channels. Results are normalized and billed by the actual saved record count.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `results_limit` | integer | No | (value 20 to 2000; default `100`) |
| `urls` | array of string | Yes | Public profile or content URLs. (items at least 1) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/channel-live-videos" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "urls": [
    "https://www.youtube.com/@YouTube"
  ],
  "results_limit": 20
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/channel-live-videos](https://docs.socq.ai/api-manual/youtube/channel-live-videos) · Landing page: [socq.ai/apis/youtube/channel-live-videos](https://socq.ai/apis/youtube/channel-live-videos?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Comment Replies API

Collect public YouTube replies from a stable video URL and parent comment ID, including text, authors, engagement, timestamps, and thread context.

- **Request:** `POST https://api.socq.ai/v1/youtube/comment-replies`
- **publicId:** `youtube/comment-replies`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-07-26
- **Example body:** [`payloads/comment-replies.json`](payloads/comment-replies.json)

Collect public replies for a YouTube comment. Results are normalized and billed by the actual saved record count.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `comment_id` | string | One of* | A public comment identifier. |
| `continuation_token` | string | One of* | The token used to continue a YouTube reply collection. |
| `results_limit` | integer | No | (value 20 to 2000; default `100`) |
| `url` | string | One of* | A public content or product URL. |

*Required rule: send at least one of these field sets: `comment_id` + `url`, `continuation_token`.

```bash
curl -X POST "https://api.socq.ai/v1/youtube/comment-replies" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "comment_id": "Ugzge340dBgB75hWBm54AaABAg",
  "results_limit": 20
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/comment-replies](https://docs.socq.ai/api-manual/youtube/comment-replies) · Landing page: [socq.ai/apis/youtube/comment-replies](https://socq.ai/apis/youtube/comment-replies?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Community Posts API

Collect public YouTube Community posts from channel URLs, returning post text, channel identity, timestamps, image references, and source context as normalized records.

- **Request:** `POST https://api.socq.ai/v1/youtube/community-posts`
- **publicId:** `youtube/community-posts`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-07-26
- **Example body:** [`payloads/community-posts.json`](payloads/community-posts.json)

Collect public YouTube community posts. Results are normalized and billed by the actual saved record count.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `results_limit` | integer | No | (value 20 to 2000; default `100`) |
| `urls` | array of string | Yes | Public profile or content URLs. (items at least 1) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/community-posts" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "urls": [
    "https://www.youtube.com/@YouTube"
  ],
  "results_limit": 20
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/community-posts](https://docs.socq.ai/api-manual/youtube/community-posts) · Landing page: [socq.ai/apis/youtube/community-posts](https://socq.ai/apis/youtube/community-posts?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Hashtag Search API

Find public YouTube videos from one or more hashtag feeds and return normalized video, channel, media, engagement, and source-hashtag fields.

- **Request:** `POST https://api.socq.ai/v1/youtube/hashtag-search`
- **publicId:** `youtube/hashtag-search`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-07-26
- **Example body:** [`payloads/hashtag-search.json`](payloads/hashtag-search.json)

Search public YouTube videos by hashtag. Results are normalized and billed by the actual saved record count.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `content_type` | string | No | - |
| `hashtags` | array of string | Yes | Hashtags with or without the # prefix. (items at least 1) |
| `results_limit` | integer | No | (value 20 to 2000; default `100`) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/hashtag-search" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "hashtags": [
    "#technology"
  ],
  "results_limit": 20
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/hashtag-search](https://docs.socq.ai/api-manual/youtube/hashtag-search) · Landing page: [socq.ai/apis/youtube/hashtag-search](https://socq.ai/apis/youtube/hashtag-search?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Playlist Videos API

Collect normalized videos from public YouTube playlist URLs or IDs, returning titles, channel context, thumbnails, duration, and playlist provenance per record.

- **Request:** `POST https://api.socq.ai/v1/youtube/playlist-videos`
- **publicId:** `youtube/playlist-videos`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-07-27
- **Example body:** [`payloads/playlist-videos.json`](payloads/playlist-videos.json)

Collect normalized video records from one or more public playlists.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `results_limit` | integer | No | (value 10 to 2000) |
| `urls` | array of string | Yes | Public profile or content URLs. (items at least 1) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/playlist-videos" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "urls": [
    "https://www.youtube.com/playlist?list=PLAYLIST_ID"
  ],
  "results_limit": 100
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/playlist-videos](https://docs.socq.ai/api-manual/youtube/playlist-videos) · Landing page: [socq.ai/apis/youtube/playlist-videos](https://socq.ai/apis/youtube/playlist-videos?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Trending Shorts API

Sample the Shorts trending on YouTube right now, with titles, channels, views, likes, comments, duration, and publish times; each run draws a fresh set.

- **Request:** `POST https://api.socq.ai/v1/youtube/trending-shorts`
- **publicId:** `youtube/trending-shorts`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-11-17
- **Example body:** [`payloads/trending-shorts.json`](payloads/trending-shorts.json)

Pull the Shorts YouTube is currently surfacing as trending, each with its title, channel, views, likes, comments, length and publish time. Every run takes a fresh sample from the trending pool, so a scheduled job builds a wider picture of what is taking off over the day.

Every field is optional. results_limit sets how many Shorts to return (default 48, up to 200). Each run samples what is trending at that moment, so two runs a few minutes apart share only a handful of Shorts.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `results_limit` | integer | No | (value 1 to 200; default `48`) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/trending-shorts" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "results_limit": 48
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/trending-shorts](https://docs.socq.ai/api-manual/youtube/trending-shorts) · Landing page: [socq.ai/apis/youtube/trending-shorts](https://socq.ai/apis/youtube/trending-shorts?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Community Post API

Read one YouTube community post from its link, returning the full text, every attached image, the like count, and the posting channel.

- **Request:** `POST https://api.socq.ai/v1/youtube/community-post`
- **publicId:** `youtube/community-post`
- **Price:** 0.5 credits ($0.0025) per call
- **Launched:** 2026-11-17
- **Example body:** [`payloads/community-post.json`](payloads/community-post.json)

Read one YouTube community post from its link and get the full text, every attached image, the like count and the channel that posted it. Reach for it when you already hold a post URL — copied from a channel's Posts tab, a share link, or a YouTube Community Posts result — and want the complete record behind it.

url is required. Use a https://www.youtube.com/post/{post_id} link, or a channel Posts link that carries ?lb={post_id}. Each request is billed once.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `url` | string | Yes | YouTube community post URL, such as https://www.youtube.com/post/Ugkx... |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/community-post" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "url": "https://www.youtube.com/post/Ugkxvj2KoApYAXoqLWnKVr6zZe5JjeHrQeP8"
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/community-post](https://docs.socq.ai/api-manual/youtube/community-post) · Landing page: [socq.ai/apis/youtube/community-post](https://socq.ai/apis/youtube/community-post?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Community Post Comments API

Collect the comments under a YouTube community post from its link, with commenter channels, like counts, and reply counts.

- **Request:** `POST https://api.socq.ai/v1/youtube/community-post-comments`
- **publicId:** `youtube/community-post-comments`
- **Price:** 0.3 credits ($0.0015) per result
- **Launched:** 2026-11-17
- **Example body:** [`payloads/community-post-comments.json`](payloads/community-post-comments.json)

Collect what viewers write under a creator's community post — polls, announcements, image drops — with each commenter's channel, the like count and how many replies the comment drew. Post comments live apart from video comments, so this is where you read the reaction to a creator's updates between uploads.

url is required: the post's /post/ link, or a channel Posts link with ?lb={post_id}. results_limit defaults to 100 and accepts 1 to 1000.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `results_limit` | integer | No | (value 1 to 1000; default `100`) |
| `url` | string | Yes | YouTube community post URL, such as https://www.youtube.com/post/Ugkx... |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/community-post-comments" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "url": "https://www.youtube.com/post/UgkxX6gkDxQ0KRucvyG7NLui0LhjHp0CLlfZ",
  "results_limit": 100
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/community-post-comments](https://docs.socq.ai/api-manual/youtube/community-post-comments) · Landing page: [socq.ai/apis/youtube/community-post-comments](https://socq.ai/apis/youtube/community-post-comments?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Related Videos API

List the videos YouTube recommends next to a video URL, with titles, channels, view counts, and thumbnails for each recommendation.

- **Request:** `POST https://api.socq.ai/v1/youtube/related-videos`
- **publicId:** `youtube/related-videos`
- **Price:** 0.5 credits ($0.0025) per result
- **Launched:** 2026-11-17
- **Example body:** [`payloads/related-videos.json`](payloads/related-videos.json)

Get the list YouTube places beside a video as what to watch next: titles, channels, view counts and thumbnails. Run it on your own uploads or a competitor's to see which videos and channels YouTube treats as their neighbours — the company a video keeps in recommendations.

url is required: a watch, youtu.be, Shorts or live link. One run returns the whole recommendation list, usually about 20 videos, billed per video.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `url` | string | Yes | YouTube video or Shorts URL, such as https://www.youtube.com/watch?v=dQw4w9WgXcQ |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/related-videos" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/related-videos](https://docs.socq.ai/api-manual/youtube/related-videos) · Landing page: [socq.ai/apis/youtube/related-videos](https://socq.ai/apis/youtube/related-videos?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Channel Search API

Search YouTube channels by keyword and get channel IDs, names, subscriber counts, avatars, and the description snippet shown in results.

- **Request:** `POST https://api.socq.ai/v1/youtube/search-channels`
- **publicId:** `youtube/search-channels`
- **Price:** 0.6 credits ($0.003) per result
- **Launched:** 2026-11-17
- **Example body:** [`payloads/search-channels.json`](payloads/search-channels.json)

Find channels that match a keyword, with channel names, subscriber counts, avatars and the description snippet YouTube shows under each result. It is the first step of creator discovery: shortlist channels here, then pull their details with YouTube Channels or their uploads with YouTube Channel Videos.

query is required. results_limit defaults to 20 and accepts 1 to 200. Channels come back in YouTube's own search order.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `query` | string | Yes | Keywords to search YouTube for. (length 1 to 100) |
| `results_limit` | integer | No | (value 1 to 200; default `20`) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/search-channels" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "query": "home cooking",
  "results_limit": 20
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/search-channels](https://docs.socq.ai/api-manual/youtube/search-channels) · Landing page: [socq.ai/apis/youtube/search-channels](https://socq.ai/apis/youtube/search-channels?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Shorts Search API

Search YouTube Shorts by keyword and get each Short's link, caption, view count, and vertical thumbnail in YouTube's search order.

- **Request:** `POST https://api.socq.ai/v1/youtube/search-shorts`
- **publicId:** `youtube/search-shorts`
- **Price:** 0.6 credits ($0.003) per result
- **Launched:** 2026-11-17
- **Example body:** [`payloads/search-shorts.json`](payloads/search-shorts.json)

Search YouTube for Shorts that match a keyword and get each Short's link, caption, view count and vertical thumbnail. Search results carry only those basics, so pass the links you keep to YouTube Videos when you also need likes, comments or channel details.

query is required. results_limit defaults to 25 and accepts 1 to 200. Shorts come back in YouTube's search order.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `query` | string | Yes | Keywords to search YouTube for. (length 1 to 100) |
| `results_limit` | integer | No | (value 1 to 200; default `25`) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/search-shorts" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "query": "meal prep",
  "results_limit": 25
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/search-shorts](https://docs.socq.ai/api-manual/youtube/search-shorts) · Landing page: [socq.ai/apis/youtube/search-shorts](https://socq.ai/apis/youtube/search-shorts?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Search Suggestions API

Get the autocomplete suggestions YouTube's search box offers for a partial query, ranked, for the language and region you choose.

- **Request:** `POST https://api.socq.ai/v1/youtube/search-suggestions`
- **publicId:** `youtube/search-suggestions`
- **Price:** 0.5 credits ($0.0025) per call
- **Launched:** 2026-11-17
- **Example body:** [`payloads/search-suggestions.json`](payloads/search-suggestions.json)

Send the start of a search and get back the completions YouTube's search box proposes, ranked the way viewers see them. Switch language and region to watch the same seed branch out differently in another market — useful for keyword research, video titles and tag ideas.

query is required. language (default en) and region (default US) choose the market the suggestions come from. Each request is billed once, whatever the number of suggestions.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `language` | string | No | Language code for the suggestions, such as en, es or pt-BR. (pattern `^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})?$`; default `"en"`) |
| `query` | string | Yes | The partial search text to complete. (length 1 to 100) |
| `region` | string | No | Two-letter country code of the search market, such as US or GB. (pattern `^[A-Za-z]{2}$`; default `"US"`) |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/search-suggestions" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "query": "iphone 17"
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/search-suggestions](https://docs.socq.ai/api-manual/youtube/search-suggestions) · Landing page: [socq.ai/apis/youtube/search-suggestions](https://socq.ai/apis/youtube/search-suggestions?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

### YouTube Email Finder API

Find the public business emails behind a YouTube channel URL, with the pages each address was found on; billed only when an email is found.

- **Request:** `POST https://api.socq.ai/v1/youtube/channel-email`
- **publicId:** `youtube/channel-email`
- **Price:** 15 credits ($0.075) per result; maximum 15 credits ($0.075) per call
- **Launched:** 2026-11-17
- **Example body:** [`payloads/channel-email.json`](payloads/channel-email.json)

Look up the business emails a YouTube creator has published — in the channel description, on linked social profiles, link-in-bio pages or the creator's own site — and see the page each address was found on. Built for outreach lists: run it over the channels you shortlisted and keep the ones that list a contact.

url is required: a channel link in the @handle or /channel/UC... form. A channel with at least one public email returns one result with every address found and is billed 15 credits; a channel that lists none returns an empty result free of charge.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `callback_url` | string (uri) | No | - |
| `url` | string | Yes | YouTube channel URL in the @handle or /channel/UC... form. |

```bash
curl -X POST "https://api.socq.ai/v1/youtube/channel-email" \
  -H "Authorization: Bearer $SOCQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "url": "https://www.youtube.com/@mkbhd"
}'
```

Full docs: [https://docs.socq.ai/api-manual/youtube/channel-email](https://docs.socq.ai/api-manual/youtube/channel-email) · Landing page: [socq.ai/apis/youtube/channel-email](https://socq.ai/apis/youtube/channel-email?utm_source=github&utm_medium=readme&utm_campaign=socq-youtube-api)

## Repository contents

| Path | Purpose |
| --- | --- |
| [`examples/curl/socq.sh`](examples/curl/socq.sh) | Submit, poll and paginate with cURL and jq |
| [`examples/node/socq.mjs`](examples/node/socq.mjs) | Same workflow in Node.js 20+ (no dependencies) |
| [`examples/python/socq.py`](examples/python/socq.py) | Same workflow in Python 3.8+ (standard library) |
| [`payloads/`](payloads) | One documented request body per endpoint |
| [`endpoints.json`](endpoints.json) | Endpoint list, prices and request schemas used by the scripts and checks |
| [`fixtures/`](fixtures) | Synthetic submit and task response shapes |
| [`docs/production-notes.md`](docs/production-notes.md) | Retries, timeouts, pagination and data handling |
| [`scripts/check.mjs`](scripts/check.mjs) | Offline check: payloads, syntax and secrets |

## Responsible use and platform scope

- Use only publicly accessible YouTube data and the fields supported by each endpoint.
- Do not use the examples to access restricted content, login-only surfaces, authentication controls or non-public personal information.
- SocQ is not an official API of the represented platform and is not affiliated with or endorsed by it. Platform names and trademarks belong to their respective owners.
- Before production use, assess the laws, platform terms, privacy obligations and retention requirements that apply to your organization and use case.
- Collect only the fields needed for a defined purpose, restrict access, set retention periods, and support correction or deletion workflows where required.

This section describes the public-data boundary; it is not legal advice.

## License

[MIT](LICENSE)
