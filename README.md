## About
PageCounter is an API for tracking page views, self-host plan, Use MongoDB or MySQL to store data.

deployed using Cloudflare Workers and Cloudflare D1 in [main](https://github.com/fdxx/pagecounter) branch.

## Run

```bash
git clone https://github.com/fdxx/pagecounter
cd pagecounter
npm install

## Start
node index.js
```

## Environment variables
- **DBURL**: Specify database url. default value `mongodb://127.0.0.1:27017/pagecounter`
- **PORT**: Specify the service port. default value `3005`

Example:

```bash
## use MongoDB
export DBURL='mongodb://user:pwd@host/mydatabase'
export PORT=3000
node index.js

## use MySQL
export DBURL='mysql://user:pwd@host/mydatabase'
node index.js
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
curl -X POST http://127.0.0.1:3005/pageviews -H "Content-Type: application/json" -d '{"domain": "exp.com", "path": "/blog/"}'
```
### Response
```json
{"ret":"OK","data":{"_id":1,"domain":"exp.com","path":"/blog/","count":1}}
```
