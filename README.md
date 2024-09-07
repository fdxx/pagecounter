## About
PageCounter is an API for tracking page views, deployed using [Cloudflare Workers](https://developers.cloudflare.com/workers/) and [Cloudflare D1](https://developers.cloudflare.com/d1/).

If you want to self-host, check out the self-host branch.

## Deploy
```bash
git clone https://github.com/fdxx/pagecounter
cd pagecounter
npm install

## https://developers.cloudflare.com/workers/wrangler/ci-cd/#api-token
## Generate your cf token.
export CLOUDFLARE_API_TOKEN=xxx
export CLOUDFLARE_ACCOUNT_ID=xxx

## Create a database
wrangler d1 create pagecounter

## After successful creation, write the returned database info into wrangler.toml
[[d1_databases]]
binding = "DB" # available in your Worker on env.DB
database_name = "pagecounter"
database_id = "xxx"

## Create a table
wrangler d1 execute pagecounter --remote -y --file ./schema.sql

## Deploy to Cloudflare
npm run deploy

## After successful deployment, the access URL will be returned.
Deployed pagecounter triggers (0.30 sec)
  https://xx.workers.dev
Current Version ID: xx
```

## How it works
### `/pageviews`
POST Request Routing

### Request body
application/json

- `domain`: To distinguish different domains.
- `path`: Page Path.

### Processing
- If `domain` && `path` are found, update count+1.
- If not found then insert.

### Response
json object with `count` fields.

## Example

### Request
```bash
curl -X POST https://xx.workers.dev/pageviews -H "Content-Type: application/json" -d '{"domain": "exp.com", "path": "/blog/"}'
```

### Response
```json
{"ret":"OK","data":{"_id":1,"domain":"exp.com","path":"/blog/","count":7}}
```

