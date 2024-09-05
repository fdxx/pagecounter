## About
PageCounter is a [Nodejs](https://nodejs.org/) based API for tracking pageviews. It uses [MongoDB](https://www.mongodb.com/) to store per-page visit data and allows updating and getting pageviews with a simple POST request.

## Run
Install Nodejs and MongoDB.

```bash
git clone https://github.com/fdxx/pagecounter
cd pagecounter
node install

## Start
node index.js
```

## Environment variables
- **DBURI**: Specify database url. default value `mongodb://127.0.0.1:27017/pagecounter`
- **PORT**: Specify the service port. default value `3005`

Example:

```bash
export DBURI='mongodb://user:pwd@host/mydatabase'
export PORT=3000
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
{"_id":"66d47f4f8c5d7381b5f7fcd6","domain":"exp.com","path":"/blog/","count":18,"__v":0}
```
